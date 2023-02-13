const express = require("express");
const router = express.Router();


const { getApplicationsForApplier, getApplicationsForPoster, createApplication , updateApplicationStatus } = require("../controllers/applications");

router.route('/').post(createApplication)
router.route('/applier').get(getApplicationsForApplier)
router.route('/poster').get(getApplicationsForPoster)
router.route('/:id').patch(updateApplicationStatus)

module.exports = router;
