const mongoose = require("mongoose")
const ApiError = require("../utils/ApiError")

const dbConnect = async ()=>{
    try {
        // process.env.DB_URL||
        const connection  = await mongoose.connect(process.env.DB_URL_local,{})

        if(!connection) throw new ApiError(500,"db connnection unsuccessful")

        console.log("db connection successful");

    } catch (error) {
        console.error("error occured : ",error?.message);

        process.exit(1)
    }
}

module.exports = {dbConnect}