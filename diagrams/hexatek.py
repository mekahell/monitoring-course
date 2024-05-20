# hexatek.py
from diagrams import Diagram, Edge, Cluster
from diagrams.onprem.compute import Server
from diagrams.custom import Custom
from diagrams.onprem.monitoring import Grafana, Prometheus
from diagrams.onprem.tracing import Jaeger
from diagrams.onprem.logging import Fluentbit
from diagrams.onprem.client import User

with Diagram("Monitoring of a simple Javascript application", filename="otel_diagram", show=False):

    # user
    admin = User("Administrator")

    with Cluster("Hexatek Docker-based Infrastructure"): 

        demo_service = Server("Demo service\n(Go)")

        with Cluster("Tracing containers"):
            jaeger = Jaeger("Jaeger")
            zipkin = Custom("Zipkin", "./resources/zipkin.png")
            tempo = Custom("Grafana Tempo", "./resources/tempo.png")
            tracing_containers = [jaeger, zipkin, tempo]                

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

        with Cluster("Metrics containers"):
            prom = Prometheus("Prometheus")
            alertmanager = Prometheus("AlertManager")
            grafana = Grafana("grafana")
            discord = Custom("Discord", "./resources/discord.png")
            prom << grafana
            prom >> Edge(style="dashed", color="red", label="alarms") >> alertmanager
            prom >> Edge(style="dotted") >> jaeger
            prom >> Edge(style="dotted") >> zipkin
            prom >> Edge(style="dotted") >> fluentbit_processor
            prom >> Edge(style="dotted") >> demo_service
            alertmanager >> Edge(style="dashed", color="red", label="notifications") >> discord
            metrics_containers = [prom, alertmanager, grafana]            

    admin >> Edge(label="dashboard") >> grafana
    admin >> Edge(label="logs") >> os_dashboard
    admin >> Edge(label="traces") >> tracing_containers