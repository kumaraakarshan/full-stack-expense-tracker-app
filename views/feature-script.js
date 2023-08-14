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

    axios.post('/api/save-data', formData)
        .then(response => {
            alert(response.data.message); // Display the success message from the server
            fetchAndDisplayexpenses(); // Refresh the expense list after data is saved
        })
        .catch(error => {
            console.error('Error saving data: ', error);
        });

       
});


// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);
// function drawChart() {
//     var data = google.visualization.arrayToDataTable([
//         ['Task', 'Hours per Day'],
//         ['salary',     11],
//         ['food',      2],
//         ['fuel',  2],
//         ['electricity', 2],
//         ['rent',    7],
//       ]);
    
//     var options = {
//         title: '',
//         pieHole: 0.4,
//       };
    
//     var chart = new google.visualization.PieChart(document.getElementById('myChart'));
//       chart.draw(data, options);
//     }

// expense Deletion Functionality
function deleteexpense(expenseId) {
    axios.delete(`/api/delete-expense/${expenseId}`)
    
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
    axios.get('/api/get-expenses')
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
