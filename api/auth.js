/* Inicio de sesión del administrador (/admin) con GitHub, paso 1 de 2.
   Envía a la persona a GitHub para autorizar. Requiere en Vercel la variable
   OAUTH_CLIENT_ID (de la OAuth App de GitHub). */
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Falta configurar OAUTH_CLIENT_ID en Vercel.');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const scope = req.query.scope === 'public_repo' ? 'public_repo' : 'repo';
  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://${host}/api/callback`,
    scope,
    state
  });
  res.setHeader('Set-Cookie', `decap_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', 'https://github.com/login/oauth/authorize?' + params.toString());
  res.end();
};
