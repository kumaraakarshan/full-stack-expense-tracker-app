// Event listener for the purchase button click
document.getElementById('purchase').addEventListener('click', async () => {
    try {
        // Replace this with your actual authentication token retrieval logic
        const token = localStorage.getItem("authToken");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(atob(tokenParts[1]));
    const user = decodedToken.userID; 
    console.log(user);
        // Make a POST request to update the premium status
        const response = await axios.post(`/update-premium-status/${user}`, null, {
            headers: headers
        });

        // Handle the response
        if (response.status === 200) {
            // Success! Proceed with handling the premium status update
            console.log('Premium status updated:', response.data);

            // Add your additional logic here after updating the premium status
        } else {
            // Handle the case when the response status is not OK
            console.log('Failed to update premium status');
        }
    } catch (err) {
        console.log(err);
    }
});

