const express = require('express');
const router = express.Router();
const cost = require('../models/cost.js');
const totalCosts = require("../models/total_cost");

const categoryArray = ['food', 'health', 'housing', 'sport', 'education'];

router.get('/', async function (req, res) {
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
                    obj.totalCost = obj.totalCost + parseInt(req.body.cost);
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
            /*VERS#1-ifElse (Cheaper)*/
            /* , async function(err , obj){
                err = "error";
                const detailsMap = new Map();
                if(obj == null){
                    res.send(err);
                }
                else {
                    for (let i = 0; i < arr.length; i++) {
                        detailsMap.set(arr[i].description, arr[i].cost);
                    }
                    detailsMap.set('total cost', obj.totalCost);
                    res.send(Object.fromEntries(detailsMap));
                 };*/
            /*VERS#2-tryCatch (Informative)*/
            , async function(err , obj){
                err = "error";
                try {
                    const detailsMap = new Map();
                    for (let i = 0; i < arr.length; i++) {
                        detailsMap.set(arr[i].description, arr[i].cost);
                    }
                    detailsMap.set('total cost', obj.totalCost);
                    res.send(Object.fromEntries(detailsMap));
                }catch (e) {
                    res.send(err)
                }
            });
    });
})

//delete from db
router.delete('/deleteCost', async function(req, res) {
        cost.findOne({_id: req.query._id}, async function(err, obj){
            const d = new Date(obj.date);
            totalCosts.findOne({
                'mail': {
                    $in: [obj.mail]
                },
                'month': {
                    $in: [d.getMonth()]
                },
                'year': {
                    $in: [d.getFullYear()]
                }
            },async function(err,obj1){
                obj1.totalCost = obj1.totalCost - obj.cost;
                obj1.save();
            });
        });

        const removeCost = await cost.deleteOne({_id: req.query._id});
        res.json(removeCost);
})

module.exports = router;

