document.addEventListener("DOMContentLoaded", function () {
    if (document.cookie.split(';').some(cookie => cookie.trim().startsWith('user='))) {
        if (!window.location.pathname.endsWith("index.html")) {
            window.location.href = "index.html";
        }
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const alertContainer = document.getElementById("alert-container");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        let isValid = true;

        clearError(emailInput);
        clearError(passwordInput);

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError(emailInput, "Por favor, ingrese un email válido.");
            isValid = false;
        }

        if (password.length < 4) {
            setError(passwordInput, "La contraseña debe tener al menos 4 caracteres.");
            isValid = false;
        }

        if (!isValid) {
            showAlert("Por favor, corrija los errores en el formulario.", "danger");
            return;
        }

        if (email && password) {
            fetch("testaccounts.json")
                .then(response => response.json())
                .then(accounts => {
                    const user = accounts.find(
                        acc => acc.email === email && acc.password === password
                    );
                    if (user) {
                        document.cookie = `user=${encodeURIComponent(email)}; path=/; max-age=${7 * 24 * 60 * 60}`;
                        showAlert("Inicio de sesión exitoso. Redirigiendo...", "success");
                        setTimeout(() => (window.location.href = "index.html"), 1000);
                    } else {
                        setError(emailInput, "Usuario o contraseña incorrectos.");
                        setError(passwordInput, "Usuario o contraseña incorrectos.");
                        showAlert("Usuario o contraseña incorrectos.", "danger");
                    }
                })
                .catch((error) => {
                    console.log("Error al verificar usuario:", error);
                    showAlert("No se pudo verificar el usuario. Intente más tarde.", "danger");
                });
        } else {
            showAlert("Por favor, complete todos los campos.", "danger");
        }
    });

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

    function clearError(input) {
        input.classList.remove("is-invalid");
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.textContent = "";
        }
    }

    function showAlert(message, type) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
});
