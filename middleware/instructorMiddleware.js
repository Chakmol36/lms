const instructorMiddleware = (
  req,
  res,
  next
) => {

  if (
    req.user.role !== "instructor" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();

};

module.exports = instructorMiddleware;