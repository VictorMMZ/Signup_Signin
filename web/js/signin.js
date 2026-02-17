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
                       tfEmail.innerHTML="";
                    tfPassword.innerHTML="";
                   
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

  
 
        const baseUrl = "/CRUDBankServerSide/webresources/customer/sigin/";
 
        const  newpath =baseUrl +
                    `${encodeURIComponent(valueTfEmail)}/${encodeURIComponent(valueTfPassword)}`;
             
             //signInForm.submit() ;
             
             
           fetch(newpath, 
                    {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/xml'
                        }
                    }).then(response => {
                        //Procesado de respuesta error 401
                        if (response.status===401){
                          return response.text().then(text => {
                            throw new Error('User not found!!');
                          });
                        }
                        else if (response.status===404){
                          return response.text().then(text => {
                            throw new Error('too many requests!!');
                          });
                        }
                        //Procesado de respuesta error 500
                        else if (response.status===500){
                          return response.text().then(text => {
                            throw new Error('Server Error. Please try later!!');
                          });
                        }
                        //Procesado de respuesta otro error
                        else if (!response.ok) {
                          return response.text().then(text => {
                            throw new Error(text || 'Unexpected error!!');
                          });
                        }
                      return response.text(); // <-- obtenemos el XML
                      })
                        //Procesado de respuesta OK 
                        .then(xmlText => {
    //en caso de que nos de el okey
                            
                            msgBox.className = 'success';
                            msgBox.style.display = 'block';
                            msgBox.style.color = '#ffffff';
                            msgBox.style.padding="10px";
                            msgBox.style.border="1px solid black";
                            msgBox.style.backgroundColor="lightgreen" ;
                            msgBox.style.borderRadius="10px";
                             storeResponseXMLData(xmlText);
                        //get customer object from storage
                            const customerName=sessionStorage.getItem("customer.firstName");
                        //create XML from customer's data stored
                            const customerXML=`<customer>
                                <city>${sessionStorage.getItem("customer.city")}</city>
                                <email>${sessionStorage.getItem("customer.email")}</email>
                                <firstName>${sessionStorage.getItem("customer.firstName")}</firstName>
                                <id>${sessionStorage.getItem("customer.id")}</id>
                                <lastName>${sessionStorage.getItem("customer.lastName")}</lastName>
                                <middleInitial>${sessionStorage.getItem("customer.middleInitial")}</middleInitial>
                                <password>${sessionStorage.getItem("customer.password")}</password>
                                <phone>${sessionStorage.getItem("customer.phone")}</phone>
                                <state>${sessionStorage.getItem("customer.state")}</state>
                                <street>${sessionStorage.getItem("customer.street")}</street>
                                <zip>${sessionStorage.getItem("customer.zip")}</zip>
                                </customer>`.trim();
                            msgBox.textContent = 'Customer signed in successfully!';
             
                              setTimeout(() => {
                                signInForm.submit() ;
                                 window.location.href = "../html/main.html"; }, 2000);
                            
                                      
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
            
             function storeResponseXMLData (xmlString){
                //Create XML parser
                const parser = new DOMParser();
                //Parse response XML data
                const xmlDoc=parser.parseFromString(xmlString,"application/xml");
                //Create Customer object with data received in response
                const customer=new Customer(
                    xmlDoc.getElementsByTagName("id")[0].textContent,
                    xmlDoc.getElementsByTagName("firstName")[0].textContent,
                    xmlDoc.getElementsByTagName("lastName")[0].textContent,
                    xmlDoc.getElementsByTagName("middleInitial")[0].textContent,
                    xmlDoc.getElementsByTagName("street")[0].textContent,
                    xmlDoc.getElementsByTagName("city")[0].textContent,
                    xmlDoc.getElementsByTagName("state")[0].textContent,
                    xmlDoc.getElementsByTagName("zip")[0].textContent,
                    xmlDoc.getElementsByTagName("phone")[0].textContent,
                    xmlDoc.getElementsByTagName("email")[0].textContent,
                    xmlDoc.getElementsByTagName("password")[0].textContent,
                );
                // Save data to sessionStorage
                sessionStorage.setItem("customer.id", customer.id);
                sessionStorage.setItem("customer.firstName", customer.firstName);
                sessionStorage.setItem("customer.lastName", customer.lastName);
                sessionStorage.setItem("customer.middleInitial", customer.middleInitial);
                sessionStorage.setItem("customer.street", customer.street);
                sessionStorage.setItem("customer.city", customer.city);
                sessionStorage.setItem("customer.state", customer.state);
                sessionStorage.setItem("customer.zip", customer.zip);
                sessionStorage.setItem("customer.phone", customer.phone);
                sessionStorage.setItem("customer.email", customer.email);
                sessionStorage.setItem("customer.password", customer.password);
                console.log("Customer's data for "+customer.id+" saved on session storage.");
            }
          
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('tfPassword');

togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

});
                  