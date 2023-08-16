

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
            alert('expense added successfully'); // Display the success message from the server
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
            
            alert('deleted successfully');
            fetchAndDisplayexpenses(); // Refresh the expense list after deletion
        })
        .catch(error => {
            console.error('Error deleting expense: ', error);
        });
       
    
       
}
const itemsPerPage = 2; // Set the number of items per page
let currentPage = 1;
// Fetch and Display expenses
function fetchAndDisplayexpenses(page) {
    const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    
    const user = decodedToken.userID; // Extract user ID from decoded token
    console.log(decodedToken);
    

    const userInfo=localStorage.getItem('userInfo');
    const userinfoParts = userInfo.split(',');
    userPremium=userinfoParts[4];
    console.log(userPremium);
    userPremiumstatus=userPremium.split(':');
    console.log(userPremiumstatus[1]);


   
    axios.get(`/expenses/${user}`, { headers }) // Use template literal to pass user ID
        .then(response => {
            const expenses = response.data;
            const expenseList = document.getElementById('items');
            
            if (!expenseList) {
                console.error('Error: expenseList element not found.');
                return;
            }
            
            expenseList.innerHTML = ''; 
            
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;


            expenses.slice(startIndex, endIndex).forEach(expense => {
                const listItem = document.createElement('li');
                listItem.textContent = `amount: ${expense.amount}, description: ${expense.description}, category: ${expense.category}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteexpense(expense.id));
                
                listItem.appendChild(deleteButton);
                expenseList.appendChild(listItem);
            });

            updatePaginationButtons();
        })
        .catch(error => {
            console.error('Error fetching expenses: ', error);
        });
}

function updatePaginationButtons() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
  
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = false; // Enable the next button, as we're loading data dynamically
  }

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayexpenses(currentPage);
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    fetchAndDisplayexpenses(currentPage);
  });

const premiumStatusElement = document.getElementById("premiumStatus");
const buyPremiumButton = document.getElementById("buyPremiumBtn");



// Assuming you have an HTML element with the ID "premiumStatus"


document.addEventListener("DOMContentLoaded", async function() {
    try {
        const token = localStorage.getItem("authToken");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };

        const tokenParts = token.split('.');
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        const user = decodedToken.userID;

        const response = await axios.get(`/get-premium-status/${user}`, { headers });
        const isPremiumUser = response.data.premium;

        if (isPremiumUser) {
            premiumStatusElement.textContent = "You are a premium user!";
            buyPremiumButton.style.display = "none";
            const premiumButton = document.createElement("button");
            premiumButton.textContent = "Go to Premium Page";
            
            premiumButton.addEventListener("click", function() {
                window.location.href = "premium.html"; // Redirect to the premium page
            });
            premiumButtonContainer.appendChild(premiumButton);
        } else {
            premiumStatusElement.textContent = "You are not a premium user.";
        }
    } catch (error) {
        console.error("Error fetching premium status:", error);
    }
});



document.getElementById("buyPremiumBtn").addEventListener("click", function() {
    const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };




    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    const user = decodedToken.userID; 

  
    
    const userInfo=localStorage.getItem('userInfo');
    const userinfoParts = userInfo.split(',');
    const userPremium=userinfoParts[4];
    console.log(userPremium);
    const userPremiumstatus=userPremium.split(':');
    console.log(userPremiumstatus[1]);



    
    // Fetch user details from the server or local storage
    // ...

    // Set up the payment options


 
    const options = {
        key: "rzp_test_EMujkV0DxmzTFB",
        amount: 1000, // Amount in paise (INR 10)
        currency: "INR",
        name: "Premium Subscription",
        description: "Unlock premium features",
       
        handler: function(response) {
            const paymentId = response.razorpay_payment_id;
        console.log('----------------------------');
            console.log(paymentId);
            // Send the payment ID and user ID to your server for verification and storage
            axios.post(`/update/${user}`, { paymentId }, { headers })
                .then(response => {
                    alert("Payment successful! Premium status updated and payment ID stored.");
                    localStorage.setItem(userPremiumstatus[1],true)
                    
                    updateUIForPremiumUser()
                })
                .catch(error => {
                    console.error("Payment verification error: ", error);
                    alert("Payment successful, but an error occurred while updating premium status.");
                });


                  
        },
        
    };
    
   
    // Open the Razorpay payment window
    const rzp = new Razorpay(options);
    rzp.open();
});


// Call the fetchAndDisplayexpenses function when the page is fully loaded
window.addEventListener('load', fetchAndDisplayexpenses(currentPage));
