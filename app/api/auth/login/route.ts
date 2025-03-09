import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import admin from "firebase-admin";
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const adminAuth = admin.auth();

export async function POST(req: NextRequest) {
    console.log("req", req);
  try {
    const { token } = await req.json();

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Set a secure session cookie
    (await
          // Set a secure session cookie
          cookies()).set("session", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/",
    });

    return NextResponse.json({ success: true, uid: decodedToken.uid });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
}
