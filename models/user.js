import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 15
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Please Enter a Valid Email")
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value) {
             if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter a Strong Pawword of minimim length 8 , aleast 1 lowercase , 1 uppercase , 1 number and 1 speacial character")
            }  
        }
    },
    age : {
        type : Number,
        min : 10,
        max : 50
    },
    gender : {
        type : String,
        // enum : ["Male" , "Female"]
        validate(value) {
            if(!["Male" , "Female", "Others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        } 
    },
    photoUrl : {
        type : String,
        default : "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
        validate(value) {
             if(!validator.isURL(value)){
                throw new Error("Please Enter a Valid photo url")
            }  
        }
    },
    about : {
        type : String,
        default : "This is a default value for the user"
    },
    skills : {
        type : [String]
    },
}, {
        timestamps : true
    });

export const User =  mongoose.model("User" , userSchema);