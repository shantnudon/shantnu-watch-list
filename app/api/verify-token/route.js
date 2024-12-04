import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();

    const token = body.token;

    if (!token) {
      return Response.json({ message: "Token not found" }, { status: 401 });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    return Response.json({ user: decodedUser }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Invalid token", error: error.message },
      { status: 401 }
    );
  }
}
