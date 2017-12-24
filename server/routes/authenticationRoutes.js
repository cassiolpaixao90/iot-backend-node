"use strict";

// ====================
//  /api/user
// ====================

/* eslint-disable no-console */

import {Router}                                 from "express";
import {getUserModel}                           from "../data_access/modelFactory";
import colors                                   from "colors";
import Promise                                  from "bluebird";
import {registrationSchema, loginSchema}        from "../validation/validationSchemas";
import xssFilters                               from "xss-filters";
import passport                                 from "passport";
import authenticationConfig                     from "../configurations/authenticationConfig";


const authenticationRouter = Router();

authenticationRouter.route('/api/users')
.get(authenticationConfig.required,async (req, res, next) => {
    try {
        const User = await getUserModel();
        const { id } = req.payload.id;
        console.log("Request", req.body);
        console.log("id", id);
        const user = await User.findById({id}).exec();

        return res.status(200).json({user: user.toAuthJSON()});
    } catch (err) {
        res.status(500).send("There was an error creating user.  Please try again later");
    }

  });

authenticationRouter.route("/api/user/register")
    .post(authenticationConfig.optional,async  (req, res) => {
        try {
            const User = await getUserModel();

            req.checkBody(registrationSchema);
            const errors = req.validationErrors();

            if (errors) {
                return res.status(500).json(errors);
            }

            const {email, password, name} = req.body;
            const existingUser = await User.findOne({email: email}).exec();
            if (existingUser) {
                return res.status(409).send(`The specified email ${email} address already exists.`);
            }

            const submittedUser = {
                name:       name,
                email:      email,
                password:   password,
                created:    Date.now()
            };

            const user = new User(submittedUser);
            user.setPassword(password);

            await user.save()
                .then(function (doc) {
                    if (doc) {
                        console.log(colors.yellow(`Created User ${JSON.stringify(doc)}`));
                    }
                })
                .catch(function (err) {
                    if (err) {
                        console.log(colors.yellow(`Error occurred saving User ${err}`));
                    }
                });

            res.status(201).json({user: {name: user.name, email: user.email}});
        } catch (err) {
            res.status(500).send(err);
        }
    });


authenticationRouter.route("/api/user/login")
    .post(async (req, res) => {
        try {
            const User = await getUserModel();
            const {email, password} = req.body;

            req.checkBody(loginSchema);
            const errors = req.validationErrors();

            const existingUser = await User.findOne({username: email}).exec();
            if (!errors && existingUser && await existingUser.passwordIsValid(password)) {
                const userInfo = {
                    id:             existingUser._id,
                    name:           existingUser.name,
                    email:          existingUser.email,
                    roles:          existingUser.roles
                };

                req.session.login({email: existingUser.email}, (err) => {
                    if (err) {
                        return res.status(500).send("There was an error logging in. Please try again later.");
                    }
                });

                res.status(200).json(userInfo);
            } else {
                res.status(401).send("Invalid username or password");
            }
        }
        catch (err) {
            res.status(500).send("There was an error attempting to login. Please try again later.");
        }
    });

authenticationRouter.route("/api/user/logout")
    .get((req, res) => {
        return new Promise((resolve, reject) => {
            try {
                if (req.session) {
                    req.session.destroy();
                    resolve(res.sendStatus(200));
                }
            }
            catch (err) {
                return reject(res.sendStatus(500));
            }
        });

    });

// authenticationRouter.route("/api/user")
    // .all(async(req, res, next) => {
    //     const user = await acquireUser(req);

    //     rbac.check(user).is("user", (err, results) => {
    //         if (!results) {
    //             return res.status(401).send("Please log in and try again.");
    //         }
    //         next();
    //     });
    // })
    // .post(async (req, res) => {
    //     try {
    //         const User              = await getUserModel();
    //         const {userInfo = {}}   = req.session;
    //         const {user}            = req.body;
    //         if (!user) {
    //             return res.sendStatus(304);
    //         }

    //         const currentUser = await User.findOne({email: userInfo.email}).exec();
    //         if (!currentUser) {
    //             return res.status(401).send("Please login and try again.");
    //         }

    //         currentUser.name    = user.name;
    //         const updatedUser   = await currentUser.save();

    //         return res.status(200).json({
    //             id: updatedUser._id,
    //             name: updatedUser.name,
    //             roles: updatedUser.roles
    //         });
    //     }
    //     catch (err) {
    //         res.status(500).send("There was an error updating profile. Please try again later");
    //     }
    // });


async function acquireUser(req) {   
    const User      = await getUserModel();
    const {userInfo = {}} = req.session;
    return await User.findOne({email: userInfo.email});
}
export default authenticationRouter;