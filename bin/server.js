'use strict'

const app = require('../src/app');
const http = require('http');
const debug = require('debug')('querodelivery:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Criando servidor
const server = http.createServer(app);

//Servidor ouvindo a porta
server.listen(port);
server.on('error', onError);
server.on('Ouvindo ', onListening);
console.log('API rodando na porta ' + port);

//Normalizando a porta
function normalizePort(val){
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
}

//Gerenciando erros
function onError(error){
    if(error.syscall !== 'listen'){
        throw error;
    } 

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; 

    switch (error.code){
        case 'EACCES':
            console.error(bind + ' requer privilégios elevados');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' já está em uso');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//Iniciando o Debug
function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'sting' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Ouvindo em ' + bind);
}