const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');

const app = express()

app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lopardo" //   CAMBIAR DB
})

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Guardar archivos con timestamp
    }
  });
  
  const upload = multer({ storage: storage });

// Ruta para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE Nombre = ? AND Contraseña = ?";
    db.query(sql, [username, password], (err, data) => {
        if (err) return res.status(500).json({ error: "Error en el servidor" });
        if (data.length === 1) {
            const { Nombre } = data[0];
            const token = jwt.sign({ username: username }, 'secreto', { expiresIn: '1h' });
            // Enviar el token y el nombre de usuario junto con la respuesta
            return res.json({ token: token, userName: Nombre, message: "Inicio de sesión exitoso" });
        } else {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
    });
});

// Ruta para modificar contraseña si es igual a 1234
app.put('/updatePassword', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    
    if (currentPassword !== '1234') {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }
  
    const sql = 'UPDATE usuarios SET Contraseña = ? WHERE Nombre = ?';
    db.query(sql, [newPassword, username], (err, result) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return res.status(500).json({ error: 'Error en el servidor al actualizar la contraseña' });
      }
      return res.json({ message: 'Contraseña actualizada correctamente' });
    });
  });

//Ruta para obtener usuario loggeado
app.get('/user', (req, res) => {
    const sql = 'SELECT * FROM usuarios'
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
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

app.post('/clientepost', (req, res) => {
    const clienteData = req.body; // Asegúrate de que los datos lleguen correctamente desde el cliente

    const equipamiento = clienteData.Equipamiento.join(', ');

    const sql = "INSERT INTO cliente (Nombre, DNI, Ciudad, Direccion, Equipamiento, Telefono) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        clienteData.Nombre,
        clienteData.DNI,
        clienteData.Ciudad,
        clienteData.Direccion,
        equipamiento,
        clienteData.Telefono
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error al insertar cliente:", err);
            return res.status(500).json({ error: "Error interno del servidor al crear cliente" });
        }
        return res.json({ success: true, message: "Cliente creado exitosamente" });
    });
});

app.put('/cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const clienteData = req.body; 

    // Convertir el arreglo de equipamientos en una cadena
    const equipamiento = clienteData.Equipamiento.join(', ');
    
    const sql = `
        UPDATE cliente
        SET Nombre = ?, DNI = ?, Ciudad = ?, Direccion = ?, Equipamiento = ?, Telefono = ?
        WHERE IdCliente = ?
    `;

    const values = [
        clienteData.Nombre,
        clienteData.DNI,
        clienteData.Ciudad,
        clienteData.Direccion,
        equipamiento,
        clienteData.Telefono,
        clienteId
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error al actualizar cliente:", err);
            return res.status(500).json({ error: "Error interno del servidor al actualizar cliente" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        return res.json({ success: true, message: "Cliente actualizado exitosamente" });
    });
});


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

