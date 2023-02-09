const express = require("express");
const router = express.Router();


const { createApplication , updateApplicationStatus } = require("../controllers/applications");

router.route('/').post(createApplication)
router.route('/:id').patch(updateApplicationStatus)

module.exports = router;
