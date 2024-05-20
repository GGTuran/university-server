import { Schema, model, connect } from 'mongoose';
import { Guardian, LocalGuardian, Student,    StudentInstanceModel,    StudentMethodsInstance,    UserName } from './student/student.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';
import config from '../config';
import { boolean } from 'joi';


const userNameSchema = new Schema<UserName>({
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      maxlength:[20,"First name can't be more than 20 characters"],
      trim:true,
      // validate:{
      //   validator:function(value : string){
      //     const firstNamestr = value.charAt(0).toUpperCase + value.slice(1);
      //     return firstNamestr === value;
      //   },
      //   message:'{VALUE} is not in capitalize form'
      // }
    },
    middleName: {
      type: String,
      trim:true
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      trim:true
    },
  });

const guardianSchema = new Schema<Guardian>({
    fatherName: {
      type: String,
      required: [true, 'Father name should be given'],
      maxlength:[20,"First name can't be more than 20 characters"],
      trim:true,

    },
    fatherOccupation: {
      type: String,
      required: [true, 'Occupation should be given'],
    },
    fatherContactNo: {
      type: String,
      required: [true, 'Contact number should be given'],
    },
    motherName: {
      type: String,
      required: [true, "Mother's name should be given "],
      trim:true
    },
    motherOccupation: {
      type: String,
      required: [true, 'Occupation should be given'],
    },
    motherContactNo: {
      type: String,
      required: [true, 'Contact number should be included'],
    },
  });

  const localGuardianSchema = new Schema<LocalGuardian>({
    name: {
      type: String,
      required: [ true ,  'Name is required'],
    },
    occupation: {
      type: String,
      required: [true , 'Occupation is required'],
    },
    contactNo: {
      type: String,
      required: [true, "Contact number should be given"],
    },
    address: {
      type: String,
      required: [true, "Address should be included"],
    },
  });

// const studentSchema = new Schema<Student, StudentInstanceModel, StudentMethodsInstance>({
//The line above is for custom instance method,we need to export those though

const studentSchema = new Schema<Student,StudentInstanceModel,StudentMethodsInstance>({
    id: { type: String , required:true, unique:true },
    password:{ type:String , required:[true,'Password is required']},
    name: {
      type:userNameSchema,
      required:[true, "User name must be given"],

    },
    gender:{
      type:String,
      enum: {
        values:["male","female"],
        message:"{VALUE} is not valid"
      },
      required:[true, "Should let us know the gender"]
    },
    dateOfBirth:{type: String},
    email:{
      type: String, 
      required: [true, 'email is undefined'],
      unique:true,
      validate:{
        validator: (value:string) => validator.isEmail(value),
        message:"{VALUE} is not a valid email address"
      }
      
    },
    contactNo:{ type: String, required: [true, "Contact number is invalid"]},
    emergencyContactNo:{ type: String, required: [true, "This number is invalid"]},
    bloodGroup:{
      type: String,
      enum:{
        values:['A+', 'A-', 'B+', 'B-' , 'AB+', 'AB-', 'O+', 'O-'],
        message:'{VALUE} is not valid'
      },
      
    },
    presentAddress:{ type: String, required: [true, "Address not found"]},
    permanentAddress:{ type: String, required:[ true , "Address not found"]},
    guardian:{
      type:guardianSchema,
      required:[true, "Guardian's data should be given"]
    },
    localGuardian:{
      type:localGuardianSchema,
      required:[true, "Local guardian's data should be given"]
    },
    profileImg: { type:String},
    isActive:{
      type:String,
      enum:{
        values:['active' ,'blocked'],
        message:"{VALUE} is not valid"
      },
      default: 'active',
    },
    isDeleted:{ 
      type:Boolean,
      default: false,
     },


},
{
  toJSON: {
    virtuals:true,
  }
},
);


//Virtual 
studentSchema.virtual('fullName').get(function(){
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}` 
})

//Using middlewares/hooks 

//pre save middleware/hook : works on create(),save()

studentSchema.pre('save', async function(next){
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
studentSchema.post('save', function(doc, next){
  console.log(doc, 'Post Hook: They saved the data');
  doc.password = '';
  next();
});

//Query middleware
studentSchema.pre('find', function(next){
  // console.log(this);
  this.find({ isDeleted: { $ne : true} });
  next()
});

studentSchema.pre('findOne', function(next){
  // console.log(this);
  this.find({ isDeleted: { $ne : true} });
  next()
});

//aggregate 
studentSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match : { isDeleted : { $ne : true}}});
  next();
});









//Creating custom static method
// studentSchema.statics.isUserExists = async function (id:string){
//   const existingUser = await StudentModel.findOne({id});
//   return existingUser;
// }







// creating custom instance method 
studentSchema.methods.isUserExists = async function (id: string){
  const existingUser = await StudentModel.findOne({ id });
  return existingUser;
}






export const StudentModel = model<Student, StudentInstanceModel>('Student', studentSchema);