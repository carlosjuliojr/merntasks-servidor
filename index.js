const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors');

//crear el servidor
const app = express();

//conectar a la base de datos
conectarDB();

//Habilitar el cors
app.use(cors());

//Habilitar express.json
app.use(express.json({extended : true}));

// PUERTO DE LA APP
const port = process.env.PORT || 4000

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Arrancar el servidor

app.listen(port,'0.0.0.0', () => {
    console.log(`el servidor esta funcionandon en el puerto: ${port}`)
})