app.get('/visitadetalle', (req, res) => {
    const idDato = req.query.idDato;
  
    const sqlVisita = `
      SELECT v.*, GROUP_CONCAT(a.URL) AS Adjuntos
      FROM visita v
      LEFT JOIN adjunto a ON FIND_IN_SET(a.IdAdjunto, v.IdAdjunto) > 0
      WHERE v.IdVisita = ?
      GROUP BY v.IdVisita
    `;
  
    db.query(sqlVisita, [idDato], (err, result) => {
      if (err) return res.status(500).json({ Message: "Error en el servidor", error: err });
  
      if (result.length === 0) {
        return res.status(404).json({ Message: "Visita no encontrada" });
      }
  
      console.log(result[0]); // Añade esto para verificar la respuesta
      return res.json(result[0]);
    });
  });

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
    const sql = "UPDATE visita SET Descripcion = ?, IdEquipamiento = ?, IdEstado = ?, IdPersonal = ?, Precio = ?, Garantia = ?, Fecha = ?, FormaPago = ?, FechaCobro = ? WHERE IdVisita = ?";
    const values = [
        req.body.Descripcion,
        req.body.IdEquipamiento,
        req.body.IdEstado,
        req.body.IdPersonal,
        req.body.Precio,
        req.body.Garantia,
        req.body.Fecha,
        req.body.FormaPago,
        req.body.FechaCobro
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error("Error al actualizar la visita:", err);
            return res.status(500).json({ error: "Error al actualizar la visita" });
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
    const visitaData = req.body;    
    
    // Log para verificar los datos recibidos
    console.log("Datos recibidos para crear visita:", visitaData);
  
    // Asigna un valor predeterminado a IdEquipamiento si está vacío
    const idEquipamiento = visitaData.IdEquipamiento || null;   
  
    // Procesa los adjuntos
    const insertAdjuntoPromises = visitaData.IdAdjunto.split(',').map((fileName, index) => {
      return new Promise((resolve, reject) => {
        const idAdjunto = `ADJ${Date.now() + index}`; // Generar un ID único
        const sqlAdjunto = "INSERT INTO adjunto (IdAdjunto, URL) VALUES (?, ?)";
        db.query(sqlAdjunto, [idAdjunto, fileName.trim()], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(idAdjunto);
        });
      });
    });
  
    Promise.all(insertAdjuntoPromises)
      .then(idAdjuntos => {
        const idAdjuntosString = idAdjuntos.join(',');
        const sqlVisita = `
          INSERT INTO visita (IdCliente, Ciudad, Direccion, Descripcion, IdEquipamiento, IdEstado, IdPersonal, Precio, Garantia, Fecha, FormaPago, FechaCobro, IdAdjunto)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          visitaData.IdCliente,
          visitaData.Ciudad,
          visitaData.Direccion,
          visitaData.Descripcion,
          idEquipamiento,
          visitaData.IdEstado,
          visitaData.IdPersonal,
          visitaData.Precio,
          visitaData.Garantia,
          visitaData.Fecha,
          visitaData.FormaPago,
          visitaData.FechaCobro,
          idAdjuntosString
        ];
  
        db.query(sqlVisita, values, (err, data) => {
          if (err) {
            console.error("Error al insertar visita:", err);
            return res.status(500).json({ error: "Error interno del servidor al crear visita", details: err });
          }
          return res.json({ success: true, message: "Visita creada exitosamente", data });
        });
      })
      .catch(err => {
        console.error("Error al insertar adjuntos:", err);
        return res.status(500).json({ error: "Error interno del servidor al crear adjuntos", details: err });
      });
  });


app.delete('/deletevisita/:id', (req, res) => {
    const visitaId = req.params.id;
  
    const sql = "DELETE FROM visita WHERE IdVisita = ?";
  
    db.query(sql, [visitaId], (err, result) => {
      if (err) {
        console.error("Error al eliminar la visita:", err);
        return res.status(500).json({ error: "Error interno del servidor al eliminar la visita", details: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Visita no encontrada" });
      }
  
      return res.json({ message: "Visita eliminada exitosamente" });
    });
  });
  

// Ruta caja
app.get('/caja', (req, res) => {
    const sql = 'SELECT * FROM caja';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Error en server" });
        return res.json(result);
    });
});

app.get('/caja/:id', (req, res) => {
    const sql = 'SELECT * FROM caja WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error en la consulta SQL:", err);
            return res.status(500).json({ message: "Error en el servidor" });
        }
        return res.json(result);
    });
});

app.post('/caja', (req, res) => {
    const { fecha, detalle, ingreso, egreso } = req.body;

    // Obtener el último saldo de la tabla
    const getLastSaldoQuery = "SELECT saldo FROM caja ORDER BY id DESC LIMIT 1";
    
    db.query(getLastSaldoQuery, (err, result) => {
        if (err) {
            console.error("Error al obtener el último saldo:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        // Si no hay registros previos, el saldo inicial es 0
        const lastSaldo = result.length > 0 ? result[0].saldo : 0;
        
        // Calcular el nuevo saldo
        const newSaldo = lastSaldo + ingreso - egreso;

        const insertQuery = "INSERT INTO caja (fecha, detalle, ingreso, egreso, saldo) VALUES (?, ?, ?, ?, ?)";
        const values = [fecha, detalle, ingreso, egreso, newSaldo];

        db.query(insertQuery, values, (err, data) => {
            if (err) {
                console.error("Error al insertar el registro en caja:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            return res.json({ success: true, message: "Registro creado exitosamente", data });
        });
    });
});

app.put('/caja/:id', (req, res) => {
    const { fecha, detalle, ingreso, egreso } = req.body;
    const sqlGetPreviousData = 'SELECT ingreso, egreso, saldo FROM caja WHERE id = ?';
    const sqlUpdate = 'UPDATE caja SET fecha = ?, detalle = ?, ingreso = ?, egreso = ?, saldo = ? WHERE id = ?';

    db.query(sqlGetPreviousData, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error al obtener los datos anteriores:", err);
            return res.status(500).json({ message: "Error en el servidor" });
        }

        const previousIngreso = result[0].ingreso;
        const previousEgreso = result[0].egreso;
        const previousSaldo = result[0].saldo;

        const newSaldo = previousSaldo - previousIngreso + ingreso - (egreso - previousEgreso);

        db.query(sqlUpdate, [fecha, detalle, ingreso, egreso, newSaldo, req.params.id], (err, result) => {
            if (err) {
                console.error("Error al actualizar el registro:", err);
                return res.status(500).json({ message: "Error en el servidor" });
            }
            return res.json({ success: true, message: "Registro actualizado exitosamente", data: result });
        });
    });
});

app.delete('/caja/:id', (req, res) => {
    const sql = 'DELETE FROM caja WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error en server" });
        return res.json({ success: true, message: "Registro eliminado exitosamente", data: result });
    });
});

app.get('/personal', (req, res) =>{
    const sql =  'SELECT * FROM personal';
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error en server"})
        return res.json(result)
    })
})

app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
  
    // Crear las URLs de los archivos subidos
    const fileURLs = req.files.map(file => `/uploads/${file.filename}`);
  
    res.json({ files: fileURLs });
  });
  
  // Agrega ruta estática para servir archivos subidos
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(8081, () => {
    console.log('Escuchando en el puerto 8081')
})