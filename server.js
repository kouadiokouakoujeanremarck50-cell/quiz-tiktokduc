const express = require('express');
const http = require('http');
const { Server } = require('ws');
// Nouveau nom du package officiel :
const { WebcastPushConnection } = require('@tobiasmuecksch/tiktok-live-connector');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const wss = new Server({ server });

// ⚠️ REMPLACE PAR TON PSEUDO TIKTOK SANS LE @
const TIKTOK_USERNAME = 'ton_pseudo_tiktok'; 

let tiktokConnection = new WebcastPushConnection(TIKTOK_USERNAME);

tiktokConnection.connect().then(state => {
    console.log(`Connecté avec succès au Live TikTok !`);
}).catch(err => {
    console.error('Erreur de connexion :', err);
});

tiktokConnection.on('chat', data => {
    const username = data.uniqueId;
    const comment = data.comment;

    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ user: username, comment: comment }));
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});
