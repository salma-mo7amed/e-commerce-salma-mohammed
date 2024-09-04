// import modules:
import bcrypt from 'bcrypt';
// hashing password:
export const hashPassword = ({password =" ", saltRound =9})=> {
 return bcrypt.hashSync(password, saltRound)
}
// compaing password with the hashed one:
export const comparePassword = ({ password = " ", hashPassword = " " }) => {
  return bcrypt.compareSync(password, hashPassword);
};