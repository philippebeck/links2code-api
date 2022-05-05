"use strict";

const express = require("express");
const router = express.Router();
const nem = require("nemjs");
const UserCtrl = require("../controller/UserCtrl");

router.get("/", nem.auth, UserCtrl.list);
router.post("/", nem.auth, UserCtrl.create);
router.post("/login", UserCtrl.login);
router.put("/:id", nem.auth, UserCtrl.update);
router.delete("/:id", nem.auth, UserCtrl.delete);
router.post("/send", UserCtrl.send);

module.exports = router;
