const express = require('express');
const router = express.Router();
const user = require('../models/user.js');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    //res.send('respond with a resource');
    await user.find()
        .then(data => {
            res.json(data);
        });
});

// post to database
router.post('/addUser', async (req, res) => {
    user.countDocuments({mail: req.body.mail}, function (err, count) {
        if (count > 0) {
            res.send('user already exists');
        } else {
            const User = new user({
                mail: req.body.mail.toLowerCase(),
                first_name: req.body.first_name.toLowerCase(),
                last_name: req.body.last_name.toLowerCase(),
                birthday: req.body.birthday.toLowerCase(),
                martial_status: req.body.martial_status.toLowerCase()
            });
            User.save().then(data => {
                res.json(data);
            });

        }
    });
});

//get specific thing from db
router.get('/getUser', async (req, res) => {
    const findUser = await user.findOne({mail:req.query.mail});
    res.json(findUser);
});

//delete from db
router.delete('/deleteUser', async (req, res) => {
    const removePost = await user.remove({mail: req.query.mail});
    res.json(removePost);
})

module.exports = router;
