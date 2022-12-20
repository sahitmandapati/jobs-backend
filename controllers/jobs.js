const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const getAllJobsForJobPoster = async (req, res) => {
  if (req.user.accountType === "poster") {
    const jobs = await Job.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } else {
    throw new UnauthenticatedError("A user cannot have access to this data");
  }
};

const getJobForJobPoster = async (req, res) => {
  if (req.user.accountType === "poster") {
    const {
      user: { userId },
      params: { id: jobId },
    } = req;
    const job = await Job.findOne({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
  } else {
    throw new UnauthenticatedError("A user cannot have access to this data");
  }
};

const createJob = async (req, res) => {
  // console.log(req.user)
  if (req.user.accountType === "poster") {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } else {
    throw new UnauthenticatedError("A user cannot have access to this data");
  }
};

const updateJob = async (req, res) => {
  if (req.user.accountType === "poster") {
    const {
      body: { company, position },
      user: { userId },
      params: { id: jobId },
    } = req;

    if (company === "" || position === "") {
      throw new BadRequestError("Company or postion fields cannot be empty");
    }

    const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
  } else {
    throw new UnauthenticatedError("A user cannot have access to this data");
  }
};

const deleteJob = async (req, res) => {
  if (req.user.accountType === "poster") {
    const {
      body: { company, position },
      user: { userId },
      params: { id: jobId },
    } = req;

    const job = await Job.findOneAndRemove({
      _id: jobId,
      createdBy: userId,
    });

    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
  } else {
    throw new UnauthenticatedError("A user cannot have access to this data");
  }
};

module.exports = {
  getAllJobsForJobPoster,
  getJobForJobPoster,
  createJob,
  updateJob,
  deleteJob,
};
