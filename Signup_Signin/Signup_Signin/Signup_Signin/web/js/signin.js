function handleSignInOnClick (event){
     const msgBox = document.getElementById("responseMsg");
    msgBox.textContent = '';
msgBox.style.display = 'none';
    document.getElementById("error_usu").innerHTML="";
    document.getElementById("error_pass").innerHTML="";
               const emailregex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    //Obtenemos los objetos para los elementos del form
                    const tfEmail=document.getElementById("tfEmail");
                    const tfPassword=document.getElementById("tfPassword");
                    const signInForm=document.getElementById("signInForm");
                
                    //Creamos un objeto RegExp para validar el email
                 
                   
                    //Detenemos la propagación de eventos y la acción por defecto
                    //del formulario
                    event.preventDefault();
                    event.stopPropagation();
                    //Validar que email y password están informados
                    if(tfEmail.value.trim()===""||tfPassword.value.trim()===""){
                  document.getElementById("error_pass").innerHTML="<p> You must fill in both fields</p>";
                    return;//Validar que email and password cumplen longitud
                }            
            if(tfEmail.value.length>255){
                        document.getElementById("error_usu").innerHTML="<p> The email cannot be longer than 255 characters.</p>";
                        msgBox.textContent = '';
                        msgBox.style.display = 'none';
                    return;
                }
            if (tfPassword.value.length>255){
                    document.getElementById("error_pass").innerHTML="<p> The password cannot exceed 255 characters.</p>";
                    msgBox.textContent = '';
                    msgBox.style.display = 'none';
                //Validar formato de email
                return;
            }
            if(!emailregex.test(tfEmail.value.trim())){
                document.getElementById("error_usu").innerHTML="<p> Incorrect email format.</p>";
                    msgBox.textContent = '';
                    msgBox.style.display = 'none';
                                return;
            }
            
            
            
             
             const valueTfEmail=tfEmail.value.trim();
                const valueTfPassword=tfPassword.value.trim();
            //hacerlo con fecth mirar codigo 
            //progrmacion funcional,le pasas a una funcion como parametro otra funcion

        const baseUrl = "http://localhost:8080/CRUDBankServerSide/webresources/customer/sigin/";
 
        const  newpath =baseUrl +
                    `${encodeURIComponent(valueTfEmail)}/${encodeURIComponent(valueTfPassword)}`;
             
             //signInForm.submit() ;
             
             
           fetch(newpath,
           { method: 'GET',
                headers: { 
                   'Content-Type': 'application/json' 
               }
           }) .then(response => { 
               if (response.status === 401) {
                   return response.text().then(() => {
                       throw new Error('User not found!!');
                   });
               } else if (response.status === 404) {
                   return response.text().then(() => {
                       throw new Error('too many requests!!');
                   });
               } else if (response.status === 500) {
                   return response.text().then(() => {
                       throw new Error('Server Error. Please try later!!');
                   });
               } else if (!response.ok) {
                   return response.text().then(text => {
                       throw new Error(text || 'Unexpected error!!');
                   });
               } return response.json(); // <-- ahora obtenemos JSON 
               }) .then(data => { // Accedemos directamente a las propiedades del JSON
                     const nombre = data.firstName; const id = data.id; 
                     
                // Guardamos en localStorage 
                  localStorage.setItem('nombre', nombre); 
                  localStorage.setItem('id', id); 

                            //en caso de que nos de el okey
                            
                            msgBox.className = 'success';
                            msgBox.textContent = 'Customer signed in successfully!';
                            msgBox.style.display = 'block';
                            msgBox.style.color = '#ffffff';
                            msgBox.style.padding="10px";
                            msgBox.style.border="1px solid black";
                            msgBox.style.backgroundColor="lightgreen" ;
                            msgBox.style.borderRadius="10px";
                              setTimeout(() => {
                                signInForm.submit() ;
                                 window.location.href = "main.html"; }, 2000);
                            
                                      
                        })
                        //Procesado de errores
                        .catch(error => {
                            msgBox.className = 'error';
                            msgBox.textContent = '¡¡Error: ' + error.message;
                            msgBox.style.display = 'block';
                            msgBox.style.padding="10px";
                            msgBox.style.border="1px solid black";
                            msgBox.style.backgroundColor="lightcoral";
                            msgBox.style.borderRadius="10px";
                               
                        }
                    );
            
            }
          
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('tfPassword');

togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

});
                    
                  

