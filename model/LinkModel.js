"use strict";

const mongoose = require("mongoose");

const LinkModel = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    url: { 
      type: String, 
      required: true
    },
    cat: { 
      type: String, 
      required: true 
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Link", LinkModel);
