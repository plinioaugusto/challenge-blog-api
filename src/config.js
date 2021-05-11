require('dotenv/config');

global.CHAVE_CODIFICADORA = process.env.CHAVE_API;
global.CONNECTION_STRING = process.env.CONNECTIONSTRING;
global.SENDGRID_KEY = process.env.SENDGRIDKEY;
global.AZURE_CONNECTIONSTRING = process.env.AZURECONNECTIONSTRING;
global.NOTICIA_KEY = process.env.NOTICIAKEY;
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem-vindo ao Blog do Quero Delivery! ';

module.exports = {
    
}