import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
      username : {
            type : String,
            required : [true,"Please enter a username !! "],
            trim: true,
            minlength: 2,
            maxlength: 40,

      },
      email : {
            type : String,
            required : [true,"Please enter an email !! "],
            unique: true,
            lowercase: true,
            trim: true,
            
      },
      password : {
            type : String ,
            default: null,
            
      },
      googleId: {
            type: String,
            default: undefined,
      },
      avatar: {
            type: String,
            default: null,
      },
      authProviders: {
            type: [String],
            default: [],
      },
      isEmailVerified: {
            type: Boolean,
            default: false,
      },
      role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
      },
      plan: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
      }
}, {
      timestamps: true,
});

userSchema.index(
      { googleId: 1 },
      {
            unique: true,
            sparse: true,
            partialFilterExpression: { googleId: { $type: "string" } },
      }
);

const Users = mongoose.models.users || mongoose.model("users",userSchema);
export default Users;