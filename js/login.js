/*
Esta parte del código maneja la lógica del inició de sesión. 
Verifica si esta logueado usando las cookies. 
Valida que los campos del forumario esten completos.
Compara con los datos de la "base".
Redirecciona al index principal.
 */

document.addEventListener("DOMContentLoaded", function () {
    //Verifica si hay una cookies activa, en caso que sí redirige al index (página principal). 
    if (document.cookie.split(';').some(cookie => cookie.trim().startsWith('user='))) {
        if (!window.location.pathname.endsWith("index.html")) {
            window.location.href = "index.html";
        }
        return;
    }

    //Toma la información de esos campos del formulario.
    const loginForm = document.getElementById("loginForm");
    const alertContainer = document.getElementById("alert-container");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

/* 
Este evento se usa para manejar el envió del formulario. 
*/
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        //Toma y limpia los valores de los campos. 
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        let isValid = true;
 
        //Elimina los posibles errores. 
        clearError(emailInput);
        clearError(passwordInput);

        //Validación del campo emial y contraseña atendiendo a ciertas condiciones. 
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError(emailInput, "Por favor, ingrese un email válido.");
            isValid = false;
        }

        if (password.length < 4) {
            setError(passwordInput, "La contraseña debe tener al menos 4 caracteres.");
            isValid = false;
        }
        //Se detiene el proceso y hay una alerta en caso que no sean validos los datos ingresados.
        if (!isValid) {
            showAlert("Por favor, corrija los errores en el formulario.", "danger");
            return;
        }
/*
Se verifica la existencia del usuario atendiendo al archivo json que funciona como "base de datos".
*/
        if (email && password) {
            fetch("testaccounts.json") //Accede a los datos guardados en el JSON.
                .then(response => response.json())
                .then(accounts => {
                    const user = accounts.find(
                        acc => acc.email === email && acc.password === password
                    );

                    //Si el usuario existe crea la cookies y redirige al index. 
                    if (user) {
                        document.cookie = `user=${encodeURIComponent(email)}; path=/; max-age=${7 * 24 * 60 * 60}`;
                        showAlert("Inicio de sesión exitoso. Redirigiendo...", "success");
                        setTimeout(() => (window.location.href = "index.html"), 1000);

                    //Si hay alguna falla muestra los errores. 
                    } else {
                        setError(emailInput, "Usuario o contraseña incorrectos.");
                        setError(passwordInput, "Usuario o contraseña incorrectos.");
                        showAlert("Usuario o contraseña incorrectos.", "danger");
                    }
                })
                //Si el error es al cargar los datos del json coloca esta alerta. 
                .catch((error) => {
                    console.log("Error al verificar usuario:", error);
                    showAlert("No se pudo verificar el usuario. Intente más tarde.", "danger");
                });
        } else {
            showAlert("Por favor, complete todos los campos.", "danger");
        }
    });

/*
Esta función atiende a la regulación de la validación de un campo aplicando clases de boostrap.
Marca el input como invalido mostrando en rojo ese elemento. 
Si el campo estaba marcado como válido, elimina la clase "is-valid".
*/
        function setError(input, message) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid"); 
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains("invalid-feedback")) {
            feedback = document.createElement("div");
            feedback.classList.add("invalid-feedback");
            input.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }

/*Esta función limpia los mensajes de error en la campo cuando el usuario lo modifica*/
    function clearError(input) {
        input.classList.remove("is-invalid");
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.textContent = "";
        }
    }

/*Muestra un mensaje en el formulario.
*/
    function showAlert(message, type) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
});
