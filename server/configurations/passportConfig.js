import passport                   from "passport";
import mongoose                   from "mongoose";
import { getUserModel }           from "../data_access/modelFactory";
const  LocalStrategy  =           require("passport-local").Strategy;

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},async (email, password, done) => {
  console.log("email", email);
  console.log("password", password)
  const User = await getUserModel();

  const usuario = await User.findOne({email: email}).exec();
  console.log("usuario", usuario);
  User.findOne({email: email}).then((user) => {
    console.log("user", user);
    if(!user || !user.validPassword( password )){
      return done(null, false, {errors: {"email or password": "is invalid"}});
    }

    return done(null, user);
  }).catch(done);
}));
