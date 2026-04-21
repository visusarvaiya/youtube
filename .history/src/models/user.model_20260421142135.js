import mongoose,{Schema} from "mongoose";
import jwt from"jsonwebtoken";//giving you an entry pass 🎫 after login, server creates jwt 
import bcrypt from "bcrypt";//locking your password in a safe 🔒
const userSchema = new Schema(
{
    username:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
        index:true // optimiszed searching

    },
    email:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
      
    },
     fullname:{
        type:String,
        required:true, 
        trim:true,
        index:true // optimiszed searching

    },
    avatar:{
        type:String,// cloudinary url
        required:true 
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Vedio"// export "Vedios"
    }],
    password:{
        type:String,
        required:[true , 'password is required ']
    },
    refreshToken:{
        type:String
    }
         
      
           
},
{
    Timestamps : true 
}
)
userSchema.pre("save",async function (next) {
        if(!this.isModified("password"))  return next();

        this.password =  await bcrypt.hash(this.password, 10 );
        next();
})
/*isModified("password") → only hash if password changed
bcrypt.hash() → converts password → hashed string
10 → salt rounds (security level)


userSchema.methods.isPasswordCorrect = async function (password){
 return await bcrypt.compare(password,this.password );
}  

export const User = mongoose.model("User",userSchema)  