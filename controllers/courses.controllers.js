const express = require("express");
const app = express();
const appError = require("../utils/appError");
const { validationResult } = require("express-validator");
app.use(express.json());
const httpStatusText = require("../utils/httpStatusText");
const Course = require("../models/course.modle");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id, { __v: false });
  if (!course) {
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addCourse = asyncWrapper(async (req, res,next) => {
  console.log(req.body);
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const error = appError.create(err.array(), 400, httpStatusText.FAIL);
    return next(error)
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper( async (req, res) => {
  const id = req.params.id;
    const updateCourse = await Course.updateOne(
      { _id: id },
      { $set: req.body }
    );
    res.json({
      status: httpStatusText.SUCCESS,
      data: { course: updateCourse },
    });
  } 
);

const deleteCourse = asyncWrapper( async (req, res) => {
    const deleteCourse = await Course.deleteOne({ _id: req.params.id });
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
  } 
);

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
