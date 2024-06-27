const { requestDuration, inProgress, requestCounter } = require("./metrics");

const prometheusMiddleware = (req, res, next) => {
  const end = requestDuration.startTimer({
    method: req.method,
    path: req.path,
  });
  inProgress.inc();
  res.on("finish", () => {
    end();
    requestCounter.inc({ method: req.method });
    inProgress.dec();
  });
  next();
};

module.exports = prometheusMiddleware;
