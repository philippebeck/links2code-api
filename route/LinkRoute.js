"use strict";

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const LinkCtrl = require("../controller/LinkCtrl");

router.get("/", LinkCtrl.list);
router.post("/", auth, LinkCtrl.create);
router.put("/:id", auth, LinkCtrl.update);
router.delete("/:id", auth, LinkCtrl.delete);

module.exports = router;
