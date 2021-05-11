var express = require("express");
const multer = require('multer');
const upload = multer();
var router = express.Router();
// const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const jwt = require('jsonwebtoken');
// const Role = require("../models/role");
var logged_in = {}
const { models } = require('../sequelize');

// get all roles
router.get("/roles", (req, res) =>{
    models.role.findAll()
        .then((roles) => {
            console.log("Rrturning roles list !!")
            return res.json(roles)
        })
        .catch(err => {
            return res.json({ error :err})
        })
});

// add new roles
router.post("/roles", upload.none(), function (req, res) {
    const curr_name = req.body.name
    models.role.create({
        name: curr_name
    })
    .then(role => {
        // return res.header('auth_token',jwt_token).status(200).send({jwt_token})
        return res.status(200).json({"msg":"role created !!"})
    })
    .catch(err => {
        
        return res.status(400).json({error:err})
    })
});

// get all users of one role
router.get("/roles/:id", (req, res) =>{
    models.role.findAll()
        .then(async(roles) => {
            users = await roles.getUsers()

            console.log("Rrturning roles list !!")
            return res.json({users:users})
        })
        .catch(err => {
            return res.json({ error :err})
        })
});



module.exports = router;