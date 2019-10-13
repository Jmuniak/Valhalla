const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const db = require("../models");
let userInfo = {};

//welcome Page
router.get("/", (req, res) => {
  res.render("welcome", {});
});

//Dashboard

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  userInfo = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  };
  db.character.findAll({ where: { userid: req.user.id } }).then(result => {
    let characters = [];
    result.forEach(element => {
      let obj = {
        id: element.id,
        characterName: element.characterName
      };
      characters.push(obj);
    });
    userInfo.characters = characters;
    if (userInfo.characters.length === 0) {
      userInfo.characters = null;
      res.render("dashboard", userInfo);
    } else {
      res.render("dashboard", userInfo);
    }
  });
});
router.get("/log/:user/:charID", ensureAuthenticated, (req, res) => {
  if (req.user.id) {
    res.render("characterView", {
      id: req.user.id,
      name: req.user.name
    });
  } else {
    res.render("characterView", {
      id: null,
      name: null
    });
  }
});

module.exports = router;
