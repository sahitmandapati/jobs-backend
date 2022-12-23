const express = require("express");
const router = express.Router();


const { getAllJobs , createApplication , updateApplicationStatus } = require("../controllers/applications");

router.route('/').get(getAllJobs).post(createApplication)
router.route('/:id').patch(updateApplicationStatus)

module.exports = router;
