var configAuth = require('./auth');
var User = require('../models/user');
var passport=require('passport');
var Strategy = require('passport-twitter').Strategy;


passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	

passport.use(new Strategy({
    consumerKey:configAuth.twitterAuth.clientID,
    consumerSecret: configAuth.twitterAuth.clientSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
			User.findOne({ 'twitterId': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.twitterId = profile.id;
					newUser.name = profile.username; //or displayname, test to see

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});  
    
}));

module.exports=passport;


