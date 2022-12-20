const express = require("express");
const router = express.Router();


const { getAllJobs } = require("../controllers/applyJobs");

router.route('/').get(getAllJobs)


module.exports = router;
