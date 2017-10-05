## Piano di Studi
Progetto per il corso di programmazione web

Realizzato da:

Morena Barboni 095130 morena.barboni@studenti.unicam.it

Costanza Cesanelli 099211 costanza.cesanelli@studenti.unicam.it

## User Stories
- come utente voglio poter accedere ad un’area privata tramite username e password
- come admin voglio poter modificare il piano di studio
- come studente voglio potermi iscrivere ad un esame
- come professore voglio poter caricare ed inviare i risultati degli esami agli studenti
- come studente voglio visualizzare la mia carriera universitaria anche con l’ausilio di grafici

- come studente voglio poter effettuare una ricerca per docente e visualizzare l'elenco dei relativi corsi attivi
- come studente voglio poter effettuare una richiesta di tesi ad un docente (e come docente gestire le richieste di tesi)
- come studente voglio poter calcolare la proiezione di un voto e la pianificazione della media.
- come utente autenticato voglio poter accedere ad una pagina statistiche, dove visualizzare le percentuali di
  iscrizioni e la distribuzione delle medie per facoltà
- come admin voglio poter accedere all'elenco di tutti gli utenti iscritti al sito ed eliminarli

## Architettura del Codice

----+ app                   // File necessari alla gestione del server

    |
    |--- config             // File di configurazione per il database e per l'autenticazione

    |--+ controllers        // Funzioni per il database
       |
       |----authentication.js      
       |----bookings.js            
       |----exam.js                
       |----exam-session.js       
       |----plan.js               
       |----profile.js            
       |----thesis.js           
       |

    |--+ models            // schemi Mongoose
       |
       |----bookings.js      
       |----courses.js       
       |----exam-session.js  
       |----exams.js          
       |----users.js         
       |----thesis.js      


   |--+ routes.js          // routes API

----+ demoData:            //Tutti i dati di default

    |            
    |--------demoCourses.json  //dati di default per i corsi

    |--------demoExams.json    //dati di default per gli esami

    |--------demoSession.json  // dati di default per gli appelli

    |--------demoUser.json     //dati di default per gli utenti
    

----+ public              //File per la gestione della parte client

    |
    |----index.js         // pagina di default

    |----main.js          // route provider

    |------auth           // modulo per la gestione dell'autenticazione

    |--career             // modulo per la gestione della carriera

    |--+common            // servizi e direttive

       |---- directives
       |----services

    |--+content           //fogli di stile e immagini

       |--css
       |--img

    |--examBooking:       // modulo per la gestione della prenotazione degli appelli
    |-examSession:        //modulo per la gestione degli appelli e della verbalizzazione
    |--home:              //modulo per la home
    |--lib:               //libreria di bower
    |--plan:              //modulo per la gestione del piano di studi 
    |--professorSearch:   //modulo per la ricerca docente
    |--profile:          //modulo per la gestione del profilo utente
    |--scripts:          //scripts esterni
    |--statistics:       //modulo per la gestione delle statistiche
    |--thesis:          //modulo per la gestione delle tesi
    |--userManagement:   //modulo per la gestione degli utenti 

----server.js: 

----package.json

----bower.json

----.bowercc


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

` mongoimport --db pianoDiStudi --collection exams --drop --file demoData/demoExams.json --jsonArray `

` mongoimport --db pianoDiStudi --collection examsessions --drop --file demoData/demoSessions.json --jsonArray `
 

Per avviare il server:
`node server.js`

Credenziali di accesso amministratore:
email: admin@gmail.com
password: pass

Credenziali di accesso studente:
email: john.doe@gmail.com
password: pass

Credenziali di accesso docente:
email: mark.doe@gmail.com
password: pass

## App deployata su Heroku

https://pweb-piano-di-studi.herokuapp.com/

## Video Presentazione
https://www.youtube.com/watch?v=f_U382-YqSg

## PDF
http://www.mediafire.com/?anv13dv6e2bkt
