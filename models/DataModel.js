// models/DataModel.js

const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  welcome_text: String,
  login: String,
  forgot_pwd: String,
  bot_img: String,
  bot_icon: String,
  building_icon: String,
  pwd_icon: String,
  person_icon: String,
  error_message: String,
}, { collection: 'login' });

const LoginModel = mongoose.model('login', loginSchema);

const landingpageSchema = new mongoose.Schema({
  call_person_img: String,
  chckout_img: String,
  circklet_img: String,
  contact_img: String,
  edit_img: String,
  ellips_img: String,
  full_size_img: String,
  search_img: String,
  home_img: String,
  missed_call_img: String,
  notification_img: String,
  dphone_img: String,
  ringer_img: String,
  reload_img: String,
  settings_img: String,
  signal_img: String,
  workiy_logo_img: String,
 

}, { collection: 'landingpage' });

const LandingpageModel = mongoose.model('landingpage', landingpageSchema);

const userSchema = new mongoose.Schema({
  company_name: String,
  user_name: String,
  password: String,
}, { collection: 'user_info' });

const UserModel = mongoose.model('user_info', userSchema);

module.exports = { LoginModel, LandingpageModel, UserModel };
