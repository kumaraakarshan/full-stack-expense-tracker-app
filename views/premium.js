const leaderboardElement = document.getElementById("leaderboard");

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await axios.get("/get-premium-leaderboard");
        const premiumUsers = response.data;

        leaderboardElement.innerHTML = ''; // Clear previous content

        premiumUsers.forEach((user, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `Name-${user.name}-Total Expense-${user.totalExpense}`;

            leaderboardElement.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching premium leaderboard:", error);
    }
});


// Add this JavaScript code in your frontend JavaScript file
document.getElementById('exportPdfButton').addEventListener('click', async () => {
   
    const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    const userId = decodedToken.userID; 
    
    try {
      const response = await axios.get(`/export-expenses-pdf/${userId}`, {
        responseType: 'blob', // Set the response type to blob for downloading files
      });
  
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_expenses.pdf';
      a.click();
    } catch (error) {
      console.error('Error exporting expenses as PDF:', error);
    }
  });
  
