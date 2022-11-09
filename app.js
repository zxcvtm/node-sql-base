const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware/login')
const { createUser, getAllUsers, loginUser, updatePassword } = require('./controller/user')
require('dotenv').config()


const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.options('*', cors()) 
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  debug:true
}))

app.get(`/user`, getAllUsers)
app.post(`/user`, createUser)
app.post(`/user/login`, loginUser)
app.post(`/user/update-password`, verifyToken, updatePassword)

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is up --> http://localhost:4000`);
})
