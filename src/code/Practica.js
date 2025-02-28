const express = require('express');
const crypto = require('crypto');
const app = express();
const config = require('../config/Config');

const PORT = config.NODE_PORT_DES_RED;
const APPLICATION_JSON = 'application/json';
const APPLICATION_XML = 'application/xml';
const TEXT_HTML = 'text/html';

const helperServerResponse = (req, res, message) => {
    const acceptHeader = req.headers.accept || '';

    if(acceptHeader.includes(APPLICATION_JSON)) {
        res.json(message);
    }else if(acceptHeader.includes(APPLICATION_XML)){
        let xmlResponse = `<response>`;
        for (const key in message) {
            xmlResponse += `<${key}>${message[key]}</${key}>`;
        }
        xmlResponse += `</response>`;
        res.type('application/xml').send(xmlResponse);
    }else if(acceptHeader.includes(TEXT_HTML)){
        let htmlResponse = '<html><body>';
        for (const key in message) {
            htmlResponse += `<p>${key}: ${message[key]}</p>`;
        }
        htmlResponse += '</body></html>';
        res.type('text/html').send(htmlResponse);
    }else{
        res.status(406).send('Not Acceptable');
    }
}

app.get('/info', (req, res) =>{
    const defaultMessage = {message: ' *Giving information... bip bup*'}
    helperServerResponse(req, res, defaultMessage);
})

app.get('/preferencia', (req, res) =>{
    const acceptHeader = req.headers.accept;
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
        res.status(406).send('Not Acceptable');
    }
})

app.listen(PORT, () => {
    console.log(`Try http://localhost:${PORT} to send a request`);
});