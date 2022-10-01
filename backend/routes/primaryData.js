const { application } = require("express");
const express = require("express"); 
const router = express.Router(); 
const org = process.env.ORGANIZATION;

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find( { organizationData_id : org },
        (error, data) => { 
            console.log(data.address)
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    primarydata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
//organizationData_id is added to the query in order to prevent searches across organizations. Set equal to current org in .env file. 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" }, organizationData_id: org }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }, organizationData_id: org 
        }
    };
    primarydata.find( 
        dbQuery,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for a single client
router.get("/events/:id", (req, res, next) => { 
    primarydata.aggregate([
        {$match: {id: req.params.id}},
        {$project: {firstName: 1, lastName: 1}},
        {$lookup:
        {from : "eventsData",
        localfield: "id",
        foreignField: "primaryData_id",
        as: "Events"    
        }},
        {$unwind: "$attendees"}
    ]), (error, data) => { 
        if (error) {
            return next(error);
        } else {
            res.json(data); 
        }
    }
});

router.get("/event/:id", (req, res, next) => { 
    primarydata.aggregate([
        {$match: {id: req.params.id}},
        {$lookup: {
            from: "eventsData",
            let: { attendees: "$attendees"},
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [{ $eq: ["$attendees", "$_id"]}]
                    }
                }
            }],
            as: "Events"
        }
         
        }
        
    ], (error, data) => { 
        if (error) {
            return next(error);
        } else {
            res.json(data); 
        }
    }
);

});

//POST
router.post("/", (req, res, next) => { 
    req.body.organizationData_id = org
    console.log(req.body)
    primarydata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
        { _id: req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//https://www.mongodb.com/community/forums/t/how-to-delete-a-specific-nested-subdocument-completely-from-an-document/100219
router.delete("/delete/:id", (req, res, next) => 
{
    console.log("test")
    primarydata.findOneAndRemove
        ({ _id: req.params.id}, 
        (error, data) => {
            if (error) 
            {
                return next(error);
            } else 
            {
               eventdata.updateMany              
               ({ organizationData_id : org },
               {
                "$pull": {"attendees": req.params.id}
               }, 
               (error2, data2) =>{
                if(error2)
                    {
                        return next(error2);
                    } else
                    {
                        res.json(data2)
                    }
               })

            }
    });
});



module.exports = router;