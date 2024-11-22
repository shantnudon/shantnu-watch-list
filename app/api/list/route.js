import { connectToDatabase } from "../../../lib/connect";
import Post from "../../../lib/model/list";
import { verifyToken } from "../../../lib/middleware/authMiddleware";

let postsCache = null;
let cacheTimestamp = null;
const CACHE_EXPIRATION_TIME = 86400000; // 24 hours in milliseconds
// const CACHE_EXPIRATION_TIME = 1; // 24 hours in milliseconds

// cached get route that will revalidate after 24 hours to save on db calls
export async function GET() {
  const { db } = await connectToDatabase();
  try {
    const currentTime = Date.now();
    if (postsCache && currentTime - cacheTimestamp < CACHE_EXPIRATION_TIME) {
      console.log("Returning cached posts");
      return new Response(JSON.stringify(postsCache), { status: 200 });
    }

    const posts = await Post.find({});

    postsCache = posts;
    cacheTimestamp = currentTime;

    console.log("Returning posts from DB");
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to fetch posts" }), {
      status: 500,
    });
  }
}

// old get route that makes alot of db calls
// export async function GET() {
//   const { db } = await connectToDatabase();
//   try {
//     const posts = await Post.find({});
//     return Response.json(posts);
//   } catch (error) {
//     return Response.json({ message: "Failed to fetch posts" }, { status: 500 });
//   }
// }

export async function POST(request) {
  const { db } = await connectToDatabase();
  const user = verifyToken(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, type, status, imdbId, remarks } = await request.json();

    const myHeaders = new Headers();
    myHeaders.append("x-rapidapi-host", process.env.RAPIDAPI_HOST);
    myHeaders.append("x-rapidapi-key", process.env.RAPIDAPI_KEY);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const externalResponse = await fetch(
      `${process.env.RAPIDAPI_URL}${imdbId}`,
      requestOptions
    );
    const result = await externalResponse.json();
    // return new Response(JSON.stringify(result), { status: 200 });
    const newPost = await Post.create({
      title,
      type,
      status,
      imdbId,
      data: result,
      remarks,
    });
    return Response.json(newPost, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { db } = await connectToDatabase();
  const user = verifyToken(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const { _id, ...updateData } = data;

    const updatedPost = await Post.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    return Response.json(updatedPost);
  } catch (error) {
    return Response.json({ message: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { db } = await connectToDatabase();
  const user = verifyToken(request);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const { _id } = data;

    await Post.findByIdAndDelete(_id);
    return Response.json({ message: "Post deleted successfully" });
  } catch (error) {
    return Response.json({ message: "Failed to delete post" }, { status: 500 });
  }
}
