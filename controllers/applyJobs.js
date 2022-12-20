const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors");


const getAllJobs = async (req, res) => {
  // console.log(req.user);

  if (req.user.accountType === "applier") {
    const jobs = await Job.find({});
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } else {
    throw new UnauthenticatedError(
      "You have not logged in as user to view jobs"
    );
  }
};

module.exports = {
  getAllJobs,
};
