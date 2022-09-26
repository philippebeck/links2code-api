"use strict";

const bcrypt    = require("bcrypt");
const nem       = require("nemjs");
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

/**
 * LOGIN USER
 * @param {object} req 
 * @param {object} res 
 */
exports.login = (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .then((user) => { nem.login(req, res, user) })
    .catch((error) => res.status(500).json({ error }));
};

//! ****************************** CRUD ******************************

/**
 * CREATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.create = (req, res) => {
  nem.user(req, res);

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
}

/**
 * UPDATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.update = (req, res) => {
  nem.user(req, res);

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

//! ****************************** MAILER ******************************

/**
 * SEND USER MESSAGE
 * @param {object} req 
 * @param {object} res 
 */
exports.send = (req, res) => {
  const mailer = nem.mailer();
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

      await mailer.sendMail(message, function() {
        res.status(200).json({ message: process.env.USER_MESSAGE });
      });

    } catch(e){ console.error(e); }
  })();
};
