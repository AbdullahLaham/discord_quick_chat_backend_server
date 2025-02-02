import mongoose from "mongoose"

export const dbConnect = () => {
    try {
        const conn = mongoose.connect('mongodb+srv://abed26194:7xjIolFbIxPSfp9w@cluster0.igta0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Database Connected Successully");
    } catch (error) {
        console.log("Database Error");
    } 
}
