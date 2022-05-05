"use strict";

const express = require("express");
const router = express.Router();
const nem = require("nemjs");
const LinkCtrl = require("../controller/LinkCtrl");

router.get("/", LinkCtrl.list);
router.post("/", nem.auth, LinkCtrl.create);
router.put("/:id", nem.auth, LinkCtrl.update);
router.delete("/:id", nem.auth, LinkCtrl.delete);

module.exports = router;
