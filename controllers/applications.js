const Job = require("../models/Job");

const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const Applications = require("../models/Applications");

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

// {
//   userId: '63a152c37eae304820f8c4e5',
//   name: 'peter',
//   accountType: 'applier'
// }

const createApplication = async (req, res) => {
  // console.log(req.user)
  if (req.user.accountType === "applier") {
    req.body.userId = req.user.userId;
    const applications = await Applications.create(req.body);
    res.status(StatusCodes.CREATED).json({ applications });
  } else {
    throw new UnauthenticatedError(
      "You have not logged in as user to apply jobs"
    );
  }
};

const updateApplicationStatus = async (req, res) => {
  if (req.user.accountType === "poster") {
    const {
      body: { status },
      params: { id: jobId },
    } = req;

    if (status === "") {
      throw new BadRequestError("Status field cannot be empty");
    }

    const applications = await Applications.findOneAndUpdate(
      { jobId },
      req.body,
      { new: true, runValidators: true }
    );

    if(!applications){
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ applications });

  } else {
    throw new UnauthenticatedError(
      "You do not have enough priviliges to perform this action"
    );
  }
};

module.exports = {
  getAllJobs,
  createApplication,
  updateApplicationStatus,
};
