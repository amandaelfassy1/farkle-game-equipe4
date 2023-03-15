//const http = require('http')
//const createServer = http
// meme chose qu'au dessus :
const { createServer } = require('http')

const server = createServer((request, response)=> {
    response.end('Bonjour le serveur a répondu')
})
server.listen(3000, () =>console.log('Serveur lancé sur le port 3000'))