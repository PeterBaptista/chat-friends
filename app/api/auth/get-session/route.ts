import axios from "axios";
import { Session } from "better-auth/types";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get<Session>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
      {
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
        headers: {
          // Get the cookie from the request

          origin: process.env.NEXT_PUBLIC_APP_URL,
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    return NextResponse.json(response?.data);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(null);
  }
}
