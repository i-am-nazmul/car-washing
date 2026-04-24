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
            default: null,
            unique: true,
            sparse: true,
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
      }
}, {
      timestamps: true,
});

userSchema.index({ email: 1 }, { unique: true });
const Users = mongoose.models.users || mongoose.model("users",userSchema);
export default Users;