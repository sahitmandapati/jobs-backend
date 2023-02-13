const express = require("express");
const router = express.Router();


const { getApplicationsForApplier, createApplication , updateApplicationStatus } = require("../controllers/applications");

router.route('/').get(getApplicationsForApplier).post(createApplication)
router.route('/:id').patch(updateApplicationStatus)

module.exports = router;
