const express = require('express');
const crypto = require('crypto');
const app = express();
const config = require('../config/Config');

const PORT = config.NODE_PORT_DES_RED;
const APPLICATION_JSON = 'application/json';
const APPLICATION_XML = 'application/xml';
const TEXT_HTML = 'text/html';

const URL_INFO = '/info';
const URL_CACHE = '/cache';
const URL_PREFERENCIA = '/preferencia';
const URL_ETAG = '/etag';

const MESSAGE_RESPONSE_INFO = '*Giving information... bip bop*';
const MESSAGE_ERROR_406 = 'Not Acceptable';
const MESSAGE_CACHE_RESPONSE = 'Respuesta con control de caché';
const MESSAGE_RESPONSE_ETAG = 'Contenido con ETAG';


const helperServerResponse = (req, res, message) => {
    const acceptHeader = req.headers.accept || '';

    const messageContent = message.message || message; 

    if (acceptHeader.includes(APPLICATION_JSON)) {
        res.json(message);
    } else if (acceptHeader.includes(APPLICATION_XML)) {
        let xmlResponse = `<response><message>
            ${typeof messageContent === 'object' ? JSON.stringify(messageContent) : messageContent}</message></response>`;
            res.type(APPLICATION_XML).send(xmlResponse);
    } else if (acceptHeader.includes(TEXT_HTML)) {
        let htmlResponse = `<html><body><p>${messageContent}</p></body></html>`;
        res.type(TEXT_HTML).send(htmlResponse);
    } else {
        res.status(406).send(MESSAGE_ERROR_406);
    }
}

app.get(URL_INFO, (req, res) =>{
    const defaultMessage = {message: MESSAGE_RESPONSE_INFO}
    helperServerResponse(req, res, defaultMessage);
})

app.get(URL_PREFERENCIA, (req, res) =>{
    const acceptHeader = req.headers.accept || '';
    const typeHeader = acceptHeader.split(',').map(format => {
        const [type, q = 'q=1'] = format.split(';');
        return { type: type.trim(), q: parseFloat(q.split('=')[1] || 1) };
    }).sort((a, b) => b.q - a.q);

    const supportedFormats = [APPLICATION_JSON, APPLICATION_XML, TEXT_HTML];
    const matchHeader = typeHeader.find(header => supportedFormats.includes(header.type));

    if(matchHeader){
        const message = {message: ` *Preferred format: ${matchHeader.type}*`}
        helperServerResponse(req, res, message);
    }
    else{
        res.status(406).send(MESSAGE_ERROR_406);
    }
})

app.get(URL_CACHE, (req, res) => {
    res.set({'Cache-Control': 'max-age=30','Expires': 
        new Date(Date.now() + 30000).toUTCString(),'Pragma': 'no-cache'
    });
    res.send(MESSAGE_CACHE_RESPONSE);
});

app.get(URL_ETAG, (req, res) => {
    const etag = crypto.createHash('md5').update(MESSAGE_RESPONSE_ETAG).digest('hex');

    if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
    } else {
        res.set('ETag', etag);
        res.send(MESSAGE_RESPONSE_ETAG);
    }
});


app.listen(PORT, () => {
    console.log(`Try http://localhost:${PORT} to send a request`);
});