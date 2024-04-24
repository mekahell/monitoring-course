# Tutoriel - Utilisation de SYSLOG pour l'envoi de message

Ici nous allons envoyer plusieurs messages au format SYSLOG avec l'application logger fournit dans la plupart des distribution linux.

Les messages seront réceptionnés par un serveur [Fluentd](https://www.fluentd.org). Il est configuré pour afficher les messages reçu dans la console.

1. Démarrer le serveur [Fluentd](https://www.fluentd.org):

```
$ ./start-syslog-server.sh
```

2. Ouvrir une nouvelle fenetre et saisir la commande suivante:

```
$ docker logs -f syslog
```

Cette commande va permettre d'afficher les messages réceptionnés par Fluentd

3. Démarrer un nouveau container avec l'OS Ubuntu:

```
$ ./start-ubuntu-shell.sh
```

## Envoi des messages

1. Message d'information

```
logger --server syslog -P 5140 -d "ceci est un message d'information"
```

```
2024-04-22 16:08:56.896835000 +0000 syslog.user.notice: {"host":"c7b9439ee396","ident":"root","pid":"-","msgid":"-","extradata":"[timeQuality tzKnown=\"1\" isSynced=\"1\" syncAccuracy=\"662000\"]","message":"ceci est un message d'information"}
```

2. Message d'information avec un autre niveau de criticité

```
logger --server syslog -p warning -P 5140 -d "ceci est un message d'avertissement"
```

```
2024-04-22 16:08:41.095197000 +0000 syslog.user.warn: {"host":"c7b9439ee396","ident":"root","pid":"-","msgid":"-","extradata":"[timeQuality tzKnown=\"1\" isSynced=\"1\" syncAccuracy=\"654500\"]","message":"ceci est un message d'avertissement"}
```

3. Message d'information avec une autre ident

```
logger --server syslog -P 5140 --tag 'Bob' -d "ceci est un message d'information de Bob"
```

```
2024-04-22 16:14:06.533649000 +0000 syslog.user.notice: {"host":"c7b9439ee396","ident":"Bob","pid":"-","msgid":"-","extradata":"[timeQuality tzKnown=\"1\" isSynced=\"1\" syncAccuracy=\"817000\"]","message":"ceci
est un message d'information de Bob"}
```

4. Message d'information avec une autre ident

```
logger --server syslog -P 5140 --tag 'Bob' -d "ceci est un message d'information de Bob"
```

```
2024-04-22 16:14:06.533649000 +0000 syslog.user.notice: {"host":"c7b9439ee396","ident":"Bob","pid":"-","msgid":"-","extradata":"[timeQuality tzKnown=\"1\" isSynced=\"1\" syncAccuracy=\"817000\"]","message":"ceci
est un message d'information de Bob"}
```

5. Message d'erreur avec des métadonnées

```
logger --server syslog -P 5140 -p error --tag 'Bob' -d  --sd-id user@123 --sd-param application=\"erreur_utilisateur\" "ceci est un message d'erreur avec metadonnees"
```

```
2024-04-22 16:17:35.006637000 +0000 syslog.user.err: {"host":"c7b9439ee396","ident":"Bob","pid":"-","msgid":"-","extradata":"[timeQuality tzKnown=\"1\" isSynced=\"1\" syncAccuracy=\"921500\"][user@123 application=\"erreur_utilisateur\"]","message":"ceci est un message d'erreur avec metadonnees"}
```