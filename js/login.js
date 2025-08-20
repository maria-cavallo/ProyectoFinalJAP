document.addEventListener("DOMContentLoaded", function () {
    if (document.cookie.split(';').some(cookie => cookie.trim().startsWith('user'))) {
        if (!window.location.pathname.endsWith("index.html")) {
            window.location.href = "index.html";
        }
        return;
    }

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email && password) {
            fetch("testaccounts.json")
                .then(response => response.json())
                .then(accounts => {
                    const user = accounts.find(
                        acc => acc.email === email && acc.password === password
                    );
                    if (user) {
                        document.cookie = `user${encodeURIComponent(email)}; path=/; max-age=${7 * 24 * 60 * 60}`;
                        window.location.href = "index.html";
                    } else {
                        alert("Usuario o contraseña incorrectos.");
                    }
                })
                .catch((error) => {
                    console.log("Error al verificar usuario:", error);
                    alert("No se pudo verificar el usuario. Intente más tarde.");
                });
        } else {
            alert("Por favor, complete todos los campos.");
        }
    });
});
