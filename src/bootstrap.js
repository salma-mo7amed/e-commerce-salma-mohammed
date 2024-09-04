// import module
import { connectDB } from "../db/connection.js";
import * as allRouters from './index.js'
import { globalError } from "./utils/globalError.js";



// create bootstrap function:

export const bootstrap = (app, express) => {
  // app usage:
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  // connect to db:
  connectDB();
  const port = process.env.PORT || 3000;
  // app routes:
  app.use("/categories", allRouters.categoryRouter);
  app.use("/sub-categories", allRouters.subCategoryRouter);
  app.use("/brands", allRouters.brandRouter);
  app.use("/products", allRouters.productRouter);
  app.use("/auth", allRouters.authRouter);
  app.use("/users", allRouters.userRouter);
  app.use('/admin', allRouters.adminRouter);
  app.use('/wishlist', allRouters.wishlistRouter);
  app.use('/review', allRouters.reviewRouter);
  app.use('/coupon', allRouters.couponRouter);
  app.use('/cart', allRouters.cartRouter)
  app.use('/orders', allRouters.orderRouter)



  // use global error:
  app.use(globalError);
  // listen to app:
  app.listen(port, () => {
    console.log("server is running on port", port);
  });
};
