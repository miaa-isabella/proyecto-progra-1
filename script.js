
const container = document.querySelector('tbody')
let results = ''
let options = { backdrop: true, keyboard: true };
let modalpeli = new bootstrap.Modal(document.getElementById('modalpelicula'), options);
var formulario = document.querySelector('form')

const nombre = document.getElementById('nombredelshow')
const producer = document.getElementById('nombredelproductor')
const year = document.getElementById('anio')
const genero = document.getElementById('gen')
const sipnosis = document.getElementById('resumen')
const botonagregar = document.getElementById('botonagregar');


let opcion = ''

botonagregar.addEventListener('click', ()=>{
   nombre.value = ''
   producer.value = ''
   year.value = ''
   genero.value = ''
   sipnosis.value = ''
    modalpeli.show()
    opcion = 'crear'
})

const mostrarData = (peliculas) => {
    results = ''; // Evita acumulación de datos
    peliculas.forEach(pelicula => {
        results += `
            <tr>
                <td>${pelicula.name}</td>
                <td>${pelicula.productor}</td>
                <td>${pelicula.anio}</td>
                <td>${pelicula.genero}</td>
                <td>${pelicula.resumen}</td>
                <td class="text-center btn-primary"><a class="botoneditar">Editar</a></td>
                <td class="text-center btn-primary"><a class="botonborrar">Eliminar</a></td>
            </tr>
        `;
    });

    container.innerHTML = results;
};



fetch('http://localhost:3000/peliculas')
.then(res => res.json())
.then(data => mostrarData(data))
.catch(error => console.log(error))
