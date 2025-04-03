const jwt = require('jsonwebtoken')

const User =  require('../models/user')
const bcrypt = require('bcrypt')


exports.register = (req,res)=>{
    res.render('register')
}
exports.login = (req,res)=>{
    res.render('login')
}

exports.createUser = async(req,res)=>{
    const {username , password}= req.body
    try {
        const user = await User.findOne({username: username})
        if(user){
            return res.json({message : "user already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = User.create({
            username: username,
            password: hashedPassword
        })
        res.json({message: "user created"})
    } catch (error) {
        console.log(error)
    }
}
exports.getUser = async(req,res)=>{
    const {username ,password} = req.body
    try {
        const user = await User.findOne({username: username})
        if (!user){
            return res.json({message : "user already exists"})
        }
        const isVerified = await bcrypt.compare(password, user.password)
        if(!isVerified){
            return res.json({message:"incorrect username or password"})
        }
        const token = jwt.sign({userId: user.id},process.env.JWT_TOKEN)
        res.cookie('token',token,{httpOnly: true})
        res.render('dashboard', {userName : user.username })
    } catch (error) {
        console.log(error)
    }
}

