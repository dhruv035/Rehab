export const getPurchases = async (accessToken) => {
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/purchase",{
      method:"GET",
      headers:{
          "Authorization":`Bearer ${accessToken}`
      }
    });
    return data;
  };
  
  export const addPurchase = async (accessToken,items) => {
    const date = new Date();
    const timestamp = date.getTime();
    console.log("Date",date.toLocaleDateString());
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/purchase",{
      method:"POST",
      headers:{
          "Authorization":`Bearer ${accessToken}`,
          "Content-Type":"application/json",
      },
      body:JSON.stringify({date:date.toLocaleDateString(),items:items})
    });
    return data;
  };
  
  export const getPurchase = async (accessToken,id)=>{
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/purchases/"+id,{
      method:"GET",
      headers:{
          "Authorization":`Bearer ${accessToken}`
      }
    });
    return data;
  }
  
  export const updatePurchase = async (accessToken,id,name,item)=>{
    const data = await fetch(process.env.NEXT_PUBLIC_API+"/purchases/"+id,{
      method:"PUT",
      headers:{
          "Authorization":`Bearer ${accessToken}`,
          "Content-Type":'application/json'
      },
      body:JSON.stringify({name:name,item:item})
    });
    return data;
  }