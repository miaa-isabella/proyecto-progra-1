import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors"; 


    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


    const readData = ()=> {try{
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
    } catch(error){
    console.log(error);
    }
    };
    
    readData();   

    const writeData = (data) =>{try{

    fs.writeFileSync("./db.json", JSON.stringify(data));

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
      id: data.peliculas.length + 1,...body, 
      };

      data.peliculas.push(nuevapeli);
      writeData(data);
      res.json(nuevapeli);
    });

   app.put("/peliculas/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);

    const peliculaIndex = data.peliculas.findIndex((pelicula) => pelicula.id === id);

    if (peliculaIndex === -1) {
        return res.status(404).json({ message: "Película no encontrada" });
    }

    data.peliculas[peliculaIndex] = {
        ...data.peliculas[peliculaIndex],
        ...body,
    };

    writeData(data);
    res.json({ message: "Película actualizada" });
});

    app.delete("/peliculas/:id", (req, res) => {
       const data = readData();
         const id = parseInt(req.params.id);
         const peliculaIndex = data.peliculas.findIndex((pelicula) => pelicula.id === id);
      data.peliculas.splice(peliculaIndex, 1);
      writeData(data);
      res.json({message: "dato eliminado "});

    });

    app.listen(3000,() => {
    console.log('server listening on port 3000');
    });
 



