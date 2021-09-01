"use sctrict"
const exec = require('child_process').exec;
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

var dir = __dirname;

app.post("/comp",(req,res) =>{
    var idP = req.body.id;
    var codP = req.body.codigo;
    var nArchivo = idP + "_" + Math.floor(Math.random()*100000)
    var rutaCarpeta =dir+"/tmp/"+nArchivo;
    fs.mkdir(rutaCarpeta,function(e){ 
        if(!e || (e && e.code === 'EEXIST')){ 
            console.log("Dir creado"); 
            fs.writeFile(rutaCarpeta+"/"+nArchivo+".cpp", codP, function(err) {
                if(err) {
                    console.log("Error al escribir el cpp");
                    fs.rmdir(rutaCarpeta, { recursive: true }, (err) => {
                        return res.status(400).send({
                            message: error.message
                         });v
                    });
                }
                console.log("Cpp creado");
                var comandoCompilar = "emcc " + rutaCarpeta+"/"+nArchivo+ ".cpp -o "+ rutaCarpeta+"/"+nArchivo+".js -s WASM=1 -O1 -s EXPORTED_FUNCTIONS=_main,_system -s NO_EXIT_RUNTIME=1 -s ALLOW_MEMORY_GROWTH=1";
                    exec(comandoCompilar, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`error: ${error.message}`);
                            status = -1; //error de compilacion
                            fs.rmdir(rutaCarpeta, { recursive: true }, (err) => {
                                return res.status(400).send({
                                    message: error.message
                                 });
                            });
                        }
                        else if (stderr) {
                            console.error(`stderr: ${stderr}`);
                            status = -2; //genera un warning al compilar 
                        }
                        else{
                            console.log("El wasm se ha creado");
                            fs.readFile(rutaCarpeta+"/"+nArchivo+".wasm",function read(err, data2) {
                                if (err) {
                                    console.log("Error leyendo el wasm")
                                }
                                fs.rmdir(rutaCarpeta, { recursive: true }, (err) => {
                                    if (err) {
                                        console.log("Error borrando el dir")
                                    }
                                    res.send({data2,nArchivo});
                                });
                            });
                        }
                    });
            });
        } 
        else { 
            res.send("Error creando el dir")
        } 
    });
})

app.listen(3000,()=>{
    console.log("WebAssembly cargado");
})