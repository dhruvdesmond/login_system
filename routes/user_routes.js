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
const user_controller = require('../controller/user_controller')


router.get("/users", (req, res) =>{
    return user_controller.getAllUsers(req,res)
});




router.post("/users", upload.none(), function (req, res) {
    return user_controller.addUser(req,res)
});


// get user by user id
router.get("/users/:id", (req, res) =>{
    models.user.findByPk(req.params.id)
        .then((user) => {
            console.log("Rrturning user  !!")
            return res.json(user)
        })
        .catch(err => {
            return res.json({success:false, error :err})
        })
});

// edit user data by user id
router.put("/users/:id", (req, res) =>{
    const curr_name = req.body.name
    const curr_password = req.body.password
    models.user.findByPk(req.params.id)
        .then((user) => {
            user.update({name:curr_name,password:curr_password})
            console.log("user updated !!")
            return res.status(200).json({"message":"user updated!!"})
        })
        .catch(err => {
            return res.json({ success:false,error :err})
        })
});

// delete user by user id
router.delete("/users/:id", (req, res) =>{
    const curr_name = req.body.name
    const curr_password = req.body.password
    models.user.findByPk(req.params.id)
        .then((user) => {
            user.update({is_deleted:true})
            console.log("user deleted !!")
            return res.status(200).json({"message":"user deleted!!"})
        })
        .catch(err => {
            return res.json({success:false, error :err})
        })
});


// search user by name or email
router.get("/users/search/:term", (req, res) =>{
    const search_term = req.body.term
    Users.findAll({
        limit: 5,
        where: {
            $or: [
                {
                  name: {
                    $like: search_term
                  }
                },
                {
                  email: {
                    $like: search_term
                  }
                }
              ]
        }
        })
        .then((users) => {
            // console.log("user !!")
            return res.status(200).json(users)
        })
        .catch(err => {
            return res.json({ success:false,error :err})
        })
});

// get user role
router.get("/users/:id/role", (req, res) =>{
    models.user.findByPk(req.params.id)
        .then((users) => {
            console.log("Returning users list !!")
            return res.json(users.role)
        })
        .catch(err => {
            return res.json({success:false, error :err})
        })
});

// add user role
router.post("/users/:id/role/:role_id", (req, res) =>{
    models.user.findByPk(req.params.id)
        .then((users) => {
            
            console.log("Returning users list !!")
            return res.json(users.role)
        })
        .catch(err => {
            return res.json({success:false, error :err})
        })
});

const generateJWTToken = (userData) =>{
    return jwt.sign(userData, process.env.SECRET_KEY,{ expiresIn: '1h' });
}


const enter_sample_data_user = async () =>{
    
    const role = await models.role.findByPk(1)
    for (i = 0; i < 3; i++) {
        console.log("reached -> ",i)
        let name = "test_user" + String((i+1))
        let email = "test_email" + String((i+1)) + "@gmail.com"
        let password = "test_password" + String((i+1))
        let hashed_password = bcrypt.hashSync(password, saltRounds);
        await models.user.create({
            name: name,
            email:email,
            password: hashed_password
        })
        
        .then((user)=>{
            console.log("current role -> ",role)
            console.log("==================")
            user.setRoles([role]);

            user.save();
            console.log("==================")
        })
        .catch(err=>{
            
            console.log(err)
        })
    }
}


const enter_sample_data_role = async () =>{
    console.log("reached -> ")
    await models.role.create({
        name: "user"
    })
    .then((role)=>{
        console.log("role created -->",role)
    })
    .catch(err=>{
        console.log(err)
    })
    await models.role.create({
        name: "admin"
    })
    .then((role)=>{
        console.log("role created -->",role)
    })
    .catch(err=>{
        console.log(err)
    })
}
const get_user_role = async () =>{
    
    const user = await models.user.findOne()
    console.log(user)
    const role = await user.getRoles({ attributes: ['name']})
    // for (x in role) {
    //     console.log("+++++++++")
    //     console.log(role[x])
    // }
    console.log("===============")

    console.log(role[0]['name'])
    console.log("===============")

    console.log(typeof role)

}

// enter_sample_data_user(); 
// enter_sample_data_role(); 
get_user_role(); 



const print_association = async () =>{
    user = await models.user.findOne()
    console.log("user --->>>> ",user)
    role = models.role.findOne({where:{name:"user"}})
    user.roles(role)

    // user.update({role:{id:1}})
    console.log("user role --->>>> ",user.roles)
    
}
// print_association();

