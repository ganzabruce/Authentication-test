require('dotenv').config()
const express = require('express')
const port = process.env.PORT
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
const path = require('./routes/router')

//middleware
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


//auth middleware 

const auth = async(req,res,next)=>{
    const token = req.cookies.token
    try {
        if(!token){
            return res.redirect('/login')
        }
        const verifiedToken = await token.verify(token,process.env.JWT_TOKEN)
        const user = verifiedToken.userId 
        next()
    } catch (error) {
        console.log(error)
    }
}



app.use(session({
    secret: process.env.JWT_TOKEN,
    resave: false,
    saveUninitilized: true,
    token: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))


//db connection
const conn = mongoose.connect(process.env.MONGODB_URI)
 .then(()=>{
    console.log('DB connected')
 })
 .catch(err=>{
    console.log(err)
 })

//

//requests

app.get('/register',path)
app.get('/login',path)
app.post('/register',path)
app.post('/login',path)


app.listen(port,()=>{
    console.log(`your app is running`)
})
