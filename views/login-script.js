document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginBtn");

    loginButton.addEventListener("click", function() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Send login request to the backend using Axios or fetch API
        axios.post("/api/login", { email, password })
            .then(response => {
               
            alert('login successfully');
                
                window.location.href = "/feature.html";
            })
            .catch(error => {
               
                console.error("Login failed:", error);
                
            });
    });
});
