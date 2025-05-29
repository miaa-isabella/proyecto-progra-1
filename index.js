import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";



    const app = express();
    app.use(bodyParser.json());

    const readData = ()=> {try{
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
    } catch(error){
    console.log(error);
    }
    };

    readData();   

    const writeData = (data) =>{try{
    fs.writeFileSync("./db.json", JSON.stringfy(data));
    } catch(error){
    console.log(error);
    }

    }

    app.get("/peliculas",(req, res) => 
    {
        const data = readData();
        res.json(data.peliculas);
    });

    app.get("/",(req, res) =>{
    res.send("welcome to my first api!!")});

    app.get("/peliculas/:id",(req, res) =>
    {
    const data = readData();
    const id = parseInt(req.params.id);
    const pelicula = data.peliculas.find((pelicula) => pelicula.id == id); 
    res.json(pelicula);
    });

    app.post("/peliculas",(req, res) => {
 const data = readData();
 const body = req.body;
 const nuevapeli = {
    id: data.peliculas.length + 1,...body
 };
 data.peliculas.push(nuevapeli);
 writeData(data);
 res.json(nuevapeli);
    });




    app.listen(3000,() => {
    console.log('server listening on port 3000');
    });
