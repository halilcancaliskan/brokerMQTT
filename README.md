# README - Lancer les Clients MQTT (Client1 et Client2) avec MongoDB

# Prérequis
Node.js (version 12 ou ultérieure)
npm (gestionnaire de paquets Node.js)
Connexion à Internet (pour se connecter à un broker MQTT public et à MongoDB)

# Installation
```npm install mqtt mongodb yargs```

# Exécution des Clients
Lancez client2.js pour établir la connexion à MongoDB et s'abonner au broker MQTT. Cela se fait en exécutant:
```node client2.js```

Lancez client1.js pour envoyer une demande à client2. Cela se fait en exécutant:
```node client1.js```
