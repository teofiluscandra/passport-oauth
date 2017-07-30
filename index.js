import express from 'express';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import { facebook, google } from './config';

// Transform Google profile into user object
const transformGoogleProfile = (profile, accessToken) => ({
  name: profile.displayName,
  avatar: profile.image.url,
  email : profile.emails,
  accessToken : accessToken,
  provider : 'google'
});

const transformFacebookProfile = (profile, accessToken) => ({
  name: profile.name,
  avatar: profile.picture.data.url,
  email : profile.email,
  accessToken : accessToken,
  provider : 'facebook'
});

// Register Facebook Passport strategy
passport.use(new FacebookStrategy(facebook,
  // Gets called when user authorizes access to their profile
  async (accessToken, refreshToken, profile, done)
    // Return done callback and pass transformed user object
    => {
      console.log(profile._json)
      done(null, transformFacebookProfile(profile._json, accessToken))
    }
));


// Register Google Passport strategy
passport.use(new GoogleStrategy(google,
  async (accessToken, refreshToken, profile, done)
    => {
    console.log(profile._json)
    done(null, transformGoogleProfile(profile._json, accessToken)) }
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

// Initialize http server
const app = express();

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Facebook auth routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  // Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));


// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email','birthday'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
        res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user))
    });

// Launch the server on the port 3000
const server = app.listen(process.env.PORT || 3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});