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
app.get('/visita', (req, res) =>{
    const sql =  'SELECT * FROM visita';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.get('/personal', (req, res) =>{
    const sql =  'SELECT * FROM personal';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.get('/cliente', (req, res) =>{
    const sql =  'SELECT * FROM cliente';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.get('/equipamiento', (req, res) =>{
    const sql =  'SELECT * FROM equipamiento';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.get('/estado', (req, res) =>{
    const sql =  'SELECT * FROM estados';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.get('/visita', (req, res) =>{
    const sql =  'SELECT * FROM visita';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.post('/equipamientopost', (req, res) => {
    const sql = "INSERT INTO equipamiento (`Nombre`) VALUES (?)";
    const values = [
        req.body.Nombre
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
});

app.put('/equipamientoupdate/:id', (req, res) => {
    const sql = "UPDATE equipamiento SET `Nombre` = ? WHERE `IdEquipamiento` = ?";
    const values = [
        req.body.Nombre,
        
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error("Error al actualizar el equipamiento:", err);
            return res.status(500).json({ error: "Error al actualizar el equipamiento" });
        }
        return res.json(data);
    });
});


app.put('/visitaupdate/:id', (req, res) => {
    const sql = "UPDATE equipamiento SET `IdCliente` = ? ,`Ciudad` = ?,`Direccion`  = ?,`Descripcion`  = ?,`IdEquipamiento`  = ?,`IdEstado`  = ?,`Precio`  = ?, `Garantia`  = ?, `Fecha` = ? WHERE `IdVisita` = ?";
    const values = [
        req.body.IdCliente,
        req.body.Ciudad,
        req.body.Direccion,
        req.body.Descripcion,
        req.body.IdEquipamiento,
        req.body.IdEstado,
        req.body.Precio,
        req.body.Garantia,
        req.body.Fecha,
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error("Error al actualizar el equipamiento:", err);
            return res.status(500).json({ error: "Error al actualizar el equipamiento" });
        }
        return res.json(data);
    });
});

app.delete('/equipamiento/:id', (req, res) => {
    const sql = "DELETE FROM equipamiento WHERE IdEquipamiento = ?";
  
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error al actualizar el equipamiento:", err);
            return res.status(500).json({ error: "Error al actualizar el equipamiento" });
        }
        return res.json(data);
    });
});


app.post('/visitapost', (req, res) => {
    const sql = "INSERT INTO visita (`IdCliente`,`Ciudad`,`Direccion`,`Descripcion`,`IdEquipamiento`,`IdEstado`,`Precio`, `Garantia`, `Fecha`) VALUES (?)";
    console.log( req.body.IdCliente)
    console.log( "dato")
    const values = [
        req.body.IdCliente,
        req.body.Ciudad,
        req.body.Direccion,
        req.body.Descripcion,
        req.body.IdEquipamiento,
        req.body.IdEstado,
        req.body.Precio,
        req.body.Garantia,
        req.body.Fecha,
      
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
});






  

app.listen(8081, () => {
    console.log('Escuchando en el puerto 8081')
})