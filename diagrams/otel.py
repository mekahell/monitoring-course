# otel.py
from diagrams import Diagram, Edge, Cluster
from diagrams.onprem.network import Nginx
from diagrams.programming.language import Javascript
from diagrams.custom import Custom
from diagrams.onprem.monitoring import Grafana, Prometheus
from diagrams.onprem.tracing import Jaeger
from diagrams.onprem.logging import Fluentbit
from diagrams.elastic.elasticsearch import Elasticsearch, Kibana
from diagrams.onprem.client import User,Users

with Diagram("Monitoring of a simple Javascript application", filename="otel_diagram", show=False):

    # user
    customers = Users("Customers")
    admin = User("Administrator")

    # Pokedex App
    pokedex_app = Javascript("Pokedex\napplication")

    with Cluster("Hexatek Docker-based Infrastructure"): 
        with Cluster("Metrics containers"):
            prom = Prometheus("Prometheus")
            alertmanager = Prometheus("AlertManager")
            grafana = Grafana("grafana")
            discord = Custom("Discord", "./resources/discord.png")
            prom << grafana
            prom >> Edge(style="dashed", color="red", label="alarms") >> alertmanager
            alertmanager >> Edge(style="dashed", color="red", label="notifications") >> discord
            metrics_containers = [prom, alertmanager, grafana]

        with Cluster("Tracing containers"):
            jaeger = Jaeger("Jaeger")
            tracing_containers = [jaeger]                

        with Cluster("Logging containers"):
            with Cluster("OpenSearch cluster"):
                os_node_1 = Custom("OpenSearch\nStorage Node 1", "./resources/opensearch.png")
                os_node_2 = Custom("OpenSearch\nStorage Node 2", "./resources/opensearch.png")
                os_cluster = [os_node_1, os_node_2]

            fluentbit_processor = Fluentbit("FluentBit\n(Accept SYSLOG+OTLP)")
            os_dashboard = Custom("OpenSearch\nDashboard", "./resources/opensearch.png")

            fluentbit_processor >> os_cluster
            os_dashboard << Edge(style="dashed") << os_cluster
            logging_containers = [fluentbit_processor, os_cluster, os_dashboard]

        with Cluster("Pokedex Containers"):
            otel_collector = Custom("OpenTelemetry\nCollector", "./resources/OpenTelemetry.png")
            pokedex_webserver = Nginx("NGinx webserver")
            otel_collector >> Edge(style="dashed") >> fluentbit_processor
            otel_collector << Edge(style="dashed") << prom
            otel_collector >> Edge(style="dashed") >> jaeger
            pokedex_containers = [pokedex_webserver, otel_collector]
        
    pokedex_app >> Edge(style="dashed") >> otel_collector
    pokedex_app >> pokedex_webserver

    customers >> pokedex_app
    admin >> Edge(label="dashboard") >> grafana
    admin >> Edge(label="logs") >> os_dashboard
    admin >> Edge(label="traces") >> jaeger