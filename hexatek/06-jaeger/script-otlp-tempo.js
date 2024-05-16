"use strict";

const process = require("process");
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} = require("@opentelemetry/sdk-trace-base");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} = require("@opentelemetry/semantic-conventions");
const { Resource } = require("@opentelemetry/resources");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");

const collectorOptions = {
  // l'URL est celle du Jaeger qui fonctionne avec Docker en local
  // Ici on utilise le port gRPC de OpenTelemetry
  url: "http://localhost:44317",
};

const traceExporter = new OTLPTraceExporter(collectorOptions);

const serviceName = "hexatek-service"; // Le nom de notre service de test

const sdk = new opentelemetry.NodeSDK({
  serviceName: serviceName,
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
    [SEMRESATTRS_SERVICE_NAMESPACE]: "hexatek",
  }),
  traceExporter,
  spanProcessors: [
    new SimpleSpanProcessor(traceExporter),
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
});

// Initialisation de l'API OpenTelemetry avec auto instrumentation
sdk.start();

// Creation du tracer pour l'envoi des spans
const tracer = opentelemetry.api.trace.getTracer("hexatek-service-tracer");

// Create a span. A span must be closed.
const parentSpan = tracer.startSpan(
  "user-sign-up",
  { root: true },
  opentelemetry.api.ROOT_CONTEXT
);
for (let i = 0; i < 10; i += 1) {
  createUser(parentSpan, i);
  sendEmailWithCredentials(parentSpan, i);
}
// Be sure to end the span.
parentSpan.end();

// Create user
function createUser(parent, idx) {
  const ctx = opentelemetry.api.trace.setSpan(
    opentelemetry.api.context.active(),
    parent
  );

  const span = tracer.startSpan("createUser", undefined, ctx);
  span.setAttribute("login", `user-${idx}`);

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }

  if (idx % 2 === 0) {
    span.setStatus(opentelemetry.api.SpanStatusCode.OK);
    span.addEvent("create user");
  } else {
    span.setStatus(opentelemetry.api.SpanStatusCode.ERROR);
    const err = new Error("Error while creating user");
    span.recordException(err);
  }

  span.end();
}

// Send email to the new user
function sendEmailWithCredentials(parent, idx) {
  const ctx = opentelemetry.api.trace.setSpan(
    opentelemetry.api.context.active(),
    parent
  );

  const sendEmailWithCredentialsSpan = tracer.startSpan(
    "sendEmailWithCredentials",
    { kind: opentelemetry.api.SpanKind.CLIENT },
    ctx
  );
  sendEmailWithCredentialsSpan.setAttribute("login", `user-${idx}`);

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }

  try {
    if (idx % 2 === 0) {
      sendEmailWithCredentialsSpan.setStatus(
        opentelemetry.api.SpanStatusCode.OK
      );
      sendEmailWithCredentialsSpan.addEvent("send email with credentials");
    } else {
      sendEmailWithCredentialsSpan.setStatus(
        opentelemetry.api.SpanStatusCode.ERROR
      );
      sendEmailWithCredentialsSpan.recordException(
        new Error("Error while sending email")
      );
    }
  } finally {
    sendEmailWithCredentialsSpan.end();
  }
}

// Flush all traces
traceExporter
  .forceFlush()
  .then(() => console.log("Traces flushed"))
  .catch((error) => console.log("Error terminating flushing", error));

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
