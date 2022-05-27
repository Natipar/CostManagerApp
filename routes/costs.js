const express = require('express');
const router = express.Router();
const cost = require('../models/cost.js');
const user = require("../models/user");
const totalCosts = require("../models/total_cost");

//TODO : CHANGE categoryArray
const categoryArray = ['food', 'health', 'housing', 'sport', 'education'];

router.get('/', async function (req, res, next) {
    //res.send('respond with a resource');
    await cost.find()
        .then(data => {
            res.json(data);
        });
});

// post to database
router.post('/addCost', async (req, res) => {
    if (categoryArray.includes(req.body.category.toLowerCase())) {
        const Cost = new cost({
            mail: req.body.mail.toLowerCase(),
            category: req.body.category.toLowerCase(),
            cost: req.body.cost,
            description: req.body.description.toLowerCase(),
            date: req.body.date //.toLowerCase()
        });
        Cost.save().then(data => {
            res.json(data);
        });
        const d2 = new Date(req.body.date);
        totalCosts.findOne({
            'mail': {
                $in: [
                    req.body.mail
                ]
            },
            'month':{
                $in: [
                    d2.getMonth()
                ]
            },
            'year':{
                $in: [
                    d2.getFullYear()
                ]
            }
        }, async function (err, obj) {
            const d = new Date(req.body.date);
            if (obj === null || obj === undefined) {
                const TotalCosts = new totalCosts({
                    mail: req.body.mail.toLowerCase(),
                    year: d.getFullYear(),
                    month: d.getMonth(),
                    totalCost: req.body.cost
                });
                TotalCosts.save().then(data => {
                    console.log("saved = " + data)
                })
            } else {
                try {
/*                    const filterred = await obj.filter(function (el) {
                        return el.month === d.getMonth() && el.year === d.getFullYear();
                    });*/
                    //const item = filterred[0];
                    const tot = obj.totalCost + parseInt(req.body.cost);
                    obj.totalCost = tot;
                    obj.save();
                } catch (e) {
                    console.log(e.message)
                }
            }
        });
    } else {
        res.send("please enter a valid description");
    }
});

//get detailed report per specific month and year
router.get('/getCosts', async function (req, res) {
    cost.find({
        'mail': {
            $in: [req.query.mail]
        }
    } ,async function(err , arr){
        res.json(arr);
    });
});

//get detailed report per specific month and year
router.get('/getReport', async function (req, res) {
    cost.find({
        'mail': {
            $in: [req.query.mail]
        }
    } ,async function(err , arr){

        totalCosts.findOne({
                'mail': {
                    $in: [req.query.mail]
                },
                'month': {
                    $in: [(req.query.month - 1)]
                },
                'year': {
                    $in: [req.query.year]
                }
            }
            , async function(err , obj){
                const detailsMap = new Map();
                for (let i = 0; i < arr.length; i++) {
                    detailsMap.set(arr[i].description, arr[i].cost);
                }
                detailsMap.set('total cost', obj.totalCost);
                res.send(Object.fromEntries(detailsMap));
            });
    });
});

//delete from db
router.delete('/:deleteCost', async (req, res) => {
    const removeCost = await user.remove({_id: req.params.deleteCost});
    res.json(removeCost);
})

module.exports = router;