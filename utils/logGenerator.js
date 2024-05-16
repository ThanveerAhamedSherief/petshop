const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} - ${level}: ${message}`;
  //   return `${timestamp} [${label}] - ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: "right meow!" }), timestamp(), myFormat),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/main.log", level: "info" }),
  ],
});

module.exports = logger;
