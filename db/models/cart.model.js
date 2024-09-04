// import modules:
import { Schema, model } from "mongoose";
// schema:
const cartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'User', 
        required: true
    },
    products:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref: 'Product',
           
        },
        quantity:{
         type: Number
        }
    }],
 
}, { timestamps: true, versionKey: false });
// model
export const Cart = model("Cart", cartSchema);
