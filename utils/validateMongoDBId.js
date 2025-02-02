import mongoose from "mongoose";
 export const validateMongoDBID = async (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("this Id is not valid");
 }
 