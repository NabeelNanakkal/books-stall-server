const express = require('express');
const authmiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authmiddleware, (req,res)=>{
    res.json({
        message: 'Welcome to Home Page!'
    })
})

module.exports = router;