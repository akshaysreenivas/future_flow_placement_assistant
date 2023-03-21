const mongoose=require('mongoose')

module.exports=async()=>{
      await  mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>console.log("DB CONNECTED")).catch((error)=> console.log("DB ERROR",error))
    
}

