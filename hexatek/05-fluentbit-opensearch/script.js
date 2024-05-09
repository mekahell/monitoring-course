"use strict";

const process = require("process");
const api = require("@opentelemetry/api-logs");
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} = require("@opentelemetry/semantic-conventions");
const { Resource } = require("@opentelemetry/resources");
const {
  LoggerProvider,
  SimpleLogRecordProcessor,
} = require("@opentelemetry/sdk-logs");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-http");

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: "hexatek-service",
  [SEMRESATTRS_SERVICE_NAMESPACE]: "hexatek",
});

const loggerProvider = new LoggerProvider({
  resource,
});

const fluentbiOTeltURL = "http://localhost:14318/v1/logs"

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(
    new OTLPLogExporter({
      url: fluentbiOTeltURL,
      keepAlive: true,
    })
  )
);

const loggerOtel = loggerProvider.getLogger("default");

for (let i = 0; i < 10; i += 1) {
  loggerOtel.emit({
    severityNumber: api.SeverityNumber.INFO,
    severityText: "INFO",
    body: `Message d'information numéro ${i}` /* feel free to change this message */,
    attributes: { "log.type": "LogRecord" },
  });
}

// Flush all emitted logs
loggerProvider
  .forceFlush()
  .then(() => console.log("Logs flushed"))
  .catch((error) => console.log("Error terminating flushing", error));

// gracefully shut down the SDK on process exit
loggerProvider
  .shutdown()
  .then(() => console.log("Tracing terminated"))
  .catch((error) => console.log("Error terminating tracing", error));
