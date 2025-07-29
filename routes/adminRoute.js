const express = require('express');
const authmiddleware = require('../middleware/authMiddleware');
const isAdminUser = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', authmiddleware, isAdminUser, (req, res)=>{
    res.json({
        message: 'Welcome to Admin Page!'
    })
});

module.exports = router;