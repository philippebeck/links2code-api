"use strict";

const express = require("express");
const router  = express.Router();

const auth      = require("../middleware/auth");
const UserCtrl  = require("../controller/UserCtrl");

router.get("/", auth, UserCtrl.list);
router.post("/", auth, UserCtrl.create);
router.post("/login", UserCtrl.login);
router.put("/:id", auth, UserCtrl.update);
router.delete("/:id", auth, UserCtrl.delete);
router.post("/send", UserCtrl.send);

module.exports = router;
