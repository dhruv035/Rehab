export const loginUser = async (username,password)=>{
    if(!username||!password) return;
    
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({username,password})
    })
    return data;
}

export const createUser = async(username,password)=>{
    if(!username||!password) return;
    
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/create",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({username,password})
    })
    return data;
}
export const verifyToken = async (accessToken)=>{
    
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/verify",{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${accessToken}`
        },
    })
    return data;
}