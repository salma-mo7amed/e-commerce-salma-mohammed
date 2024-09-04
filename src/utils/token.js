// import modules:
// import path from 'path'
// import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

// function to generate the user token:
// dotenv.config({path:path.resolve('../../config/.env')})
export const generateToken = ({payload= {}, secretKey = process.env.SECRET_KEY, expiresIn = '1h'})=> {
 return jwt.sign(payload, secretKey, {expiresIn})
}
export const verifyToken = ({ token, secretKey = process.env.SECRET_KEY }) => {
  return jwt.verify(token, secretKey);
};