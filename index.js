import express from 'express';
import fs from "fs";

const app = express();
const readData = ()=> {try{
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
} catch(error){
    console.log(error);
}
};

 readData();   

const writeData = (data) =>{try{
    fs.writeFileSync("/db.json", JSON.stringfy(data));
} catch(error){
    console.log(error);
}

}

app.get("/peliculas",(req, res) => 
    {
        const data = readData();
        res.json(data.peliculas);
})

app.get("/",(req, res) =>{res.send("welcome to my first api!")});

app.listen(3000,() => {
    console.log('server listening on port 3000');
});
