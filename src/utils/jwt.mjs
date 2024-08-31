import jwt from "jsonwebtoken";

function getJwtToken(req) {
    try{
        return req.get("Authorization").split(" ")[1];
    }catch(e) {
        return ""
    }
}

function validateJwtToken(token,secret){
    try{
        jwt.verify(token, secret); 
        return true;
    }catch(e) {
        return false
    }
}

function getJwtPayload(token) {
    return jwt.decode(token)
}

function signJwtToken(payload, secret) {
    return jwt.sign(payload, secret,{
        expiresIn: '4m',
      })
}

export {validateJwtToken, getJwtToken, getJwtPayload, signJwtToken}