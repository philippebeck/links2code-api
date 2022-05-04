"use strict";

const LinkModel = require("../model/LinkModel");

/**
 * LIST LINK
 * @param {*} req 
 * @param {*} res 
 */
exports.list = (req, res) => {
  LinkModel
    .find()
    .then(links => res.status(200).json(links))
    .catch(error => res.status(400).json({ error }));
};

/**
 * CREATE LINK
 * @param {*} req 
 * @param {*} res 
 */
exports.create = (req, res) => {
  let link = new LinkModel(req.body);

  link
    .save()
    .then(() => res.status(201).json(
      { message: "Lien créé !" }
    ))
    .catch(error => res.status(400).json({ error }));
};

/**
 * UPDATE LINK
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
  let link = req.body;

  LinkModel
    .updateOne(
      { _id: req.params.id }, 
      { ...link, _id: req.params.id }
    )
    .then(() => res.status(200).json(
      { message: "Lien modifié !" }
    ))
    .catch(error => res.status(400).json({ error }));
};

/**
 * DELETE LINK
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {
  LinkModel
    .deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json(
      { message: "Lien supprimé !" }
    ))
    .catch(error => res.status(400).json({ error }))
};
