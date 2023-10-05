

// Form Submission Logic

document.getElementById("submitBtn").addEventListener("click", function() {
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const token = localStorage.getItem("authToken");

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    
    const userId = decodedToken.userID; // Extract user ID from decoded token
    
    const formData = {
        amount: amount,
        description: description,
        category: category,
        userId:userId
    };
    
    axios.post('/add-expense', formData)
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

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    
    const userId = decodedToken.userID; // Extract user ID from decoded token
    
   
    axios.delete(`/delete-expense/${expenseId}`, { data: { userId } })
    
        .then(res => {
            
            alert('deleted successfully');
            fetchAndDisplayexpenses(); // Refresh the expense list after deletion
        })
        .catch(error => {
            console.error('Error deleting expense: ', error);
        });
       
    
       
}
const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
let currentPage = 1;
let expenses = [];
let totalPages;
const savedItemsPerPage = localStorage.getItem('itemsPerPage');
if (savedItemsPerPage) {
    itemsPerPageSelect.value = savedItemsPerPage;
}
itemsPerPageSelect.addEventListener('change', () => {
    const selectedItemsPerPage = itemsPerPageSelect.value;
    localStorage.setItem('itemsPerPage', selectedItemsPerPage);
    currentPage = 1; // Reset the current page when changing items per page
    fetchAndDisplayexpenses(currentPage);
});

// Fetch and Display expenses
function fetchAndDisplayexpenses(page) {
    const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    
    const userId = decodedToken.userID; // Extract user ID from decoded token


    const itemsPerPage = itemsPerPageSelect.value;
    axios.get(`/expenses/${userId}?page=${page}&limit=${itemsPerPage}`) // Use template literal to pass user ID
        .then(response => {
            
            expenses = response.data;
            console.log(expenses);
            const totalCount = +response.headers['x-total-count'];
             totalPages = Math.ceil(totalCount/ itemsPerPageSelect.value)

            const expenseList = document.getElementById('items');
           
            expenseList.innerHTML = ''; 
            

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;


            expenses.forEach(expense => {
                const listItem = document.createElement('li');
                listItem.textContent = `amount: ${expense.amount}, description: ${expense.description}, category: ${expense.category}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteexpense(expense._id));
                
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
    console.log(expenses.length);
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages }

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
    
      fetchAndDisplayexpenses(currentPage);
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    console.log('Next page clicked. Current page:', currentPage);
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
