import express from "express"
import cors from "cors"
import db from "./database/db"
import blogRoutess from "./routes/routes"

const express = require('express');
const cors = require('cors');
const { default: db } = require('./database/db');

const app = express();

// app.get("/", req, res) => {
//     res.send('Hola Mundo')
// }

// settings 
app.set('port',process.env.PORT || 4000);

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/users', require('./routes/users'))
app.use('/api/habitacion', require('./routes/habitaciones'))

module.exports = app;