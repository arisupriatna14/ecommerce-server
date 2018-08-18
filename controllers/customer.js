const Customer = require("../models/customer");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports = {
  signinFacebook: (req, res) => {
    const { accessToken, userID } = req.body;
    let urlFacebookGraph = `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`;

    axios
      .get(urlFacebookGraph)
      .then(dataCustomer => {
        Customer.findOne({ email: dataCustomer.data.email })
          .then(result => {
            if (result) {
              const token = jwt.sign(
                {
                  id: userID,
                  fullname: result.fullname
                },
                process.env.JWT_SECRET_KEY
              );

              res.status(200).json({
                message: "Login success",
                token: token
              });
            } else {
              Customer.create({
                fullname: dataCustomer.data.name,
                email: dataCustomer.data.email,
                password: process.env.PASSWORD_DEFAULT
              })
                .then(() => {
                  const token = jwt.sign(
                    {
                      id: userID
                    },
                    process.env.JWT_SECRET_KEY
                  );

                  res.status(201).json({
                    message: "Login success",
                    token: token
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    errorCreateUserFB: err
                  });
                });
            }
          })
          .catch(err => {
            res.status(500).json({
              errorFindUser: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },

  signup: (req, res) => {
    Customer.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    })
      .then(resultSignup => {
        console.log(resultSignup._id)
        let transporter = nodemailer.createTransport({
          service: "GMAIL",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        const token = jwt.sign(
          {
            id: resultSignup._id,
            email: req.body.email,
            role: req.body.role
          },
          process.env.JWT_SECRET_KEY
        )

        let mailOptions = {
          from: '"E-Commerce" <no-replay@ristore.com>',
          to: `${req.body.email}`,
          subject: "Register ✔",
          text: "Hello world?",
          html: `
            <img src="https://octodex.github.com/images/mountietocat.png"><br><br>
            <h2>Hi, ${req.body.fullname}</h2>
            <p>Thanks for register to E-Commerce Apps. Glad you can become our member.</p>
            <br><br>
            <strong>
              Regards, <br>
              Ari Supriatna
            </strong>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Send email success");
        });
        res.status(200).json({
          message: "Register Success",
          token: token,
          resultSignup
        });
      })
      .catch(err => {
        res.status(401).json({
          message: 'Email already exists!',
          error: err.message
        });
      });
  },

  signin: (req, res) => {
    Customer.findOne({ email: req.body.email })
      .then(dataCustomer => {
        if (dataCustomer) {
          bcrypt
            .compare(req.body.password, dataCustomer.password)
            .then(isPassword => {
              if (isPassword) {
                const token = jwt.sign(
                  {
                    id: dataCustomer._id,
                    email: dataCustomer.email
                  },
                  process.env.JWT_SECRET_KEY
                );
                return res.status(200).json({
                  msg: "Login success",
                  data: dataCustomer,
                  token: token
                });
              }
              return res.status(400).json({
                message: "Email or password failed"
              });
            })
            .catch(err => {
              res.status(500).json({
                errorComparePassword: err
              });
            });
        } else {
          res.status(500).json({
            msg: "The user has not registered"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          errorFindUser: err
        });
      });
  },

  listItemCustomer: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    const userId = decoded.id
    Customer
      .findByIdAndUpdate({
        _id: userId
      }, {
        $push: {listItemCustomer: req.body}
      })
      .then(() => {
        res.status(200).json({
          message: 'Success',
        })
      })
      .catch(err => {
        res.status(500).json({
          err: err
        })
      })
  }
};
