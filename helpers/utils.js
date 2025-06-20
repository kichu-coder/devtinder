import validator from "validator"

export const validateUserData = (req) =>{

    const {firstName , lastName, emailId , password } = req.body

    if(!firstName || !lastName){
        throw Error("Please Enter First Name || Last Name")
    } else if(firstName.length < 4 || firstName.length > 15){
        throw Error("minimum length of first name is 4 and maxlength is 15")
    } else if(!validator.isEmail(emailId)){
        throw Error("Please Enter Valid email")
    } else if(!validator.isStrongPassword(password)){
        throw Error("Please Enter a Strong Password")
    }
}

export const validateEditRequest = (req) => {
    const editRequest = req.body;

    const editableFields = ["firstName", "lastName" , "age", "gender", "photoUrl", "about", "skills" ]

    const isValidRequest = Object.keys(editRequest).every((field) => editableFields.includes(field))

    return isValidRequest
}