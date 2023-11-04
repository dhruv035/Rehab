import crypto from "crypto"
import jwt from "jsonwebtoken";
export const getPasswordHash = function(password) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt,  1000, 64, 'sha512').toString('hex') 
    return { salt, hash }
  }

  export const verifyPassword = function(user, password) {
    console.log("USEER",password)
    var hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex') 
    console.log("HASH",hash)
    return user.hash === hash; 
  }
export const getToken = (payload) => {
  console.log("PAYLOAD",payload)
  const token = jwt.sign(payload, process.env.JWT_KEY,{expiresIn:60*60*8});
  return token;
};

export const verifyToken = (payload) => {
  try {
    const data = jwt.verify(payload, process.env.JWT_KEY);
    return { authorized: true, payload: data };
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return { authorized: false, message: err.message };
    }
    // otherwise, return a bad request error
    return { authorized: false, message: "bad request" };
  }
};

export const getAuthToken = function (request) {
  const header = request.headers["authorization"];
  if (!header) {
    console.log("missing auth header");
    return false;
  }
  const token = header.substring(7);
  return token;
};
