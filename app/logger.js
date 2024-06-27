const winston = require("winston");
const chalk = require("chalk");

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  const logInfo = chalk.cyan(`[${timestamp}] ${level.toUpperCase()}:`);
  return `${logInfo} ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/log" }),
  ],
});

module.exports = logger;
