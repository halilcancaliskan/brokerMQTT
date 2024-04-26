const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid'); // Pour générer un identifiant unique
const brokerUrl = 'mqtt://test.mosquitto.org'; // Adresse du broker MQTT

const client1 = mqtt.connect(brokerUrl); // Connexion au broker

const requestTopic = 'film/request'; // Topic pour la demande
const responseTopic = `film/response/${uuidv4()}`; // Topic unique pour la réponse

client1.on('connect', () => {
    console.log('Client1 connecté au broker MQTT.');

    // Publier la demande avec le topic de réponse
    client1.publish(requestTopic, `Demande de liste de films, répondre à ${responseTopic}`);
    console.log(`Demande envoyée sur le topic: ${requestTopic}`);

    // S'abonner au topic de réponse pour recevoir la réponse
    client1.subscribe(responseTopic);

    // Définir la fonction de callback pour recevoir la réponse
    client1.on('message', (topic, message) => {
        console.log(`Réponse reçue sur le topic ${topic}:`, message.toString());

        // Terminer la connexion après avoir reçu la réponse
        client1.end();
    });
});
