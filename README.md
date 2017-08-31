## Piano di Studi
Progetto per il corso di programmazione web

## Prerequisiti

* Node.js - [Scarica ed installa Node.js](https://nodejs.org/en/download/).
* MongoDB - [Scarica ed installa MongoDB](http://www.mongodb.org/downloads).

## Installazione

Una volta installati tutti i prerequisiti, scarica le dependencies con i comandi:
`npm install` e `bower install`

## Utilizzo

Avvia il database con:
`mongod`

ed importa i dati di prova con:

`mongoimport --db pianoDiStudi --collection users --drop --file demoData/demoUsers.json --jsonArray`

` mongoimport --db pianoDiStudi --collection courses --drop --file demoData/demoCourses.json --jsonArray `
 

Per avviare il server:
`node server.js` oppure `nodemon`

Credenziali di accesso amministratore:
email: admin@gmail.com
password: pass

Credenziali di accesso studente:
email: john.doe@gmail.com
password: pass

Credenziali di accesso docente:
email: mark.doe@gmail.com
password: pass

