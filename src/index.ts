// importati  imoduli che ci possono servire per l'applicazione
const result = require('dotenv').config();
const fs = require('fs');
const http = require('http');
const colors = require('colors');
colors.enabled = true;
const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');  
const jwt = require('express-jwt');
const cors = require('cors');                  
const io = require('socket.io');



//crezione dell'istanza del modulo Express
const app = express();
//utilizziamo delle global middleware functions che possono essere inserite nella pipeline indipendentemente dal metodo HTTP e endpoint usati. Attenzione all'ordine in cui si possono mettere
// in questo caso cors(cross-origin resource sharing) serve nel condividere risorse limitate tra le origini che possono avere domini diversi
app.use(cors());
//estrae l'intero body di una incoming request stream e lo "passa" nel req.body
app.use(bodyparser.json())

// TODO vedere in che modo conviene creare il server, se dopo aver connesso il database o prima, Mettere nel .env url mongo, jwt ecc.