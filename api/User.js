
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//GET USERS
router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false })
  }
  res.send(userList);
})

//GET USER BY ID
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    res.status(500).json({ message: 'The user with the given ID was not found.' })
  }
  res.status(200).send(user);
})

//UPDATE USER
router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10)
  })
  user = await user.save();

  if (!user)
    return res.status(400).send('the user cannot be created!')

  res.send(user);
})

//NEW PASSWORD FOR USER
router.put('/:id', async (req, res) => {

  const userExist = await User.findById(req.params.id);
  let newPassword
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10)
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword
    },
    { new: true }
  )

  if (!user)
    return res.status(400).send('the user cannot be created!')

  res.send(user);
})

//LOGIN INTO USER ACCOUNT
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send('The user not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: '1d' }
    )

    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send('password is wrong!');
  }


})

//REGISTER NEW USER
router.post('/register', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10)
  })
  user = await user.save();

  if (!user)
    return res.status(400).send('the user cannot be created!')

  res.send(user);
})

//DELETE USER
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id).then(user => {
    if (user) {
      return res.status(200).json({ success: true, message: 'the user is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: "user not found!" })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
})

//GET USER COUNT
router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count)

  if (!userCount) {
    res.status(500).json({ success: false })
  }
  res.send({
    userCount: userCount
  });
})

module.exports = router;

/*const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

//password handler (hashing)
const bcrypt = require('bcrypt');

//signup
router.post('/signup', (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!"
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered"
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered"
    })
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: "FAILED",
      message: "Invalid date of birth entered"
    })
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password is too short!"
    })
  } else {
    //checking if user already exists
    User.find({ email }).then(result => {
      if (result.length) {
        res.json({
          status: "FAILED",
          message: "User with provided email already exists"
        })
      } else {
        //Try to create new user

        //password handling
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds).then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth
          })

          newUser.save().then(result => {
            res.json({
              status: "SUCCESS",
              message: "Signup successful",
              data: result,
            })
          })
            .catch(err => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: "An error occured while saving user account!"
              })
            })
        })
          .catch(err => {
            console.log(err);
            res.json({
              status: "FAILED",
              message: "An error occured while hashing password"
            })
          })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occured while checking for existing user!"
      })
    })
  }
})

//signin
router.post('/signin', (req, res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })    
    } else {
        //check if user exists
        User.find({email})
        .then(data => {
            if (data.length) {
                //user exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        //password match
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                        })      
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        })      
                    }
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords!"
                    })      
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                })       
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            }) 
        })         
    }     
})

module.exports = router; */