const express = require("express");
const router = express.Router();

const {
  getAllJobsForJobPoster,
  getJobForJobPoster,
  createJob,
  deleteJob,
  updateJob,
} = require("../controllers/jobs");

router.route('/').post(createJob).get(getAllJobsForJobPoster)
router.route('/:id').get(getJobForJobPoster).delete(deleteJob).patch(updateJob)


module.exports = router;
