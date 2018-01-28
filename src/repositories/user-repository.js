'use strict';


exports.create = async(data, User) => {
  const user = new User(data);
  await user.save();
}

exports.getByEmail = async (email, User) => {
  return await User.findOne({email: email}).exec();
}

exports.authenticate = async (data, User) => {
  return await User.findOne({ email: data.email, password: data.password }).exec();
}

exports.getById = async (id, User) =>{
  return await User.findById(id);
};

exports.forgotPassword = async (data, User) => {
  const user = new User(data);
  user.save();
};
