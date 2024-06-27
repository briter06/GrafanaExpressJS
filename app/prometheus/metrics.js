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

const getMetrics = async (_req, res) => {
  res.set("Content-Type", prometheusRegister.contentType);
  res.end(await prometheusRegister.metrics());
};

module.exports = {
  requestCounter,
  requestDuration,
  inProgress,
  getMetrics,
};
