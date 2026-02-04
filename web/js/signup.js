// --- 1. REFERENCIAS DE CAMPOS Y ELEMENTOS ---
// Referencias a todos los elementos del DOM (HTML) necesarios
// para leer sus valores (Inputs) y mostrar mensajes de error (divs de error).


// Referencia principal al formulario por su ID
const form = document.getElementById("registro");


// Referencias de Inputs y divs de Error
const nombreInput = document.getElementById("nombre");
const errorNombre = document.getElementById("errorNombre");


const middleInitialInput = document.getElementById("middleInitial");
const errorMiddleInitial = document.getElementById("errorMiddleInitial");


const apellidosInput = document.getElementById("apellidos");
const errorApellidos = document.getElementById("errorApellidos");


const emailInput = document.getElementById("email");
const errorEmail = document.getElementById("errorEmail");


const passwordInput = document.getElementById("password");
const errorPassword = document.getElementById("errorPassword");


const telefonoInput = document.getElementById("telefono");
const errorTelefono = document.getElementById("errorTelefono");


const calleInput = document.getElementById("calle");
const errorCalle = document.getElementById("errorCalle");


const ciudadInput = document.getElementById("ciudad");
const errorCiudad = document.getElementById("errorCiudad");


const paisInput = document.getElementById("pais");
const errorPais = document.getElementById("errorPais");


const zipInput = document.getElementById("zip");
const errorZip = document.getElementById("errorZip");


// Elemento para mostrar respuesta del servidor
const responseMsg = document.getElementById("responseMsg");




// EXPRESIONES REGULARES (REGEX) PARA LA VALIDACIÓN DE FORMATO
// Formato que debe cumplir cada campo.
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,100}$/;                  // Solo letras y espacios (2 a 100)
const regexApellidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,80}$/;                // Solo letras y espacios (2 a 80)
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Formato email estándar
const regexCalle = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{2,50}$/;                 // Solo letras, números y espacios (2 a 50)
const regexCiudad = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,30}$/;                   // Solo letras y espacios (2 a 30)
const regexPais = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;                     // Solo letras y espacios (2 a 50)
const regexZip = /^[0-9]{5}$/;                                          // Exactamente 5 dígitos
const regexTelefono = /^[0-9]{9,15}$/;                                  // Solo números (9 a 15 dígitos)
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;             // Contraseña: Mín. 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número.
const regexMiddleInitial = /^[A-Za-z]{1}$/;                             // Inicial de S.N.:  1 carácter alfabético  






// --- 2. FUNCIÓN DE VALIDACIÓN GENÉRICA ---
// Función para validar un campo genérico.
function validateField(input, errorElement, regex, msg) {
    const valor = input.value.trim();
   
    // 1. Revisa si el campo está vacío, si es el caso le mostrará el mensaje de "obligatorio"
    if (valor === "") {
        errorElement.textContent = "Este campo es obligatorio.";
        input.style.borderColor = "#b91c1c";
        return false;
   
    // 2. Si no está vacío, revisa el formato usando la Expresión Regular, si no es de acuerdo al Regex, le mostrará el mensaje que se añade en la función "validateAllFields"
    } else if (!regex.test(valor)) {
        errorElement.textContent = msg;
        input.style.borderColor = "#b91c1c";
        return false;
   
    // 3. Si pasa ambas validaciones
    } else {
        errorElement.textContent = ""; // Limpia el mensaje de error
        input.style.borderColor = "#22c55e";
        return true;
    }
}





