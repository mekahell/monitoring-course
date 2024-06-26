# Hexatek - Collecte et stockage des logs avec Fluentbit et OpenSearch

Dans ce tutoriel, nous allons installer:
- [Fluentbit](https://fluentbit.io) pour la collecte des logs.
- [OpenSearch](https://opensearch.org/) pour le stockage des logs.
- [OpenSearch Dashboard](https://opensearch.org/) pour la consultation.

## Pré-requis

* Docker
* Docker Compose
* nodejs
* npm

## Comment démarrer les services Fluentbit et OpenSearch ?

1. Ajouter le port forwarding sur le *port 5601* lors de l'ouverture de votre connexion SSH:

```
$ ssh -L 5601:0.0.0.0:5601 ....
```

2. Exécuter la commande suivante:
```
# Démarre les containers en arrière tâche
$ docker compose up -d
```

3. Ouvrez le [OpenSearch Dashboard](http://127.0.0.1:5601)

## Envoi de logs en SYSLOG avec logger

Depuis la console linux de votre VM, utiliser l'utilitaire `logger` pour envoyer un message au format SYSLOG:

```
# envoi en UDP sur le port 5140
$ logger --server localhost -P 5140 -d "ceci est un message d'information"
```

## Envoi de logs en OpenTelemetry avec le script Javascript:

Depuis la console linux de votre VM, démarrer l'envoi de logs en executant le script JavaScript:

```
$ cd hexatek/05-fluentbit-opensearch
$ npm run send-logs
```

Ce script utilise le SDK OpenTelemetry

## Consultation des logs depuis OpenSearch Dashboard:

### Création de l'index pattern:

- Allez dans la section [Dashboard Management](http://localhost:5601/app/management)
![Screenshot create index pattern](./dashboard-management.png)
- Sélectionner `Index patterns`
![Screenshot create index pattern](./index-pattern.png)
- Créer un nouveau pattern en tapant `hexatek_index`. C'est le nom de l'index dans lequel sont écrits les logs.
![Screenshot create index pattern](./create-index-pattern.png)
- Sélectionner le champ `time` comme référence pour la date et l'heure:
![Screenshot format time](./time-format.png)
- Editez le format du champ `time`:
![Screenshot format time](./time-format-1.png)

## Consultation des logs:

- Ouvrir le dashboard de [OpenSearch](http://localhost:5601/)
- Sélectionner la section `Discover`
![Screenshot discover](./visualize.png)
- Sélectionner votre index dans la section en haut à gauche:
![Screenshot index](./select-index.png)

## Supervision de FluentBit avec Prometheus

- Ajouter une scrape config à Prometheurs dans le fichier ./hexatek/02-prometheus-mimir/config/prometheus.yaml pour récupérer les métriques de FluentBit.

- Les métriques disponibles sont documentées ici: https://docs.fluentbit.io/manual/administration/monitoring

- A partir de ces métriques, créer un dashboard dans Grafana.

## Collecte des logs des containers Docker de l’infrastructure:

Nous allons tenter de récupérer les logs produits par les containers Docker pour les insérer dans OpenSearch.

Pour cela, nous allons utiliser le driver de logs Fluentd de Docker pour forwarder les logs.
La documentation est disponible ici: https://docs.docker.com/config/containers/logging/fluentd/

Côté Fluentbit, nous allons créer une nouvelle source d’entrée de type forward, pour la collecte de logs docker.

N’hésitez pas à vous aider des ressources disponibles sur le web:
https://kevcodez.de/posts/2019-08-10-fluent-bit-docker-logging-driver-elasticsearch/

