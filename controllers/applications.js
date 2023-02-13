const Job = require("../models/Job");
const { ObjectId } = require("mongodb");

const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const Applications = require("../models/Applications");

// {
//   userId: '63a152c37eae304820f8c4e5',
//   name: 'peter',
//   accountType: 'applier'
// }

const getApplicationsForApplier = async (req, res) => {
  if (req.user.accountType === "applier") {
    const applicationsForApplier = await Applications.find({
      userId: req.user.userId,
    });
    const jobIds = applicationsForApplier.map(
      (application) => application.jobId
    );
    const jobs = await Job.find({ _id: { $in: jobIds } });
    const applicationsWithJobs = applicationsForApplier.map((application) => {
      const job = jobs.find(
        (job) => job._id.toString() === application.jobId.toString()
      );
      return { ...application._doc, job };
    });
    res.status(StatusCodes.CREATED).json({ applicationsWithJobs });
  } else {
    throw new UnauthenticatedError(
      "You have not logged in as user to apply jobs"
    );
  }
};

const getApplicationsForPoster = async (req, res) => {
  if (req.user.accountType === "poster") {
    const jobsForPoster = await Job.find({
      createdBy: req.user.userId,
    });
    const jobIds = jobsForPoster.map((job) => new ObjectId(job._id));

    const aggregationQuery = [
      {
        $match: { jobId: { $in: jobIds } },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
    ];

    const applicationsWithJobs = await Applications.aggregate(aggregationQuery);

    res.status(StatusCodes.CREATED).json({ applicationsWithJobs });
  } else {
    throw new UnauthenticatedError(
      "You have not logged in as a poster to view job applications"
    );
  }
};

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

    if (!applications) {
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
  getApplicationsForApplier,
  getApplicationsForPoster,
  createApplication,
  updateApplicationStatus,
};
