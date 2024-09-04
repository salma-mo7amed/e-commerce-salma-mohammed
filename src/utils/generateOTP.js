// function to use when I generate an OTP:
export const generatedOTP =  () => {
 return Math.floor(Math.random() * 900000 + 100000)
}