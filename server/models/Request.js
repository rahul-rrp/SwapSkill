const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
    {
        senderId:{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:"User",
        },
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        offeredSkills: {
            type: [String],
            required: true
          },
          requestedSkills: {
            type: [String],
            required: true
          },
        response:{
            type:String,
            enum:["pending","accepted","completed","declined"],
            default:"pending",
        },
    },
    { timestamps: true });

    module.exports=mongoose.model("request",RequestSchema);