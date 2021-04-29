require('dotenv/config');

global.CHAVE_CODIFICADORA = process.env.CHAVE_API;
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem-vindo ao Blog do Quero Delivery! ';

module.exports = {
    connectionString:'mongodb+srv://plinioaugusto:1234@db-blog.ihajk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    sendgridKey:'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',
    azureConnectionString:'DefaultEndpointsProtocol=https;AccountName=plinioaugusto;AccountKey=CLyG91Vf+I0Ro+/pieFG2URNC7FDfgbiU4q2JNAg06mVpvERGIliNC666/eREB0M5Lik+navLXOtuRvGnt5avg==;EndpointSuffix=core.windows.net',
    noticiaKEY:'7f07472dabc64cc59482a44ee038c596'
}