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
// const role = require("../sequelize/models/role");
// const user = require("../sequelize/models/user");


router.get("/users", (req, res) =>{
    models.user.findAll( )
        .then((users) => {
            console.log("Returning users list !!")
            return res.json(users)
        })
        .catch(err => {
            return res.json({ error :err})
        })
});

router.get("/users/roles", (req, res) =>{
    models.user.findAll(
        {
            include    : [{ model: models.role, attributes: ['id']}]
        } )
        .then((users) => {
            console.log("Returning users list !!")
            return res.json(users)
        })
        .catch(err => {
            return res.json({ error :err})
        })
});





router.post("/users", upload.none(), async (req, res)=> {
    const curr_name = req.body.name
    const curr_email = req.body.email
    const curr_password = req.body.password
    console.log(curr_password)
    const hashed_password = bcrypt.hashSync(curr_password, saltRounds);
    // const role_name = req.body.role
    const role =  await models.role.findOne({where:{name:'user'}})
    models.user.findOne({
        where: {
            email: curr_email
        }
    })
    .then(user => {
        if (user ) {
            return res.status(400).json({error:"Email already exists"})
        }
        models.user.create({
            name: curr_name,
            email: curr_email,
            password: hashed_password,
        })
        .then(user => {
            
            user.addRole(role);
            user.save()
            // user.role = role_name
            // const jwt_token = generateJWTToken(user.toJSON())
            // console.log(jwt_token)
            // logged_in[jwt_token] = 1
            // return res.status(200).json({"jwt":jwt_token})
            return res.status(200).json({"message":"user created!!"})
        })
        .catch(err => {
            return res.status(400).json({error:err})
        })
    })
    .catch(err => {
        return res.status(400).json({error:err})
    })
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
router.get("/users/:id/role",async (req, res) =>{
    const user = await models.user.findByPk(req.params.id)
    const user_roles = await user.getRoles()
    const user_role = user_roles[0]
    // console.log(user_role)
    return res.json({roles: user_role.name})
});

// add user role
router.post("/users/:id/role",upload.none(),async (req, res) =>{
    const role_id = req.body.role_id
    const role = await models.role.findByPk(role_id)
    const user = await models.user.findByPk(req.params.id)
    user.setRoles(role)
    user.save()
    console.log("User role updated !!")
    return res.json({message:"Role changed !"})
});


// login user
router.post("/login", upload.none(),async (req, res) =>{
    const curr_email = req.body.email
    const curr_password = req.body.password
    user = await models.user.findOne({where:{email:curr_email}})
    console.log('test ---->>> ',user)
    if(user){
        const verified = await bcrypt.compareSync(curr_password, user.password);
        if (verified == true){
            let jwt = await generateJWTToken(user.toJSON())
            return res.json({message:"Logged in !!!",jwt_token:jwt})
        }
    }
    return res.json({status:402,message:"Email or password wrong!!"})
});



// check if user is logged in
const requiresLogin = (req, res, next) => {
    // Get auth header value
    const token = req.header("auth_token");
    if (!token) {
        return res.status(401).json({
            error: "You do not have permission",
        });
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log("User is logged in !!");
        next();
    } catch (err) {
        res.status(400).json({
            error: "Invalid token",
        });
    }
};

const generateJWTToken = async (userData) =>{
    return await jwt.sign(userData, process.env.SECRET_KEY,{ expiresIn: '24h' });
}









module.exports = router;