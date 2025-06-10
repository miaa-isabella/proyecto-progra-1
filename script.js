
fetch('http://localhost:3000/peliculas')
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.log(error))

const mostrarData = (data) => {
    let body =''
    for(let i = 0; i < data.length; i++){
        body += '<tr><td>${data[i].name}</td></tr><td>${data[i].productor}</td><td>${data[i].anio}</td></tr>'
    }
    document.getElementById('data').innerHTML = body
}