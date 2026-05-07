import { NextRequest, NextResponse } from "next/server";

type EnquiryPayload = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  project: string;
  message: string;
};

function validate(f: EnquiryPayload) {
  if (!f.firstname?.trim()) return "First name is required";
  if (!f.lastname?.trim()) return "Last name is required";
  if (!f.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    return "Valid email address is required";
  if (!f.phone?.trim()) return "Phone number is required";
  if (!f.message?.trim()) return "Message is required";
  return null;
}

export async function POST(req: NextRequest) {
  let body: EnquiryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const toEmail = process.env.ENQUIRY_TO_EMAIL ?? "enquiries@southproperty.com.au";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "South Property <noreply@southproperty.com.au>",
        to: [toEmail],
        subject: `New Enquiry from ${body.firstname} ${body.lastname}`,
        text: [
          `Name: ${body.firstname} ${body.lastname}`,
          `Email: ${body.email}`,
          `Phone: ${body.phone}`,
          `Project Interest: ${body.project || "Not specified"}`,
          ``,
          `Message:`,
          body.message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[Enquiry] Email send failed", await res.text());
      return NextResponse.json({ error: "Failed to send enquiry. Please try again." }, { status: 500 });
    }
  } else {
    // Development fallback — log to console until RESEND_API_KEY is configured
    console.log("[Enquiry received]", {
      name: `${body.firstname} ${body.lastname}`,
      email: body.email,
      phone: body.phone,
      project: body.project,
      message: body.message,
    });
  }

  return NextResponse.json({ success: true });
}
