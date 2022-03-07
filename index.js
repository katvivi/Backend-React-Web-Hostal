const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Connexion a la base de datos
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbhostal'
})

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    session({
      key: "userId",
      secret: "ProjectoPWA",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 60 * 60 * 24,
      },
    })
  );

/**Testing */
app.listen(4000, () => {
    console.log('Funcionando')
})

/**Conexiones DB Entradas Blog */
app.get("/api/Blog/get", (req, res) => {

    const sqlSelect = "SELECT * FROM entradaBlog";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get("/api/Blog/get/:Id", (req, res) => {

    const id = req.params.Id;

    const sqlSelect = "SELECT * FROM entradaBlog WHERE Id = ?";
    db.query(sqlSelect, id,  (err, result) => {
        res.send(result);
    })
})

app.post('/api/Blog/insert', (req, res) => {

    const Titulo = req.body.Titulo
    const Contenido = req.body.Contenido
    const UrlMedia = req.body.UrlMedia
    const Autor = req.body.Autor
    const FechaCreacion = req.body.FechaCreacion

    const sqlInsert = "INSERT INTO entradaBlog (Titulo, Contenido, UrlMedia, Autor, FechaCreacion) VALUES (?, ?, ?, ?, ?)"
    db.query(sqlInsert, [Titulo, Contenido, UrlMedia, Autor, FechaCreacion],(err, result) => {
        res.send("Enviado");
    });
})

app.delete("/api/Blog/delete/:Id", (req, res) => {
    const id = req.params.Id;
    const sqlDelete = "DELETE FROM entradaBlog WHERE Id = ?";

    db.query(sqlDelete, id, (err, result) => {
        if (err) console.log(err)
    })
})

app.put("/api/Blog/update/:Id", (req, res) => {

    const id = req.params.Id;
    const titulo = req.body.Titulo;
    const contenido = req.body.Contenido;
    const urlMedia = req.body.UrlMedia;
    const autor = req.body.Autor
    const fechaCreacion = req.body.FechaCreacion

    const sqlUpdate = "UPDATE entradaBlog SET Titulo = ?, Contenido = ?, UrlMedia = ?, Autor = ?, fechaCreacion = ? WHERE Id = ?";

    db.query(sqlUpdate, [titulo, contenido, urlMedia, autor, fechaCreacion, id], (err, result) => {
        if (err) console.log(err)
    })
})

/**Conexiones DB Habitacion */
app.get("/api/Habitacion/get", (req, res) => {

    const sqlSelect = "SELECT * FROM Habitaciones";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.post('/api/Habitacion/insert', (req, res) => {

    const Nombre = req.body.Nombre
    const Descripcion = req.body.Descripcion
    const Precio = req.body.Precio
    const UrlMediaHabitacion = req.body.UrlMediaHabitacion
    const EspacioPersonas = req.body.EspacioPersonas
    const TipoCama = req.body.TipoCama

    const sqlInsert = "INSERT INTO Habitaciones (Nombre, Descripcion, Precio, UrlMediaHabitacion, EspacioPersonas, TipoCama) VALUES (?, ?, ?, ?, ?, ?)"
    db.query(sqlInsert, [Nombre, Descripcion, Precio, UrlMediaHabitacion, EspacioPersonas, TipoCama],(err, result) => {
        res.send("Enviado");
    });
})

app.delete("/api/Habitacion/delete/:Id", (req, res) => {

    const id = req.params.Id;

    const sqlDelete = "DELETE FROM Habitaciones WHERE Id = ?";

    db.query(sqlDelete, id, (err, result) => {
        if (err) console.log(err)
    })
})

app.put("/api/Habitacion/update/:Id", (req, res) => {
    const Id = req.params.Id
    const Nombre = req.body.Nombre
    const Descripcion = req.body.Descripcion
    const Precio = req.body.Precio
    const UrlMediaHabitacion = req.body.UrlMediaHabitacion
    const EspacioPersonas = req.body.EspacioPersonas
    const TipoCama = req.body.TipoCama

    //console.log("Id: "+Id+" N: "+Nombre+" D: "+Descripcion+" P: "+Precio+ " #: "+EspacioPersonas+" C: "+TipoCama)
    const sqlUpdate = "UPDATE Habitaciones SET Nombre = ?, Descripcion = ?, Precio = ?, UrlMediaHabitacion = ?, EspacioPersonas = ?, TipoCama = ? WHERE Id = ?";

    db.query(sqlUpdate, [Nombre, Descripcion, Precio, UrlMediaHabitacion, EspacioPersonas, TipoCama, Id], (err, result) => {
        if (err) console.log(err)
    })
})

/**Conexion usuarios */
app.get("/api/Usuario/get", (req, res) => {

    const sqlSelect = "SELECT * FROM Usuarios";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

/**Conexion Edicion */
app.get("/api/Edicion/get", (req, res) => {

    const sqlSelect = "SELECT * FROM Edicion";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.post('/api/Edicion/insert', (req, res) => {

    const Autor = req.body.Autor
    const Fecha = req.body.Fecha
    const Titulo = req.body.Titulo

    const sqlInsert = "INSERT INTO Edicion (Autor, Fecha, Titulo) VALUES (?, ?, ?)"
    db.query(sqlInsert, [Autor, Fecha, Titulo],(err, result) => {
        res.send("Enviado");
    });
})

/**Login Auth */

app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
});

app.post('/api/login', (req, res) => {
    
    const user = req.body.user
    const pass = req.body.pass

    db.query(
        "SELECT * FROM usuarios WHERE user = ?;",
        user,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                bcrypt.compare(pass, result[0].pass, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result);
                    } else {
                        res.send({ message: "Usuario o contraseña incorrectos" });
                    }
                });
            } else {
                res.send({ message: "Usuario no existe" });
            }
        }
    )
})

app.post('/api/register', (req, res) => {

    const user = req.body.user
    const pass = req.body.pass

    
    bcrypt.hash(pass, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
        }

        db.query(
            "INSERT INTO usuarios (user, pass) VALUES (?, ?)",
            [user, hash],
            (err, result) => {
                console.log(err);
            }
        )
    })
})
