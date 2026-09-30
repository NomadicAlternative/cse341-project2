// Authorization middleware: requires a valid session before a route runs.
// Passport adds req.isAuthenticated() once it is initialized; the guard below
// covers the case where the middleware is used on an app without Passport.
const requiresAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    // Same JSON shape the central error handler produces: { error, details? }
    return res.status(401).json({ error: 'Authentication required' });
  }
  return next();
};

module.exports = { requiresAuth };
