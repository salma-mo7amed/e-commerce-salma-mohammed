import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";

// signup validation:
export const signupVal = joi.object({
 userName:generalFields.name.required(),
 email:generalFields.email.required(),
 password:generalFields.password.required(),
 rePassword:generalFields.rePassword,
 phone:joi.string()
})
// login validation
export const loginVal = joi.object({
  email: generalFields.email.when('phone',{
   is:joi.required(),
   then:joi.optional(),
   otherwise: joi.required(),
  }),
  password: generalFields.password,
  phone: joi.string(),
});