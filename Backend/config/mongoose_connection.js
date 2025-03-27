import mongoose from "mongoose";
import config from "config";
import dbgr from "debug";

mongoose.connect(`${config.get("MONGODB_URI")}/LINKCLOWN`)
.then(function(){
    dbgr("connected");
})
.catch((err)=>{
    dbgr(err.message);
})
export default mongoose.connection;