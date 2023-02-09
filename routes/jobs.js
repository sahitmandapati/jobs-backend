const express = require("express");
const router = express.Router();

const {
  getAllJobsForApplier,
  getAllJobsForJobPoster,
  getJobForJobPoster,
  createJob,
  deleteJob,
  updateJob,
} = require("../controllers/jobs");

router.route('/applier').get(getAllJobsForApplier)
router.route('/poster').post(createJob).get(getAllJobsForJobPoster)
router.route('/poster/:id').get(getJobForJobPoster).delete(deleteJob).patch(updateJob)


module.exports = router;
