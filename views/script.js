

document.getElementById("submitBtn").addEventListener("click", function() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
 
  const formData = {
      name: name,
      email: email,
      phone: phone,
      password:password
      
  };



  axios.post('/api/signup', formData)
      .then(response => {
       

          alert(response.data.message); // Display the success message from the server
          
      })
      .catch(error => {
          
          console.error('Error saving data: ', error);
          alert('this user is already registered \n'+error); // Display the failure message from the server
      });

     
});

