/* Inicio de sesión del administrador (/admin) con GitHub, paso 2 de 2.
   GitHub regresa aquí con un código; se cambia por un token y se entrega
   SOLO a la ventana del administrador del mismo sitio.
   Requiere en Vercel: OAUTH_CLIENT_ID y OAUTH_CLIENT_SECRET. */

function leerCookie(req, nombre) {
  for (const parte of (req.headers.cookie || '').split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nombre) return v.join('=');
  }
  return '';
}

module.exports = async (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origen = `https://${host}`;
  let estado = 'error';
  let contenido = { message: 'No se pudo iniciar sesión. Cierre esta ventana e intente de nuevo.' };

  try {
    const { code, state } = req.query;
    const guardado = leerCookie(req, 'decap_oauth_state');
    if (!code || !state || !guardado || state !== guardado) {
      throw new Error('El inicio de sesión expiró o no es válido. Cierre esta ventana e intente de nuevo.');
    }
    if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
      throw new Error('Faltan OAUTH_CLIENT_ID u OAUTH_CLIENT_SECRET en Vercel.');
    }
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: `${origen}/api/callback`
      })
    });
    const datos = await r.json();
    if (!datos.access_token) throw new Error('GitHub no autorizó el acceso: ' + (datos.error_description || datos.error || 'sin detalle'));
    estado = 'success';
    contenido = { token: datos.access_token, provider: 'github' };
  } catch (e) {
    contenido = { message: e.message };
  }

  const mensaje = `authorization:github:${estado}:${JSON.stringify(contenido)}`;
  const js = s => JSON.stringify(s).replace(/</g, '\\u003c');
  res.setHeader('Set-Cookie', 'decap_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.end(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Iniciando sesión</title></head>
<body style="font-family:system-ui,sans-serif;padding:24px">
<p>${estado === 'success' ? 'Listo. Esta ventana se cerrará sola.' : 'No se pudo iniciar sesión. Puede cerrar esta ventana.'}</p>
<script>
(function () {
  var origen = ${js(origen)};
  var mensaje = ${js(mensaje)};
  if (!window.opener) return;
  function responder(e) {
    if (e.origin !== origen) return;
    window.removeEventListener('message', responder);
    window.opener.postMessage(mensaje, origen);
  }
  window.addEventListener('message', responder);
  window.opener.postMessage('authorizing:github', origen);
})();
</script>
</body></html>`);
};
