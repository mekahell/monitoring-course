# Tutoriels - Supervision d'infrastructure informatique

Support de travaux pratiques pour le cours de supervision.

## 01 - [Syslog](./01-syslog/)

Découverte du format des messages Syslog avec Fluentd et l'utilitaire logger.

## 02 - HexaTek - [Collecte des métriques avec Prometheus et Mimir](./hexatek/02-prometheus-mimir/)

Dans ce module, nous allons installer [Prometheus](https://prometheus.io/) pour la collecte des métriques d'un service de Hexatek. 
En supplément, on installera [Grafana Mimir](https://grafana.com/oss/mimir/) pour le stockage long terme sur S3 de ces données.

## 03 - HexaTek - [Reporting avec Grafana](./hexatek/03-grafana/)

Ici nous allons créer un dashboard afin de consulter l'état de l'architecture Hexatek. 
Les données utilisées seront celles de notre précédente activité.

## 04 - HexaTek - [Envoi d'alertes avec AlertManager](./hexatek/04-alertmanager/)

Nous allons définir des alertes dans Prometheus. Si elles sont déclenchées alors Alertmanager enverra une notification sur notre channel Discord.

## 05 - HexaTek - [Collecte des logs avec Fluentbit et OpenSearch](./hexatek/05-fluentbit-opensearch/)

Nous allons mettre en oeuvre une collecte des logs par SYSLOG ou OpenTelemetry. Ces logs sont stockées dans OpenSearch. Ils pourront être consulté avec le dashboard OpenSearch.

## 06 - HexaTek - [Collecte des traces applicatives avec Jaeger](./hexatek/06-jaeger/)

Avec OpenTelemetry, nous récupérons des traces applicatives de notre application en JavaScript.