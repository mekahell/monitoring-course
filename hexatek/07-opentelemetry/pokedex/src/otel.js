const {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} = require("@opentelemetry/sdk-trace-base");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-proto");
const {
  OTLPMetricExporter,
} = require("@opentelemetry/exporter-metrics-otlp-http");
const { WebTracerProvider } = require("@opentelemetry/sdk-trace-web");
const { Resource } = require("@opentelemetry/resources");
const {
  SEMRESATTRS_SERVICE_NAME,
} = require("@opentelemetry/semantic-conventions");
const {
  DocumentLoadInstrumentation,
} = require("@opentelemetry/instrumentation-document-load");
const {
  FetchInstrumentation,
} = require("@opentelemetry/instrumentation-fetch");
const {
  XMLHttpRequestInstrumentation,
} = require("@opentelemetry/instrumentation-xml-http-request");
const { ZoneContextManager } = require("@opentelemetry/context-zone");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

const {
  metrics,
} = require("@opentelemetry/api");
const {
  MeterProvider,
  PeriodicExportingMetricReader,
} = require("@opentelemetry/sdk-metrics");

// Optional and only needed to see the internal diagnostic logging (during development)
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const otelCollectorHttpEndpoint = "http://localhost:24318";

const meterProvider = new MeterProvider({
  resource: Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "hexatek-pokedex",
    })
  ),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${otelCollectorHttpEndpoint}/v1/metrics`,
        headers: {}, // an optional object containing custom headers to be sent with each request
        concurrencyLimit: 1, // an optional limit on pending requests
      }),
      exportIntervalMillis: 10000,
    }),
  ],
});
metrics.setGlobalMeterProvider(meterProvider);

const tracerProvider = new WebTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "hexatek-pokedex",
    })
  ),
});

tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(new ConsoleSpanExporter())
);
tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(
    new OTLPMetricExporter({
      url: `${otelCollectorHttpEndpoint}/v1/metrics`,
      headers: {}, // an optional object containing custom headers to be sent with each request
      concurrencyLimit: 1, // an optional limit on pending requests
    })
  )
);
tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: `${otelCollectorHttpEndpoint}/v1/traces`,
      headers: {},
    })
  )
);

tracerProvider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new XMLHttpRequestInstrumentation(),
    new DocumentLoadInstrumentation(),
  ],
});