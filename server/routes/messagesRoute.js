const express = require('express');
const router = express.Router();
const { addMessage, getAllMessage } = require('../controllers/messagesController');

// Define your routes using router.get, router.post, etc.

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessage);

module.exports = router;