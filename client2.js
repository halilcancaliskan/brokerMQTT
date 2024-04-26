const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');
const brokerUrl = 'mqtt://test.mosquitto.org'; // Adresse du broker MQTT

const mongoUrl = 'mongodb+srv://hcaliskan:hcaliskan@iot.i2m1jq2.mongodb.net';
const dbName = 'sample_mflix';

let db;
let collection;

// Connexion à MongoDB
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('-> Connecté à MongoDB <-');
        db = client.db(dbName);
        collection = db.collection('movies'); // Collection de films

        // Connexion au broker MQTT
        const client2 = mqtt.connect(brokerUrl);
        const requestTopic = 'film/request'; // Topic pour écouter les demandes

        client2.on('connect', () => {
            console.log('Client2 connecté au broker MQTT.');
            client2.subscribe(requestTopic); // Abonnement au topic de demande
            console.log(`Abonné au topic: ${requestTopic}`);
        });

        client2.on('message', async (topic, message) => { // Callback pour recevoir les messages
            const msgContent = message.toString(); // Contenu du message
            const responseTopic = msgContent.split('répondre à ')[1]; // Topic de réponse

            console.log(`Requête reçue sur le topic ${topic}:`, msgContent);

            try {
                // Récupérer la liste des films depuis MongoDB
                const films = await collection.find().limit(3).toArray(); // Limite à 3 films
                const filmTitles = films.map(f => f.title); // Récupérer les titres des films

                // Publier la réponse avec la liste des films
                client2.publish(responseTopic, `Liste des films: ${filmTitles.join(', ')}`);
                console.log(`Réponse envoyée sur le topic ${responseTopic}`);
            } catch (error) {
                console.error('Erreur lors de la récupération des films:', error);
                client2.publish(responseTopic, 'Erreur lors de la récupération des films');
            }
        });
    })
    .catch(error => console.error('Erreur de connexion à MongoDB:', error));
