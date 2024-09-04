import schedule from'node-schedule'
import { Coupon, User } from "../../db/index.js";
import { status } from "./constant/role-identification.js";

export const cronedJob= ()=> {
    const job = schedule.scheduleJob("1 1 1 * * *", async () => {
      const users = await User.find({ status: status.PENDING, createdAt: { $lte: Date.now() - 30 * 24 * 60 * 60 * 1000 }}).lean();
      const usersIds = users.map((user) => user._id);
      await User.deleteMany({ _id: { $in: usersIds } });
    });
 schedule.scheduleJob("1 1 1 * * *", async () => {
          const coupons = await Coupon.find({
           createdAt: { $lte: Date.now() - 30 * 24 * 60 * 60 * 1000 } }).lean();
          const couponIds = coupons.map((coupon) => coupon._id);
          await Coupon.deleteMany({ _id: { $in: couponIds } });
        });
    schedule.scheduleJob("1 1 1 * * *", async() => {
        const users = await User.find({ status: status.DELETED, updatedAt: { $lte: Date.now() - 30 * 24 * 60 * 60 * 1000 }}).lean();
    });

}
