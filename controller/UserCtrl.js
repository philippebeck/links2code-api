"use strict";

const bcrypt    = require("bcrypt");
const UserModel = require("../model/UserModel");

require("dotenv").config();

/**
 * LIST USERS
 * @param {object} req 
 * @param {object} res 
 */
exports.list = (req, res) => {
  UserModel
    .find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

// ******************** CHECKER ******************** //

/**
 * CHECK USER
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
exports.checkUser = (req, res) => {
  const emailValidator = require("email-validator"); 
  const passValidator = require("password-validator");
  const schema = new passValidator();

  schema
    .is().min(process.env.PASS_MIN)
    .is().max(process.env.PASS_MAX)
    .has().uppercase()
    .has().lowercase()
    .has().digits(process.env.PASS_INT)
    .has().not().spaces();

  if (!emailValidator.validate(req.body.email)) {

    return res.status(401).json({ message: process.env.CHECK_USER_EMAIL });
  }

  if (!schema.validate(req.body.pass)) {

    return res.status(401).json({ message: process.env.CHECK_USER_PASS });
  }
}

/**
 * CHECK LOGIN
 * @param {*} login 
 * @param {object} res 
 * @returns 
 */
exports.checkLogin = (login, res) => {
  if (typeof login === "object" && !login) {

    return res.status(401).json({ error: process.env.CHECK_LOGIN_EMAIL });
  }
  else if (typeof login === "boolean" && !login) {

    return res.status(401).json({ error: process.env.CHECK_LOGIN_PASS });
  }
};

// ******************** LOGIN ******************** //

/**
 * LOGIN USER
 * @param {object} req 
 * @param {object} res 
 */
exports.login = (req, res) => {
  const jwt = require("jsonwebtoken");

  UserModel
    .findOne({ email: req.body.email })
    .then((user) => {
      this.checkLogin(user, res);

      bcrypt
        .compare(req.body.pass, user.pass)
        .then((valid) => {
          this.checkLogin(valid, res);

          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT,
              { expiresIn: process.env.JWT_DURATION }
            )
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ******************** CRUD ******************** //

/**
 * CREATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.create = (req, res) => {
  this.checkUser(req, res);

  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        pass: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: process.env.USER_CREATED }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * UPDATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.update = (req, res) => {
  this.checkUser(req, res);

  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      let user = {
        name: req.body.name,
        email: req.body.email,
        pass: hash
      };

      UserModel
        .updateOne({ _id: req.params.id }, { ...user, _id: req.params.id })
        .then(() => res.status(200).json({ message: process.env.USER_UPDATED }))
    })
    .catch((error) => res.status(400).json({ error }));
};

/**
 * DELETE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.delete = (req, res) => {
  UserModel
    .deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: process.env.USER_DELETED }))
    .catch((error) => res.status(400).json({ error }));
};

// ******************** MAILER ******************** //

/**
 * GET MESSAGE TRANSPORTER
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
exports.getTransporter = (req, res) => {
  const nodemailer = require("nodemailer");

  const transport = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  };

  const transporter = nodemailer.createTransport(transport);

  return transporter;
}

/**
 * SEND MESSAGE
 * @param {object} req 
 * @param {object} res 
 */
exports.send = (req, res) => {
  const transporter = this.getTransporter(req, res);
  const host = req.get("host");

  (async function(){
    try {
      let message = { 
        from: process.env.MAIL_USER, 
        to: req.body.email, 
        bcc: process.env.MAIL_USER,
        subject: `Message (${host}) : ${req.body.title}`, 
        text: req.body.message
      };

      await transporter.sendMail(message, function() {
        res.status(200).json({ message: process.env.USER_MESSAGE });
      });

    } catch(e){ console.error(e); }
  })();
};
