import passport                   from "passport";
import { LocalStrategy }          from "passport-local";
import mongoose                   from "mongoose";
import { getUserModel }           from "../data_access/modelFactory";

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},(email, password, done) => {

  const User = getUserModel();
  User.findOne({email: email}).then((user) => {
    if(!user || !user.validPassword( password )){
      return done(null, false, {errors: {"email or password": "is invalid"}});
    }

    return done(null, user);
  }).catch(done);
}));
