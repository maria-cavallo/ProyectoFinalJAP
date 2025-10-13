document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profile-form");
    const alertContainer = document.getElementById("alert-container");
    const profilePic = document.getElementById("profile-pic");
    const uploadInput = document.getElementById("upload-pic");
    const changeBtn = document.getElementById("change-pic-btn");
    const removeBtn = document.getElementById("remove-pic-btn");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    const user = localStorage.getItem("user") || decodeURIComponent(getCookie("user") || "");
    if (user) email.value = user;

    if (sessionStorage.getItem("profilePic")) {
        const savedPic = sessionStorage.getItem("profilePic");
        profilePic.src = savedPic;
    }

    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
        firstName.value = savedProfile.firstName || "";
        lastName.value = savedProfile.lastName || "";
        phone.value = savedProfile.phone || "";
    }

    changeBtn.addEventListener("click", () => uploadInput.click());

    uploadInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgData = event.target.result;
                profilePic.src = imgData;
                sessionStorage.setItem("profilePic", imgData);
                showAlert("Foto de perfil actualizada.", "success");
            };
            reader.readAsDataURL(file);
        }
    });

    removeBtn.addEventListener("click", () => {
        profilePic.src = "img/img_perfil.png";
        uploadInput.value = "";
        sessionStorage.removeItem("profilePic");
        showAlert("Foto de perfil eliminada.", "info");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;
        if (firstName.value.trim().length < 3) {
            setError(firstName, "El nombre debe tener al menos 3 caracteres.");
            isValid = false;
        } else {
            clearError(firstName);
        }

        if (lastName.value.trim().length < 3) {
            setError(lastName, "El apellido debe tener al menos 3 caracteres.");
            isValid = false;
        } else {
            clearError(lastName);
        }

        const phonePattern = /^[0-9]+$/;
        if (!phonePattern.test(phone.value.trim()) || phone.value.trim().length < 7) {
            setError(phone, "El teléfono debe contener solo números y tener al menos 7 dígitos.");
            isValid = false;
        } else {
            clearError(phone);
        }

        if (!isValid) {
            showAlert("Por favor, corrija los campos marcados en rojo.", "danger");
            return;
        }

        const profileData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            phone: phone.value.trim(),
        };
        localStorage.setItem("profileData", JSON.stringify(profileData));
        showAlert("Perfil guardado con éxito!", "success");
    });

    function setError(input, message) {
        input.classList.add("is-invalid");
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