const express = require("express")
const cors = require("cors")
//import db from "./database/db"
import router from "./routes/routes"

const app = express();
app.use(cors());
app.use(express.json());
app.use('blogs', router)

// try {
//     await db.authenticate()
//     console.log('Conexion exitosa a la DB')
// } catch (error) {
//     console.log('El error de conexion es: ${error}')
// }

app.get('/', (req, res)=>{
    res.send('Hola Mundo')
}
)
// app.get("/", req, res) => {
//     res.send('Hola Mundo')
// }
// settings 
//app.set('port',process.env.PORT || 4000);
app.listen(4000, () =>{
    console.log('Server UP running in http://localhost:8000/')
})
//module.exports = app;