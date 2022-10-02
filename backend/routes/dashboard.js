const express = require("express");
const router = express.Router();
const org = process.env.ORGANIZATION;

//access nodemodule to process ObjectID in organization data. 
var  ObjectID = require('mongodb').ObjectId;

//importing data model schemas
let { organizationdata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 


// Aggregate to gather number of attendees for all events in the past 2 months. 
// The $size operator allows the pipeline to display a count of attendees rather than listing them out. 
router.get("/getbydate", (req, res, next) =>{
    eventdata.aggregate([{
        $match: {$expr: {$gt: ["$date", {$dateSubtract: {startDate: "$$NOW", unit: "month", amount: 2}}]}}
  }, 
    {$project: {_id: 0, eventName:1, date: 1, attendees: {$size: "$attendees"}}}
  ], (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data);
    }
  })
  });

//GET API to retrieve current organization name from database according to set ID in backend.env file.
//https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids
//Aggregate pipeline used to enforce manual type casting from set environment variable. 

router.get("/displayname/", (req, res, next) => {
    organizationdata.aggregate( 
        [{$match: { _id : ObjectID(org)}}], 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

  module.exports = router;