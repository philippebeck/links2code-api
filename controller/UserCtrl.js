"use strict";

const bcrypt      = require("bcrypt");
const formidable  = require('formidable');
const fs          = require("fs");
const nem         = require("nemjs");
const UserModel   = require("../model/UserModel");

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
}

/**
 * LOGIN USER
 * @param {object} req 
 * @param {object} res 
 */
exports.login = (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .then((user) => { nem.checkLogin(req, res, user) })
    .catch((error) => res.status(500).json({ error }));
}

//! ****************************** CRUD ******************************

/**
 * CREATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.create = (req, res) => {
  nem.checkUser(req, res);

  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      let image = `${req.protocol}://${req.get("host")}/${process.env.IMG}/${req.file.filename}`;

      let user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        image: image,
        pass: hash
      });

      user
        .save()
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
  nem.checkUser(req, res);

  bcrypt
    .hash(req.body.pass, 10)
    .then((hash) => {
      let image = `${req.protocol}://${req.get("host")}/${process.env.IMG}/${req.file.filename}`;

      let user = {
        name: req.body.name,
        email: req.body.email,
        image: image,
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
    .findOne({ _id: req.params.id })
    .then(user => {
      const filename = user.image.split(`/${process.env.IMG}/`)[1];

      fs.unlink(`${process.env.IMG}/${filename}`, () => {
        UserModel
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: process.env.USER_DELETED }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}

//! ****************************** MAILER ******************************

/**
 * SEND USER MESSAGE
 * @param {object} req 
 * @param {object} res 
 */
exports.send = (req, res) => {
  const mailer = nem.createMailer();
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
}
