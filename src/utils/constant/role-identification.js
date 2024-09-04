export const roles = {
    ADMIN:"admin",
    CUSTOMER:"customer",
    SELLER:"seller"
}
Object.freeze(roles)

export const status = {
    PENDING:"pending",
    VERIFIED:"verified",
    BLOCKED:"blocked",
    UNAUTHORIZED:"unauthorized",
    DELETED:"deleted"
}
Object.freeze(status)

export const couponTypes = {
    FIXED_AMOUNT:"fixed_amount",
    PERCENTAGE:"percentage"
}
Object.freeze(couponTypes);
export const paymentMethods = {
  CASH: "cash",
  VISA: "visa",
};
Object.freeze(paymentMethods);

export const orderStatus = {
  PLACED: "placed",
  WAITPAYMENT: "waitPayment",
  SHIPPING: "shipping",
  DELIVERED:"delivered",
  CANCELLED:"cancelled",
  REFUNDED:"refunded",
  ONHOLD:"onHold"
};
Object.freeze(orderStatus);