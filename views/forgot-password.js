document.getElementById('button').addEventListener('click',async()=>{
    let email = document.getElementById('email').value;
    try{
        let res = await axios.post('http://localhost:3000/password/forgotpassword',{
            email: email
           
        })

            console.log(res);
        if(res.data === 'success'){
            alert('Reset link sent to your verified email');
        }
        else{
            alert('email not found');
            console.log(res);
        }

    }catch(err){
        console.log(err);
    };
});