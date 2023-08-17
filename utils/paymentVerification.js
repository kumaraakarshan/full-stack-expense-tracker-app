const axios = require('axios');

async function verifyPaymentWithGateway(paymentId) {
    const apiKey = process.env.RAZORPAY_API_KEY;
    const apiSecret = process.env.RAZORPAY_API_SECRET;
    const authString = `${apiKey}:${apiSecret}`;
    const base64Auth = Buffer.from(authString).toString('base64');

    try {
        const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Basic ${base64Auth}`
            }
        });

        const paymentData = response.data;
        console.log(paymentData);
        if (paymentData.status === 'authorized') {
            console.log('Payment successfully verified with Razorpay.');
            return true;
            
        } else {

            console.log('Payment verification failed.');
            // Handle failed payment verification
            return false;
        }
    } catch (error) {
        console.error('Error verifying payment with Razorpay:', error);
        // Handle the error
    }
}

module.exports = verifyPaymentWithGateway;
