document.addEventListener('DOMContentLoaded', () => {
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
    const id = fila.firstElementChild.innerHTML;
    alertify.confirm("¿Seguro que quieres borrar este elemento?",
      function () {
        fetch('http://localhost:3000/peliculas/' + id, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(() => {
            location.reload();
            alertify.success('Película eliminada');
          });
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
    fetch('http://localhost:3000/peliculas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pelicula)
    })
      .then(res => res.json())
      .then(() => {
        alertify.success("Película agregada");
        return fetch('http://localhost:3000/peliculas');
      })
      .then(res => res.json())
      .then(data => mostrarData(data));
  }

  if (opcion === 'editar') {
    fetch(`http://localhost:3000/peliculas/${idform}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pelicula)
    })
      .then(res => res.json())
      .then(() => {
        alertify.success("Película actualizada");
        return fetch('http://localhost:3000/peliculas');
      })
      .then(res => res.json())
      .then(data => mostrarData(data));
  }

  modalpeli.hide();
});

});

