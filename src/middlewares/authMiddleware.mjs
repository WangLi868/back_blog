import {validateJwtToken, getJwtToken, getJwtPayload} from "../utils/jwt.mjs";
import dotenv from "dotenv";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;



function checkAuthMiddleware(roles){

    return (req, res, next)=> {
      const accessToken= getJwtToken(req)
      if(accessToken){
        const { role } =getJwtPayload(accessToken);
        
        if(roles.includes(role)){
          if(validateJwtToken(accessToken, accessTokenSecret)){    
              return next();
          }
        }
      }
      res.status(403).json({message: "Access denied."})
    }
}

export default checkAuthMiddleware;