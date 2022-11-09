const { User } = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    role
  } = req.body
  try {
    const response = await User.add({
      firstname,
      lastname,
      email,
      role
    })
    delete response.password
    res.status(200).json({ response })
  } catch(error) {
    res.status(500).json({ data: error.message })
  }
};


const updatePassword = async (req, res) => {
  const { user, body: { password } } = req
  const salt = await bcrypt.genSalt(10);
  const passwordEncrypted = await bcrypt.hash(password, salt)
  const response = await User.updatePassword({
    email: user.email,
    password: passwordEncrypted
  })
  res.status(200).json(response)
}

const getAllUsers = async (req, res) => {
  try {
    const response = await User.getAll()
    res.status(200).json({ response })
  } catch(error) {
    res.status(500).json({ data: error.message })
  }
};

const loginUser = async (req, res) => {
  const {
    email,
    password,
  } = req.body
  try {
    const user = await User.getByEmail(email)
    if(!user.active) {
      return res.status(401).json({ error: 'usuario no activo' })
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'contraseña no válida' })

    const token = jwt.sign({
      name: user.firstname,
      email: email,
      id: user.id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
      error: null,
      data: {token}
    });
  } catch (e) {
    console.log('error: ', e.message)
    res.status(401).json({
      data: 'Unauthorized'
    })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  updatePassword
}