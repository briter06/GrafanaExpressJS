const express = require("express");
const app = express();
const port = 3010;

const prometheus = require("prom-client");
const prometheusRegister = new prometheus.Registry();

prometheusRegister.setDefaultLabels({
  app: "nodejs-app",
});

prometheus.collectDefaultMetrics({ register: prometheusRegister });

const requestCounter = new prometheus.Counter({
  name: "node_request_count",
  help: "Total number of requests",
  labelNames: ["method"],
});
prometheusRegister.registerMetric(requestCounter);

const requestDuration = new prometheus.Histogram({
  name: "node_request_duration_seconds",
  help: "Histogram of request durations in seconds",
  labelNames: ["method", "path"],
});
prometheusRegister.registerMetric(requestDuration);

const inProgress = new prometheus.Gauge({
  name: "node_in_progress_requests",
  help: "Number of in-progress requests",
});
prometheusRegister.registerMetric(inProgress);

const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

const requestHelper = (req, res, callback) => {
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
  callback();
};

app.get("/", (req, res) =>
  requestHelper(req, res, () => {
    logger.debug("GET REQUEST - /");
    res.json({
      data: "Hello World!",
    });
  })
);

app.get("/error", (req, res) =>
  requestHelper(req, res, () => {
    {
      logger.error("ERROR REQUEST - /error");
      res.send({
        status: "Error 5",
      });
    }
  })
);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", prometheusRegister.contentType);
  res.end(await prometheusRegister.metrics());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
