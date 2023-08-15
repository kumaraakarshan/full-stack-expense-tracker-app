document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginBtn");

    loginButton.addEventListener("click", function() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Send login request to the backend using Axios 
        axios.post("/login", { email, password })
            .then(response => {
                console.log(response.data.status);
               // const { token } = respone
                //console.log("Token:", token);
                localStorage.setItem("authToken", response.data.token);

                const { user } = response.data;
                localStorage.setItem("userInfo", JSON.stringify(user));
                if (response.data.status === 200) {
                    alert('Login successfully');
                    window.location.href = "/feature.html";
                }
                else{
                    alert(response.data.message);
                }

            })
            .catch(error => {
               
                console.error("Login failed:", error);
                
            });
    });
});
