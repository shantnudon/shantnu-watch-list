import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Check if model exists before creating
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;