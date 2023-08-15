

// Form Submission Logic

document.getElementById("submitBtn").addEventListener("click", function() {
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
   
    const formData = {
        amount: amount,
        description: description,
        category: category
        
    };
    
    const token = localStorage.getItem("authToken");
    
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1])); 
    console.log('*****************');
    console.log(decodedToken);
    console.log('*****************');
   
    formData.UserId = decodedToken.userID;
    axios.post('/add-expense', formData, { headers })
        .then(response => {
            alert(response.data.message); // Display the success message from the server
            fetchAndDisplayexpenses(); // Refresh the expense list after data is saved
        })
        .catch(error => {
            console.error('Error saving data: ', error);
        });

       
});


// expense Deletion Functionality
function deleteexpense(expenseId) {

    const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
    axios.delete(`/delete-expense/${expenseId}`, { headers })
    
        .then(res => {
            
            alert(res.data.message);
            fetchAndDisplayexpenses(); // Refresh the expense list after deletion
        })
        .catch(error => {
            console.error('Error deleting expense: ', error);
        });
       
    
       
}

// Fetch and Display expenses
function fetchAndDisplayexpenses() {
    const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    const user = decodedToken.userID; // Extract user ID from decoded token

    axios.get(`/expenses/${user}`, { headers }) // Use template literal to pass user ID
        .then(response => {
            const expenses = response.data;
            const expenseList = document.getElementById('items');
            
            if (!expenseList) {
                console.error('Error: expenseList element not found.');
                return;
            }
            
            expenseList.innerHTML = ''; 
            
            expenses.forEach(expense => {
                const listItem = document.createElement('li');
                listItem.textContent = `amount: ${expense.amount}, description: ${expense.description}, category: ${expense.category}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteexpense(expense.id));
                
                listItem.appendChild(deleteButton);
                expenseList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching expenses: ', error);
        });
}


// Call the fetchAndDisplayexpenses function when the page is fully loaded
window.addEventListener('load', fetchAndDisplayexpenses);
