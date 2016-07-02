var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var UserModel = require("../organisation/users");
var OrganisationsModel = require("../organisation/organisations");
var WatchSlideModel = require("../watchslide/watchslide")

module.exports = function(app, passport) {
    passport.serializeUser(function(user, done) {
        // console.log("serializeUser", user);
        done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
        // console.log("deserializeUser ", email);
        UserModel.findOne({
            email: email
        }, function(err, user) {
            // console.log("deserializeUser find: ", err, " user: ", user);
            done(err, user);
        });
    });

    //Overriding the default passport's way of redirecting, instead sending back a JSON object with appropriate HTTP status cpde
    app.post('/signin', function(req, res, next) {
        //console.log("request created  is",req.body);
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Please retry with valid credentials input..!'
            });
        }

        //This way of calling will avoid redirection to a success and failure URLs separately
        passport.authenticate('local-signin', function(err, user, info) {
            //console.log("The user is ",user);
            if (err) {
                //console.log("error is found ",err);
                return res.status(500).json(err);
            }

            if (!user) {
                //console.log("the error info is",info);
                return res.status(401).json(info);
            }

            req.login(user, function(err) {
                if (err) {
                    console.log('Error after req.login ', err);
                    return res.status(500).json(err);
                }

                //You can put your additional code if you want to do something here, like enhancing user object with more data etc.,
                //console.log("successful user is",user);
                console.log("Successfully signed in ", user);
                return res.status(200).json(user);
            });
        })(req, res, next);
    });

    app.get("/signout", function(req, res) {
        req.logout();
        req.session.destroy();
        res.status(200).json();
    });

    app.post('/signup', function(req, res, next) {
        if (!req.body.orgname || !req.body.orgsite || !req.body.orglogo || !req.body.orglocation || !req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Please retry with valid credentials input..!'
            });
        }

        //We are not using passport's local signup, instead overriding it to manually create signup Documents(objects, which are organisation and user in our case)
        //Doing this way of gives flexibility to either auto authenticate the user on signup or prompt the user to signin explicitly after registration or signup
        //This will help for scenarios where we need to do the email verification before allowing user to use the app

        //Check if the organisation site already exists? (orgsite & email)
        //Check if the user already exists? (email)

        //Create the Organisation
        var newOrg = new OrganisationsModel({
            "orgName": req.body.orgname,
            "orgSite": req.body.orgsite,
            "orgLogo": req.body.orglogo,
            "orgLocation": req.body.orglocation,
            "contactName": req.body.name,
            "contactEmail": req.body.email
        });

        newOrg.save(function(err, orgObj) {
            if (err) {
                console.log("Error in new org creation:", err);
                return res.status(401).json({
                    err: "Invalid Input....!"
                });
            }

            //Create the User and attach him to the organisation just created as a Admin
            var newUser = new UserModel({
                "name": req.body.name,
                "email": req.body.email,
                "password": req.body.password,
                "orgsite": req.body.orgsite,
                "role": "ORGADM"
            });

            newUser.save(function(err, savedUser) {
                if (err) {
                    //console.log("Error in new org admin user creation:" , err);
                    return res.status(401).json(err);
                }

                //After user is created, lets add a default watchslide
                // slide creation
                var userDefaultSlide = new WatchSlideModel({
                    "username": savedUser.email,
                    "orgname": savedUser.orgsite,
                    "defaultSlide": 'org',
                    "mySlides": []
                });

                userDefaultSlide.save(function(err, savedSlide) {
                    if (err) {
                        console.log("Error in saving default slide details for user", err);
                        // return res.status(401).json(err);
                    }

                    //Now authenticate the user for login
                    passport.authenticate('local-signin', function(err, user, info) {
                        //console.log("The user is ",user);
                        if (err) {
                            //console.log("error is found ",err);
                            return res.status(500).json(err);
                        }

                        if (!user) {
                            //console.log("the error info is",info);
                            return res.status(401).json(info);
                        }

                        req.login(user, function(err) {
                            if (err) {
                                console.log('Error after req.login ', err);
                                return res.status(500).json(err);
                            }

                            //You can put your additional code if you want to do something here, like enhancing user object with more data etc.,
                            //console.log("successful user is",user);
                            console.log("Successfully signed in ", user);
                            return res.status(200).json(user);
                        });
                    })(req, res, next);

                }); //end of saving default slide
            })
        });
    });


    passport.use('local-signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            console.log("Finding user by email: ", email);

            UserModel.findOne({
                'email': email
            }, function(err, user) {
                if (err) {
                    //console.log("Error in finding user: ", err, " User: ", email);
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Invalid user credentials, please retry with valid credentials..!'
                    });
                }

                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Invalid user credentials, please retry with valid credentials..!'
                    });
                }

                OrganisationsModel.findOne({
                    'orgSite': user.orgsite
                }, function(err, org) {
                    if (err) {
                        console.log("Error in finding organisation of the user: ", err, " User: ", email, " org: ", user.orgsite);
                        return done(err);
                    }

                    if (!org) {
                        return done(null, false, {
                            message: 'Invalid user credentials, please retry with valid credentials..!'
                        });
                    }

                    var sessionUser = {
                        "id": user._id,
                        "name": user.name,
                        "email": user.email,
                        "orgsite": user.orgsite,
                        "role": user.role,
                        "orgName": org.orgName,
                        "orgLogo": org.orgLogo,
                        "orgLocation": org.orgLocation
                    };

                    //IF SUCCESSFUL LOGIN, I.E., USER FOUND AND PASSWORD MATCHES
                    return done(null, sessionUser);
                });
            });
        }));
} //end of module