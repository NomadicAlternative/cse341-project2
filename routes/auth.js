// Authentication routes: start the GitHub OAuth flow, handle the callback,
// log out, and expose a session probe.
const express = require('express');

const passport = require('../middleware/passport');
const { requiresAuth } = require('../middleware/authenticate');

const router = express.Router();

// Step 1 of the OAuth flow: redirect the browser to GitHub. The email scope is
// requested so the verify callback can store the account's primary email.
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Step 2: GitHub redirects back here. On success Passport creates the session
// and we send the user to the landing route; on failure we redirect to
// /auth/failure, which answers with a 401 JSON body.
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('/')
);

// Destroys the server-side session, then returns to the landing route.
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Session probe: 401 without a session, the logged-in user with one.
router.get(
  '/whoami',
  /* #swagger.security = [{ "sessionAuth": [] }] */
  requiresAuth,
  (req, res) => {
    res.json({ user: req.user });
  }
);

// OAuth failure landing: JSON 401, consistent with the project error shape.
router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Login failed' });
});

module.exports = router;
