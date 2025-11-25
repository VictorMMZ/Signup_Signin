 // Recuperamos los datos del usuario desde localStorage
    const nombre = sessionStorage.getItem('nombre');


    if (nombre) {
      document.getElementById('bienvenida').textContent = `Welcome, ${nombre}`;

    } else {
      // Si no hay datos, redirigimos al login
      window.location.href = "signin.html";
    }

