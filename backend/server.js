const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lopardo"
})

//Ruta para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE Nombre = ? AND Contraseña = ?";
    db.query(sql, [username, password], (err, data) => {
        if(err) return res.status(500).json({ error: "Error en el servidor" });
        if(data.length === 1) {
            return res.json({ message: "Inicio de sesión exitoso" });
        } else {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
    })
})

//Ruta CRUD
app.get('/', (req, res) =>{
    const sql =  'SELECT * FROM datos1';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.listen(8081, () => {
    console.log('Escuchando en el puerto 8081')
})