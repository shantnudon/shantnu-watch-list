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
    imdbId: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
