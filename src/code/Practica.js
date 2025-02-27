const express = require('express');
const crypto = require('crypto');
const app = express();
const config = require('../config/Config');
const PORT = config.NODE_PORT_DES_RED;

const helperServerResponse = (res, status, message) => {
    const accept = req.headers.accept;

    if(accept.includes('application/json')) {
        res.status(status).json({ message });
    }else if(accept.includes('application/xml')){
        let xmlResponse = `<response>`;
        for (const key in message) {
            xmlResponse += `<${key}>${message[key]}</${key}>`;
        }
        xmlResponse += `</response>`;
        res.type('application/xml').send(xmlResponse);
    }else if(accept.includes("text/html")){
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