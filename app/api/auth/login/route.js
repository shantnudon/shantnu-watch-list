import { connectToDatabase } from "../../../../lib/connect";
import User from "../../../../lib/model/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { db } = await connectToDatabase();
  const { email, password } = await request.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return Response.json({ token, user: { email: user.email, id: user._id } });
  } catch (error) {
    return Response.json({ message: "Login failed" }, { status: 500 });
  }
}
