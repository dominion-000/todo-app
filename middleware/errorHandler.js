// error handling
module.exports = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
};
