```js
// Middleware to parse JSON bodies
app.use(express.json()); 
// If this line is not used, we will not be able to access the request body, and it will be undefined

// MongoDB connection
export async function connectDb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/devtinder', {
    serverSelectionTimeoutMS: 3000
  });
}
// This function connects to the MongoDB server. 
// serverSelectionTimeoutMS is the maximum time (in milliseconds) the backend will wait while trying to connect to the MongoDB server. 
// If the server is not found within that time, an error will be thrown. 
// Without this option, MongoDB uses the default timeout of 30 seconds before throwing the error.

// Middleware explanation
// A middleware is like any other route handler function.
// If a response is sent inside the middleware, it will not go to the next function.
// If no response is sent and `next()` is not called, the request hangs and eventually results in a server timeout.

app.get("/dummy", (req, res, next) => {
  console.log("first function");
  // next()
}, (req, res) => {
  console.log("second function");
  res.send("Inside second function");
});

// If we use `next()` in the first function, the compiler will go to the next function, and the second function will be executed.
// That's how middleware chaining works.

app.get("/dummy", (req, res, next) => {
  console.log("first function");
  next();
}, (req, res) => {
  console.log("second function");
  res.send("Inside second function");
});

// We need to start the server only after the database connection is established.
// Otherwise, the server might listen to incoming requests, but since the DB isn't connected, it will throw errors.

connectDb()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.log(`Database connection cannot be established: ${err}`);
  });

// Mongoose Schema
// A schema is like a blueprint for a database table, where we define the structure and rules for each field:
// - type: defines the data type
// - required: whether the field is mandatory
// - minLength, maxLength: for strings
// - unique: ensures all values are unique in that field
// - trim: removes whitespace
// - min, max: for numbers
// - enum: restricts the value to a specific set
// - default: sets a default value
// - validate: custom validation logic (throws an error if invalid)
// - timestamps: automatically adds createdAt and updatedAt fields

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 15
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please Enter a Valid Email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Please Enter a Strong Password of minimum length 8, with at least 1 lowercase, 1 uppercase, 1 number, and 1 special character");
      }
    }
  },
  age: {
    type: Number,
    min: 10,
    max: 50
  },
  gender: {
    type: String,
    validate(value) {
      if (!["Male", "Female", "Others"].includes(value)) {
        throw new Error("Gender is not valid");
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Please Enter a Valid photo URL");
      }
    }
  },
  about: {
    type: String,
    default: "This is a default value for the user"
  },
  skills: {
    type: [String]
  }
}, {
  timestamps: true
});

// we can use validator package to validate different values like email, photoUrl , password ( if it is a strong password or not) etc

// in this fucntion where we find based on id 
User.findByIdAndDelete(userId); 
//we can pass the id directly or use 
User.findByIdAndDelete({_id : userId});

// in findByIdAndUpdate we can pass options like new : true  which will provide the updated object as ouput instead of old one 
// runValidators: true will run the validate function from the schema for update methods or else  validator fucntions will only run for post create method
const user = await User.findByIdAndUpdate({ _id: userId }, data, {
  new: true,
  runValidators: true,
});

//if a hacker got access to your cookies and token in your cookies it is called cookie hijacking as the hacker can access all the apis with that token

// mostly for all e-commerce websites like facebook, instagram or amazon or any marketing websites like gmail once we login the token will never be expired we will be logged in state until either we refresh the browser and clear the cache and storage or logout from the website. for websites like jaroda (stcok trading) the token expires in 1d. In banking websites we need to login for every 15 to 20 mins. Banking websites don't even have the concept of tokens they just create a session and once the session expires the user is logged out.


// we can add methods to schema and use them
// here we access the user data using this and it should be in normal function not an arrow function
userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({ _id : user._id  }, 'kishorelovesneelima' ,{expiresIn : "1d"})

    return token
}
// we can access the method like below
const user = await User.findOne({ emailId: emailId });
const token = await user.getJWT();

//we can use enum data type to keep only limited possible values for a column
 enum : {
            values : ["ignore","interested","accepted","rejected"],
            message : `{VALUE} is not valid`
        }

// we can use pre save function to execute code before save 
connectionRequestSchema.pre('save', function(next) {
  const connectionRequest = this;

  if((connectionRequest.fromUserId).equals(connectionRequest.toUserId)){
    throw new Error("Cannot send a connection request to yourself")
  }
  next();
});

//for columns we use more in search we can index them 
firstName : {
        type : String,
        required : true,
        index : true,
        minLength : 4,
        maxLength : 15
}

// we can also use compound indexes if we are use we will two or more columns together to search data in most cases
userSchema.index({firstName : 1 , lastName : 1})

// we can use ref and populate to link to tables and get data instead of join
 fromUserId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
  const connectionRequests = await connectionRequestModel.find({toUserId : loggedInUser._id, 
      status : "interested"
    }).populate(
      "fromUserId",
      USER_SAFE_DATA
    );





