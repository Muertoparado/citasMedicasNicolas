import {Router} from 'express';
import validacionTipoDoc  from '../middleware/validacionTipoDoc.js';
import mysql from 'mysql2';

let con= undefined;
const app = Router();


app.use((req, res, next)=>{
    let myConfig=JSON.parse(process.env.MY_CONNECT);
    con = mysql.createPool(myConfig);
    next();
});

app.get('/pacientes', (req,res)=>{
    con.query(/*sql */ `SELECT * FROM  usuario 
    ORDER BY usu_nombre`, (err,data,fil)=>{
        if (err) {
            console.error("Error al ejecutar la consulta de inserción: ", err);
            res.status(500).send("Error al ejecutar la consulta de inserción");
            return;
        }

    console.log("GET PACIENTES");
    res.send(JSON.stringify(data));
    console.log(data);
    })
    
});

app.get('/citas', (req,res)=>{
    con.query(/*sql */ `SELECT * FROM  cita 
    ORDER BY cit_codigo `, (err,data,fil)=>{
        if (err) {
            console.error("Error al ejecutar la consulta de inserción: ", err);
            res.status(500).send("Error al ejecutar la consulta de inserción");
            return;
        }

    console.log("GET citas");
    res.send(JSON.stringify(data));
    console.log(data);
    })
    
});

app.get('/mesp/:especialidad',(req,res)=>{
    const { especialidad } = req.params;
    console.log(especialidad);
con.query(/*sql */ `SELECT m.med_nombreCompleto FROM  medico AS m WHERE m.med_especialidad =? 
`,[especialidad], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET mesp");
res.send(JSON.stringify(data));
console.log(data);
})

});

app.get('/citaproxima/:id', (req,res)=>{
    const { id } = req.params;
con.query(/*sql */ `SELECT cit_fecha FROM  cita WHERE cit_datosUsuario =? 
`,[id], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET citas prox");
res.send(JSON.stringify(data));
console.log(data);
})
});


app.get('/pacientes/med/:med', (req,res)=>{
    const { med } = req.params;
con.query(/*sql */ `SELECT * FROM  cita WHERE cit_medico =? 
`,[med], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET pacientes cita");
res.send(JSON.stringify(data));
console.log(data);
})  
});

app.get('/pacientes/:id', (req,res)=>{
    const { id } = req.params;
con.query(/*sql */ `SELECT * FROM  cita WHERE cit_datosUsuario =? 
`,[id], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET pacientes cita");
res.send(JSON.stringify(data));
console.log(data);
})  
});

app.get('/citas/:fecha', (req,res)=>{
    const { fecha } = req.params;
con.query(/*sql */ `SELECT * FROM  cita WHERE cit_fecha =? 
`,[fecha], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET pacientes cita fecha");
res.send(JSON.stringify(data));
console.log(data);
})  
});

app.get('/med/consultorios', (req,res)=>{
    const { body } = req.params;
con.query(/*sql */ `SELECT m.med_nombreCompleto, m.med_consultorio  FROM  medico AS m 
`,[body], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET medicos y consultorios");
res.send(JSON.stringify(data));
console.log(data);
})  
});

app.get('/med/:id/:fecha', (req,res)=>{
    const { id,fecha } = req.params;
con.query(/*sql */ `SELECT COUNT(*) AS contador_citas FROM  cita  WHERE cit_medico=? AND cit_fecha=?
`,[id,fecha], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }
    const contadorCitas = data[0].contador_citas;
console.log("GET contador citas med fecha");
res.send(JSON.stringify(data));
console.log({contadorCitas});
})  
});

app.get('/consultorios/:id', (req,res)=>{
    const { id } = req.params;
con.query(/*sql */ `SELECT cita.cit_codigo, cita.cit_fecha, cita.cit_estadoCita, medico.med_consultorio
FROM cita
INNER JOIN medico ON cita.cit_medico = medico.med_nroMatriculaProsional
WHERE cita.cit_datosUsuario = ?
`,[id], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }
   
console.log("GET consultorios id paciente");
res.send(JSON.stringify(data));
console.log(data);
})  
});


app.get('/citas/genero/:gen', (req,res)=>{
    const { gen } = req.params;
    console.log(gen);
con.query(/*sql */ `SELECT c.cit_codigo, c.cit_fecha, c.cit_datosUsuario, usu.usu_genero
FROM cita AS c
INNER JOIN usuario AS usu ON c.cit_datosUsuario = usu.usu_id
WHERE usu.usu_genero = ? AND c.cit_estadoCita = 2;
`,[gen], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET citas atendidas por genero");
res.send(JSON.stringify(data));
console.log(data);
})  
});

app.get('/citas/rechazadas/:mes', (req,res)=>{
    const { mes } = req.params;
    console.log();
con.query(/*sql */ `SELECT c.cit_codigo, c.cit_fecha, usu.usu_nombre, m.med_nombreCompleto
FROM cita AS c
INNER JOIN medico AS m ON c.cit_medico = m.med_nroMatriculaProsional
INNER JOIN usuario AS usu ON c.cit_datosUsuario = usu.usu_id
WHERE MONTH(c.cit_fecha) = ? AND c.cit_estadoCita = 3;
`,[mes], (err,data,fil)=>{
    if (err) {
        console.error("Error al ejecutar la consulta de inserción: ", err);
        res.status(500).send("Error al ejecutar la consulta de inserción");
        return;
    }

console.log("GET citas rechazadas en un mes en especifico");
res.send(JSON.stringify(data));
console.log(data);
})  
});

export default app;