function cargarPeliculas() {
  const datos = localStorage.getItem("peliculas");
  return datos ? JSON.parse(datos) : [];
}

// Función para guardar películas en localStorage
function guardarPeliculas(peliculas) {
  localStorage.setItem("peliculas", JSON.stringify(peliculas));
}

// Cargar películas al iniciar
let peliculas = cargarPeliculas();

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const buscador = document.getElementById('buscador');
  const modalpelicula = document.getElementById('modalpelicula');
  const formpeli = document.getElementById('formpeli');
  const botonagregar = document.getElementById('botonagregar');
  const container = document.querySelector('tbody');
  
  // Variables de control
  let opcion = '';
  let idform = 0;

  // Inicializar modal de Bootstrap
  const modalpeli = new bootstrap.Modal(modalpelicula, {
    backdrop: 'static',
    keyboard: false
  });

  // Función para mostrar datos en la tabla
  const mostrarData = (peliculas) => {
    let results = '';
    peliculas.forEach(pelicula => {
      // Determinar si es clásica (antes de 2010)
      const esClasica = pelicula.anio < 2010;
      const badgeClasica = esClasica ? '<span class="badge bg-warning">CLÁSICA</span>' : '';
      
      results += `
        <tr>
          <td>${pelicula.id}</td>
          <td>${pelicula.name} ${badgeClasica}</td>
          <td>${pelicula.productor}</td>
          <td>${pelicula.anio}</td>
          <td>${pelicula.genero}</td>
          <td>${pelicula.resumen.length > 100 ? pelicula.resumen.substring(0, 100) + '...' : pelicula.resumen}</td>
          <td class="text-center">
            <button class="botoneditar btn btn-primary btn-sm me-1">Editar</button>
            <button class="botonborrar btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      `;
    });
    container.innerHTML = results;
  };

  // Función auxiliar para eventos delegados
  const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
      if (e.target.closest(selector)) {
        handler(e);
      }
    });
  };

  // Event listener para el buscador
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

  // Event listener para agregar película
  botonagregar.addEventListener('click', () => {
    formpeli.reset();
    document.getElementById('titulo').textContent = 'Nueva Película/Serie';
    
    // Generar nuevo ID
    const nuevoId = peliculas.length ? Math.max(...peliculas.map(p => p.id)) + 1 : 1;
    document.getElementById('id').value = nuevoId;
    
    opcion = 'crear';
    modalpeli.show();
  });

  // Event listener para eliminar película
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

  // Event listener para editar película
  on(document, 'click', '.botoneditar', e => {
    const fila = e.target.closest('tr');
    idform = parseInt(fila.children[0].innerText);
    const nombreform = fila.children[1].innerText.replace(' CLÁSICA', ''); // Remover badge
    const productorform = fila.children[2].innerHTML;
    const anio = fila.children[3].innerHTML;
    const generoform = fila.children[4].innerHTML;
    
    // Buscar el resumen completo en el array
    const peliculaCompleta = peliculas.find(p => p.id === idform);
    const resumenform = peliculaCompleta ? peliculaCompleta.resumen : fila.children[5].innerHTML;

    document.getElementById('id').value = idform;
    document.getElementById('nombredelshow').value = nombreform;
    document.getElementById('nombredelproductor').value = productorform;
    document.getElementById('anio').value = anio;
    document.getElementById('gen').value = generoform;
    document.getElementById('resumen').value = resumenform;
    document.getElementById('titulo').textContent = 'Editar Película/Serie';

    opcion = 'editar';
    modalpeli.show();
  });

  // Event listener para el formulario
  formpeli.addEventListener('submit', (e) => {
    e.preventDefault();

    const anioNum = parseInt(document.getElementById('anio').value);
    
    // Validar año y mostrar alerta
    if (anioNum < 2010) {
      alertify.notify("Esta película/serie es CLÁSICA", 'warning', 3);
    } else {
      alertify.notify("Esta película/serie NO es clásica", 'message', 3);
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
      alertify.success("Película agregada correctamente");
    }

    if (opcion === 'editar') {
      const index = peliculas.findIndex(p => p.id === idform);
      pelicula.id = idform;
      peliculas[index] = pelicula;
      guardarPeliculas(peliculas);
      alertify.success("Película actualizada correctamente");
    }

    mostrarData(peliculas);
    modalpeli.hide();
  });

  // Mostrar datos iniciales
  mostrarData(peliculas);
});