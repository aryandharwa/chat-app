
// const { register, login } = require('../controllers/usersController'); 
// const router = require('express').Router();

// router.post("/api/auth/register", register);
// router.post("/api/auth/login", login);

// userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, setAvatar, getAllUsers } = require('../controllers/usersController');

// Define your routes using router.get, router.post, etc.

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUsers);

module.exports = router;


