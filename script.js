document.addEventListener('DOMContentLoaded', () => {
   buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filas = container.querySelectorAll("tr");

  filas.forEach(fila => {
    const nombre = fila.children[1].textContent.toLowerCase();
    const genero = fila.children[4].textContent.toLowerCase();

    if (nombre.includes(texto) || genero.includes(texto)) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });
});

  const modalpelicula = document.getElementById('modalpelicula');
  const modalpeli = new bootstrap.Modal(modalpelicula, {
    backdrop: 'static',
    keyboard: false
  });

  const formpeli = document.getElementById('formpeli');
  const botonagregar = document.getElementById('botonagregar');
  const container = document.querySelector('tbody');

  let opcion = '';
  let idform = 0;

  botonagregar.addEventListener('click', () => {
    formpeli.reset();
    modalpeli.show();
    opcion = 'crear';
  });


  const mostrarData = (peliculas) => {
    let results = '';
    peliculas.forEach(pelicula => {
      results += `
        <tr>
          <td>${pelicula.id}</td>
          <td>${pelicula.name}</td>
          <td>${pelicula.productor}</td>
          <td>${pelicula.anio}</td>
          <td>${pelicula.genero}</td>
          <td>${pelicula.resumen}</td>
          <td class="text-center">
            <a class="botoneditar btn btn-primary">Editar</a>
          </td>
          <td class="text-center">
            <a class="botonborrar btn btn-danger">Eliminar</a>
          </td>
        </tr>
      `;
    });
    container.innerHTML = results;
  };

  fetch('http://localhost:3000/peliculas/')
    .then(res => res.json())
    .then(data => mostrarData(data))
    .catch(error => console.log(error));

  const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
      if (e.target.closest(selector)) {
        handler(e);
      }
    });
  };


on(document, 'click', '.botonborrar', e => {
  const fila = e.target.closest('tr');
  const id = parseInt(fila.firstElementChild.innerHTML);

  alertify.confirm("¿Seguro que quieres borrar este elemento?",
    function () {
      peliculas = peliculas.filter(p => p.id !== id);
      guardarPeliculas(peliculas);
      mostrarData(peliculas);
      alertify.success('Película eliminada');
    },
    function () {
      alertify.error('Operación cancelada');
    });
});

  on(document, 'click', '.botoneditar', e => {
    const fila = e.target.closest('tr');
    idform = parseInt(fila.children[0].innerText);
    const nombreform = fila.children[1].innerHTML;
    const productorform = fila.children[2].innerHTML;
    const anio = fila.children[3].innerHTML;
    const generoform = fila.children[4].innerHTML;
    const resumenform = fila.children[5].innerHTML;

    document.getElementById('nombredelshow').value = nombreform;
    document.getElementById('nombredelproductor').value = productorform;
    document.getElementById('anio').value = anio;
    document.getElementById('gen').value = generoform;
    document.getElementById('resumen').value = resumenform;

    opcion = 'editar';
    modalpeli.show();
  });


 formpeli.addEventListener('submit', (e) => {
  e.preventDefault();

  const anioNum = parseInt(document.getElementById('anio').value);
  if (anioNum < 2010) {
      alert("Esta película/serie es CLÁSICA");
  } else {
      alert("Esta película/serie NO es clásica");
  }

  const pelicula = {
    name: document.getElementById('nombredelshow').value,
    productor: document.getElementById('nombredelproductor').value,
    anio: anioNum,
    genero: document.getElementById('gen').value,
    resumen: document.getElementById('resumen').value
  };

  if (opcion === 'crear') {
  const nuevaId = peliculas.length ? Math.max(...peliculas.map(p => p.id)) + 1 : 1;
  pelicula.id = nuevaId;
  peliculas.push(pelicula);
  guardarPeliculas(peliculas);
  alertify.success("Película agregada");
  mostrarData(peliculas);
}


  if (opcion === 'editar') {
  const index = peliculas.findIndex(p => p.id === idform);
  pelicula.id = idform;
  peliculas[index] = pelicula;
  guardarPeliculas(peliculas);
  alertify.success("Película actualizada");
  mostrarData(peliculas);
}

  modalpeli.hide();
});

});

function guardarPeliculas(peliculas) {
  localStorage.setItem("peliculas", JSON.stringify(peliculas));
}

function cargarPeliculas() {
  const datos = localStorage.getItem("peliculas");
  return datos ? JSON.parse(datos) : [];
}
let peliculas = cargarPeliculas();
mostrarData(peliculas);
