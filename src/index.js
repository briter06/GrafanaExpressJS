const express = require("express");
const prometheusMiddleware = require("./prometheus/middleware");
const { getHome, setName } = require("./homeController");
const { getMetrics } = require("./prometheus/metrics");
const { StatusCodes } = require("http-status-codes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const logger = require("./logger");
const app = express();
const port = 3010;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(
  morgan(":method :url | Status: :status | Response time: :response-time ms", {
    skip: (req, res) => {
      return res.statusCode !== StatusCodes.OK || req.path == "/metrics";
    },
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  })
);

app.get("/", prometheusMiddleware, getHome);
app.post("/", prometheusMiddleware, setName);

app.get("/metrics", getMetrics);

app.use(function (err, _req, res, _next) {
  logger.error(err.message);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
  });
});

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});
