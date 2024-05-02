# Hexatek - Définition et envoi d'alertes avec Alertmanager et Prometheus

Dans ce tutoriel, nous allons installer:
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) pour la gestion des alertes.

## Pré-requis

* Docker
* Docker Compose

Vous devez avoir démarrer les containers [du précédent tutoriel](../02-prometheus-mimir/).

## Comment démarrer le service Alertmanager ?

1. Ajouter le port forwarding sur le *port 9093* lors de l'ouverture de votre connexion SSH:

```
$ ssh -L 9093:0.0.0.0:9093 ....
```

2. Exécuter la commande suivante:
```
# Démarre les containers en arrière tâche
$ docker compose up -d
```

3. Ouvrez la [WebUI](http://127.0.0.1:9093)

## Configuration du webhook discord

- Editer le fichier `hexatek/04-alertmanager/config/alertmanager.yml`
- Remplacer `<WEBHOOK_URL>` par l'URL du webhook discord reçu par Mail
- Relancer Alertmanager :

```
$ cd hexatek/04-alertmanager
$ docker compose down alertmanager
$ docker compose up alertmanager -d 
```

## Ajout d'alertes

- Editer le fichier `hexatek/02-prometheus-mimir/config/rules.yaml`
- Ajouter un ensemble d'alertes en suivant [la documentation](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) de Prometheus
- Ajouter le label `user: nom prenom` dans vos alertes pour que vous puissiez les reconnaitre.
- Relancer Prometheus :

```
$ cd hexatek/02-prometheus-mimir
$ docker compose down prometheus
$ docker compose up prometheus -d 
```