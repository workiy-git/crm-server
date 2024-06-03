// DataModel.js

const mongoose = require('mongoose');

// Header json schema
const loginSchema = new mongoose.Schema({
  welcome_text: String,
 

  login: String,
  forgot_pwd: String,
  bot_img: String,
  bot_icon: String,
  bot_icon: String,
  building_icon: String,
  pwd_icon: String,
  person_icon: String,
 
}, { collection: 'login' });

const LoginModel = mongoose.model('login', loginSchema);

/*
// Home json schema
const homeSchema = new mongoose.Schema({
  main: String,
  title: String,
  content_1: String,
  content_2: String,
  content_3: String,
  content_4: String,
  testimonial: {
    hari: String,
    supriya: String,
    sabica_jasmin: String,
    Avinash_Boggala: String,
  },

  banner_img: String,
}, { collection: 'Home' });

const HomeModel = mongoose.model('Home', homeSchema);


//courseschema 

const courseSchema = new mongoose.Schema({
  tech: String,
  
}, { collection: 'Courses' });

const CourseModel = mongoose.model('Courses', courseSchema);

//aboutschema 

const aboutSchema = new mongoose.Schema({
  company: String,
  
}, { collection: 'About' });

const AboutModel = mongoose.model('About', aboutSchema);

//contactschema 

const contactSchema = new mongoose.Schema({
  phone: String,
  
}, { collection: 'Contact' });

const ContactModel = mongoose.model('Contact', contactSchema);

//footerschema 

const footerSchema = new mongoose.Schema({
  Footer_content: String,
  Street: String,
  Land_mark: String,
  City: String,
  Phone: String,
  Email_id: String,

  
}, { collection: 'Footer' });

const FooterModel = mongoose.model('Footer', footerSchema); */

module.exports = { LoginModel };




