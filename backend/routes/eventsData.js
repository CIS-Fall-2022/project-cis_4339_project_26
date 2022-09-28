const express = require("express");
const router = express.Router();
const org = process.env.ORGANIZATION;

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
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
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
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

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
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
    eventdata.create( 
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

//PUT
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
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

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});





//PUT delete attendee from event
router.put("/deleteAttendee/:id", (req, res, next) => {
    //deletes attendee from list
    eventdata.find( 
        { _id: req.params.id}, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                    eventdata.updateOne
                    (
                        { _id: req.params.id }, 
                        { $pull: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
            }
        }
    );
    
});

router.delete("/delete/:id", (req, res, next) => 
{
    eventdata.findOneAndRemove
        ({ _id: req.params.id}, 
        (error, data) => {
            if (error) 
            {
                return next(error);
            } else 
            {
                res.status(200).json
                ({
                    event_deleted: data
                })
            }
    });
});


router.put("/deleteattendee/:id", (req, res, next) =>

{

    eventdata.updateMany({},
        {$pull: {attendees: req.params.id}}
    ),
    (error, data) => {
        if (error)
        {
            console.log(error)
            return next(error);
        } else
        {
            res.status(200).json
            ({
                //client_deleted: data
            })
        }
}});


//Remove attendee from specific event.
router.put("/removeAttendee/:event/:attendee", (req, res, next) => {
        eventdata.findByIdAndUpdate(req.params.event,
            { $pull: { attendees: req.params.attendee } },
                (error, data) => {
                    if (error) {
                        consol
                         return next(error);
                    } else {
                        res.json(data);
                    }
                }
            );
        }
    );   


/* router.get("/lasttwomonths", (req, res, next) => { 
    let today = new Date();
    let day_count = new Date() - 120; 
    eventdata.find(
        {date:{ $lte: today, $gt: day_count}}, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
}); */


// Aggregate request to determine the number of attendees for each event within the past 2 months. 
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/size/
router.get("/getbydate", (req, res, next) =>{
    eventdata.aggregate([{
        $match: {$expr: {$gt: ["$date", {$dateSubtract: {startDate: "$$NOW", unit: "month", amount: 2}}]}}
}, 
    {$project: {_id: 0, eventName:1, date: 1, attendees: { $size: "$attendees" }}}
], (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data);
    }
})
})

module.exports = router;