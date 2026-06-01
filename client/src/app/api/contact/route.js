export const runtime = "edge";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedMessage = message?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.TO_EMAIL) {
      return NextResponse.json(
        { error: "Feedback email is not configured" },
        { status: 500 },
      );
    }

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.TO_EMAIL,
      subject: `New website feedback from ${trimmedName}`,
      replyTo: trimmedEmail,
      text: trimmedMessage,
      html: `
        <h2>New Website Feedback</h2>
        <p><strong>From:</strong> ${trimmedName} (${trimmedEmail})</p>
        <p><strong>Message:</strong></p>
        <p>${trimmedMessage.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Feedback sent successfully",
    });
  } catch (error) {
    console.error("Full error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send" },
      { status: 500 },
    );
  }
}
