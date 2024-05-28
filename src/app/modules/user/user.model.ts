import {  Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
    {
      id: {
        type: String,
        required: true,
        // unique:true,
      },
      password: {
        type: String,
        required: true,
      },
      needsPasswordChange: {
        type: Boolean,
        default: true,
      },
      role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
      },
      status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress',
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  );


  userSchema.pre('save', async function(next){
    // console.log(this, 'Pre Hook: They are gonna save the data');
    
    const user = this;
    //hashing the password before saving
    user.password = await bcrypt.hash(
      user.password, 
      Number(config.bcrypt_salt_rounds),
    );
    next();
  
  });
  
  //Post save middleware/Hook 
  userSchema.post('save', function(doc, next){
    console.log(doc, 'Post Hook: They saved the data');
    doc.password = '';
    next();
  });

  
  export const User = model<TUser>('User',userSchema);