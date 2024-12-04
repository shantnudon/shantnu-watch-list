import { connectToDatabase } from "../../../../lib/connect";
import User from "../../../../lib/model/user";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { db } = await connectToDatabase();
  const { email, password } = await request.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });
    console.log(user);
    return Response.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Registration failed" }, { status: 500 });
  }
}
