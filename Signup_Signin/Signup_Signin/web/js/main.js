 // Recuperamos los datos del usuario desde localStorage
    const nombre = localStorage.getItem('nombre');
    const saldo = localStorage.getItem('saldo');

    if (nombre && saldo) {
      document.getElementById('bienvenida').textContent = `Welcome, ${nombre}`;

    } else {
      // Si no hay datos, redirigimos al login
      window.location.href = "signin.html";
    }

