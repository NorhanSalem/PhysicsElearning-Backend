const mongoose=require("mongoose");
const Student = require("../Model/studentModel");
const fs =require("fs") 
const bcrypt = require("bcryptjs");
const path = require("path");
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
require("cookie-parser");
const studentSchema = mongoose.model("student");

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});

// // handle errors
const handleErrors = (err) => {
  // console.log(err.code);
  // console.log(err.code);
  let errors = { email: '', password: '' };

  //login errors
  if(err.message === 'incorrect email'){
    errors.email = "The email or password is incorrect"
  }

  if(err.message === "Incorrect Password"){
    errors.password = "The email or password is incorrect"
  }

  // duplicate email error
  if (err.code === 11000) {
    // console.log(err.code);
    errors.email = 'that email is already registered';
    console.log(errors);
    // console.log(errors.email);
    
    return errors;
  }


  // validation errors
  console.log(err);

  if (err.message.includes('user validation failed')) {
    console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// creating token function

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
  return jwt.sign({id}, "physics", {expiresIn: maxAge});
};

// controller actions


module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.home = (req, res) => {
  res.render('home');
}

module.exports.signup_post = (req,res,next)=>{
  new studentSchema({
      firstName:  req.body.firstName,
      lastName:   req.body.lastName,
      password:   bcrypt.hashSync(req.body.password, salt),
      email:      req.body.email,
      birthdate:  req.body.birthdate,
      phoneNumber:req.body.phoneNumber,
  }).save()// insertOne
  .then(student=>{
      console.log(student);
      const token = createToken(student._id);
      console.log(student._id);
      res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
      res.status(201).json({student: student._id});
  })
  .catch((error)=>{
    // console.log(error);
    // console.log("****************************************************************");
    // console.log(error.errors.email);
    // console.log("/////////////////////////////////////////////////////////////////");
    const errors = handleErrors(error);
    console.log(errors);
    if(errors.email === '' && errors.password === ''){
      // for any errors other than duplicate email
      const emailErrorMessage = {message: error.errors.email.properties.message};
      console.log(emailErrorMessage);
      if(emailErrorMessage){
      res.status(400).json( emailErrorMessage );
      }
      // res.status(400).json({ errors });
      // console.log(errorMessage);
    }else{
    res.status(400).json({ errors });
    }
    // next(error)
  });
}



// async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await Student.create({ email, password });
//     console.log(student);

//     // const token = createToken(user._id);
//     // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//     res.status(201).json(student);
//     console.log(student);
//   }
//   catch(err) {
//     // const errors = handleErrors(err);
//     // res.status(400).json({ errors });
//   }
 
// }

module.exports.login_post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const student = await Student.login(email, password);
    const token = createToken(student._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({ student: student._id });
    console.log(student._id);
    console.log(email, password);


  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
    // next(errors);
  }

}