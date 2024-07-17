const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware")

router.get('/', verifyToken, (req, res) => {
    // Authorized access
    res.json({ msg: 'You have accessed the protected route!', user: req.userId });
});

module.exports = router;