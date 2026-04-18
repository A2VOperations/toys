import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export async function POST(request) {
  try {
    const { name, email, phone, address, pdfBase64 } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "PDF attachment is missing" },
        { status: 400 },
      );
    }

    // Configure nodemailer transporter using Mailtrap's official provider
    const transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN,
      }),
    );

    // Remove the data URI prefix if it exists to get just the base64 string
    const base64Data = pdfBase64.split("base64,")[1] || pdfBase64;

    const sender = {
      address: process.env.EMAIL_MAILTRAP,
      name: "Toys for Kids Checkout",
    };

    const mailOptions = {
      from: sender, // Must be the authorized sender for Mailtrap
      to: [process.env.EMAIL_TO || "operation.a2vgroups@gmail.com"], // The website owner
      replyTo: email, // The customer's email
      subject: `New Order from ${name}`,
      text: `You have received a new order.\n\nCustomer Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\n\nPlease find the PDF receipt attached.`,
      category: "Integration Test",
      attachments: [
        {
          filename: "order-receipt.pdf",
          content: base64Data,
          encoding: "base64",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Order processed and email sent.",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: "An error occurred during checkout processing.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
