import mongoose from "mongoose"

const {Schema} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUserId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    status : {
        type : String,
        enum : {
            values : ["ignore","interested","accepted","rejected"],
            message : `{VALUE} is not valid`
        }
    }
}, {
    timestamps : true
})

connectionRequestSchema.pre('save', function(next) {
  const connectionRequest = this;

  if((connectionRequest.fromUserId).equals(connectionRequest.toUserId)){
    throw new Error("Cannot send a connection request to yourself")
  }
  next();
});

export const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);