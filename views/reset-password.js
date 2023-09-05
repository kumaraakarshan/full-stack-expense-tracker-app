document.getElementById('button').addEventListener('click',async()=>{
    let pas = document.getElementById('password').value;
    let id = '';
    let currentPath = window.location.pathname;
    console.log(currentPath);
    let count = 0;
    for(let i = 0;i<currentPath.length;i++){
        if(count >= 3){
            id+= currentPath[i];
        }
        if(currentPath[i] === '/'){
            count++
        }
    }
    console.log(id);
    let res = await axios.post(`http://localhost:3000/password/resetpassword/${id}`,{
        password: pas
    })
    console.log(res);
    if(res.data === 'success'){
        alert('password reset complete');
    }
});