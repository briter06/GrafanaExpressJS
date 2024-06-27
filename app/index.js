const express = require("express");
const prometheusMiddleware = require("./prometheus/middleware");
const { getHome } = require("./homeController");
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
    skip: (_req, res) => {
      return res.statusCode !== StatusCodes.OK;
    },
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  })
);

app.get("/", prometheusMiddleware, getHome);

app.get("/metrics", getMetrics);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
