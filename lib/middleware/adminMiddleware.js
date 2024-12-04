import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export function middleware(req) {
  const token = Cookies.get("token"); // This will check the cookie in the client-side browser

  // If no token is found, redirect to the homepage
  if (!token) {
    console.log("No token found");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verify the token with your JWT_SECRET
    const newJwt = jwt.verify(token, process.env.JWT_SECRET);
    console.log(newJwt);
    return NextResponse.next(); // Proceed to the requested page
  } catch (err) {
    // If JWT is invalid or expired, redirect to the homepage
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Define the routes where the middleware should be applied
export const config = {
  matcher: ["/dashboard", "/stats"], // This applies the middleware to the "/dashboard" and "/stats" routes
};
