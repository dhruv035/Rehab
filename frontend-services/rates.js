export const getRates = async (accessToken) => {
  console.log("TOKEN",accessToken)
  const data = await fetch(process.env.NEXT_PUBLIC_API + "/rates", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const updateRate = async (accessToken, name, price,newName) => {
  const data = await fetch(process.env.NEXT_PUBLIC_API + "/rates", {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, price: price,newName:newName }),
  });
  return data;
};

export const addItems = async (accessToken,items)=>{
  const data = await fetch( process.env.NEXT_PUBLIC_API+"/rates",{
    method:"POST",
    headers:{
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({items:items})
  })
  return data;
}