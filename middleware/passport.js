// Passport configuration: the GitHub OAuth strategy plus the session hooks.
// Credentials come from the environment so no secret is ever committed.
const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github2');

// User model used by the upsert in the verify callback and by deserializeUser
const User = require('../models/User');

// GitHub credentials come from the environment so nothing is ever hardcoded.
// passport-github2 throws when clientID is empty, so the strategy is only
// registered when it is configured. This lets the app boot in environments
// without OAuth (tests, first-time setup) while keeping real logins working
// wherever the variables are set. The verify callback runs on every login.
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

if (clientID && clientSecret) {
  passport.use(
    new GitHubStrategy(
      { clientID, clientSecret, callbackURL },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // UPSERT: the first login inserts the user, every later login updates
          // the stored profile. returnDocument: 'after' hands back the saved
          // document, not the pre-update one.
          const user = await User.findOneAndUpdate(
            { githubId: profile.id },
            {
              githubId: profile.id,
              username: profile.username,
              displayName: profile.displayName,
              profileUrl: profile.profileUrl,
              avatarUrl: profile.photos?.[0]?.value,
              email: profile.emails?.[0]?.value,
            },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
          );
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
} else {
  console.warn(
    'GitHub OAuth is not configured: set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see .env.example). /auth/github will not work until then.'
  );
}

// Only the Mongo _id travels in the session cookie; the full user is reloaded
// from the database on each request.
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
