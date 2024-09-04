// function to get all the repeated messages:
const generateMessages = (entity) => ({
  notFound: `${entity} not found`,
  alreadyExist: `${entity} already exist`,
  failToCreate: `fail to create ${entity}`,
  failToUpdate: `fail to update ${entity}`,
  createdSuccessfully: `${entity} created successfully`,
  updatedSuccessfully: `${entity} updated successfully`,
  deletedSuccessfully: `${entity} deleted successfully`,
  removedSuccessfully: `${entity} removed successfully`,
  clearedSuccessfully: `${entity} cleared successfully`,
  cancelledSuccessfully: `${entity} cancelled successfully`,
});
export const messages = {
  category: generateMessages("category"),
  subcategory: generateMessages("subcategory"),
  brand: generateMessages("brand"),
  product: generateMessages("product"),
  wishlist: generateMessages("wishlist"),
  review: generateMessages("review"),
  coupon: generateMessages("coupon"),
  cart: generateMessages("cart"),
  order: generateMessages("order"),
  user: {
    ...generateMessages("user"),
    verifiedAccount: "Account verified successfully",
  },
  password: {
    ...generateMessages("password"),
    invalidCredential: "Invalid Credential",
  },
};