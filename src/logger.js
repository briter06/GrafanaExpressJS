const winston = require("winston");
const chalk = require("chalk");
const { Client } = require("@elastic/elasticsearch");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  const logInfo = chalk.cyan(`[${timestamp}] ${level.toUpperCase()}:`);
  return `${logInfo} ${message}`;
});

const elasticsearchClient = new Client({
  node: "http://elasticsearch:9200",
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "./logs/log" }),
    new ElasticsearchTransport({
      level: "info",
      client: elasticsearchClient,
      index: "app-logs",
    }),
  ],
});

module.exports = logger;
