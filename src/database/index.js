import mongoose from "mongoose";

 const connectToDB = async () => {
  try {
    await mongoose.connect(
      // "mongodb://localhost:27017/jj"
     process.env.ATLASDB_URL
    );
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
