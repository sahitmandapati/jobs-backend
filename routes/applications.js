const express = require("express");
const router = express.Router();


const { getAllJobs , jobApplications } = require("../controllers/applications");

router.route('/').get(getAllJobs).post(jobApplications)


module.exports = router;