// --- 3. LÓGICA DE VALIDACIÓN FINAL Y ENVÍO ---
// Valida todos los campos antes de enviar el formulario.
function validateAllFields() {
    let isValid = true;
   
    // Lista de campos y sus parámetros de validación para iterar fácilmente
    const validationMap = [
        // MENSAJES
        { input: nombreInput, error: errorNombre, regex: regexNombre, msg: "Solo letras y espacios (2 a 100 caracteres)." },
        { input: middleInitialInput, error: errorMiddleInitial, regex: regexMiddleInitial, msg: "Debe ser exactamente una letra." },
        { input: apellidosInput, error: errorApellidos, regex: regexApellidos, msg: "Solo letras y espacios (2 a 80 caracteres)." },
        { input: emailInput, error: errorEmail, regex: regexEmail, msg: "Introduce un correo válido." },
        { input: telefonoInput, error: errorTelefono, regex: regexTelefono, msg: "Solo números (9–15 dígitos)." },
        { input: calleInput, error: errorCalle, regex: regexCalle, msg: "Solo letras, números y espacios (2 a 50 caracteres)." },
        { input: ciudadInput, error: errorCiudad, regex: regexCiudad, msg: "Solo letras y espacios (2 a 30 caracteres)." },
        { input: paisInput, error: errorPais, regex: regexPais, msg: "Solo letras y espacios (2 a 50 caracteres)." },
        { input: zipInput, error: errorZip, regex: regexZip, msg: "Debe contener exactamente 5 números." },
        { input: passwordInput, error: errorPassword, regex: regexPassword, msg: "Mín. 8 caracteres, 1 mayúscula, 1 minúscula y 1 número." }
    ];






    /**
    // Validación de forma individual con bucle if-else, podria servir en caso de que quiera cambiar algo en especifico
    if (passwordInput) {
        if (!regexPassword.test(passwordInput.value.trim())) {
            errorPassword.textContent = "Mín. 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.";
            passwordInput.style.borderColor = "#b91c1c";
            isValid = false;
        } else {
            errorPassword.textContent = "";
            passwordInput.style.borderColor = "#22c55e";
        }
    }
    */




    // Recorrer y validar los demás campos
    validationMap.forEach(f => {
        // Usamos la misma lógica de validación para todos los campos requeridos
        if (!validateField(f.input, f.error, f.regex, f.msg)) {
            isValid = false;
        }
    });


    // Si la validación es errónea
    if (!isValid) {
         return false;
    }
   
    // Si la validación local es exitosa
    return true;
}


/**
 * Estructura XML  para la API del servidor.
 * * Se construye el XML con los datos recolectados, que ya han sido validados.
 */
function createCustomerXML() {
    const data = {
        firstName: nombreInput.value.trim(),
        lastName: apellidosInput.value.trim(),
        phone: telefonoInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        street: calleInput.value.trim(),
        city: ciudadInput.value.trim(),
        state: paisInput.value.trim(),
        zip: zipInput.value.trim(),
        middleInitial: middleInitialInput.value.trim(),
    };
   
    // Construir la cadena XML
    const xml = `
<customer>
    <firstName>${data.firstName}</firstName>
    <lastName>${data.lastName}</lastName>
    <middleInitial>${data.middleInitial}</middleInitial>
    <street>${data.street}</street>
    <city>${data.city}</city>
    <state>${data.state}</state>
    <zip>${data.zip}</zip>
    <phone>${data.phone}</phone>
    <email>${data.email}</email>
    <password>${data.password}</password>
</customer>`.trim();
   
    return xml;
}


/**
 * Envía la solicitud POST al servidor para el registro de forma asíncrona (Fetch API).
 */
function sendSignUpRequest (){
    const registerForm = document.getElementById("registro");
    const msgBox = document.getElementById("responseMsg");
    const customerXML = createCustomerXML();
   
    msgBox.style.display = 'none'; // Oculta mensajes previos


    // Inicia la solicitud asíncrona usando la API Fetch
    fetch(registerForm.action,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/xml'}, // Indica que estamos enviando datos en formato XML
            body: customerXML
        })  


        // Manejo específico de códigos de estado HTTP
        .then(response => {
            //Procesado de respuesta error 403. Email ya regsitrado
            if (response.status === 403) {
                throw new Error('El email ya está registrado. Por favor, inicia sesión.');}
           
            //Procesado de respuesta error 500. Error interno del servidor
            else if (response.status === 500) {
                throw new Error('Error del servidor. Inténtalo más tarde.');
            }


            //Procesado de respuesta otro error
            else if (!response.ok) {
                return response.text().then(text => {
                    throw new Error('Error inesperado al registrar.');
                });
            }


            // Si el status es 200-299 (ej. 200 OK o 201 Created), continúa.
            return response.text();
        })
        .then(data => {
            // Éxito: Muestra mensaje y redirige
            msgBox.className = 'success';
            msgBox.textContent = '¡Registro exitoso! Redirigiendo a Iniciar Sesión...';
            msgBox.style.display = 'block';
          
          // Redirigir después de 2 segundos al login (signin.html)
            setTimeout(() => {
                window.location.href = '../html/signin.html';
            }, 2000);

        })
       
        .catch(error => {
            // Falla: Muestra el mensaje de error capturado
            msgBox.className = 'error';
            msgBox.textContent = 'Error: ' + error.message;
            msgBox.style.display = 'block';
        }
    );
}








// --- 4. FUNCIÓN PRINCIPAL DE ENVÍO  ---
/**
 * Función que se activa al enviar el formulario (onsubmit).
 */
function handleSignUpOnClick(event) {
    // 1. Detener la acción predeterminada del navegador (para evitar la recarga de página)
    event.preventDefault();
    event.stopPropagation();


    // 2. Validar todos los campos del formulario
    if (validateAllFields()) {
       // 3. Si la validación es exitosa, se procede a enviar la solicitud al servidor
        sendSignUpRequest();
    }
}
