document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginBtn");

    loginButton.addEventListener("click", function() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Send login request to the backend using Axios or fetch API
        axios.post("/api/login", { email, password })
        .then(response => {
          const token = response.data.token; // Assuming the token is part of the response
          localStorage.setItem('token', token); // Store the token in localStorage
      
          alert('Login successful');
          window.location.href = "/feature.html";
        })
        .catch(error => {
          console.error("Login failed:", error);
        });
      
    });
});
