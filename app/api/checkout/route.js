import { NextResponse } from "next/server";
import { MailtrapClient } from "mailtrap";

const MAILTRAP_TOKEN =
  process.env.MAILTRAP_TOKEN || "accee842d565d8e6f4978dabaff49cbd";

export async function POST(request) {
  try {
    const { name, email, phone, address, pdfBase64, cartItemsText } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "PDF attachment is missing" },
        { status: 400 },
      );
    }

    if (!MAILTRAP_TOKEN) {
      throw new Error("MAILTRAP_TOKEN is not configured.");
    }

    // Remove the data URI prefix if it exists to get just the base64 string
    const base64Data = pdfBase64.split("base64,")[1] || pdfBase64;

    const sender = {
      email: process.env.EMAIL_MAILTRAP || "hello@demomailtrap.co",
      name: "Toys for Kids Checkout",
    };

    const recipientEmail =
      process.env.NEXT_PUBLIC_EMAIL_TO || "toysforkidsdelhi@gmail.com";

    const client = new MailtrapClient({
      token: MAILTRAP_TOKEN,
    });

    const mailOptions = {
      from: sender, // Must be the authorized sender for Mailtrap
      to: [{ email: recipientEmail }], // The website owner
      headers: {
        "Reply-To": email,
      },
      subject: `New Order from ${name}`,
      text: `You have received a new order.\n\nCustomer Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\n\nOrder Details:\n${cartItemsText || "N/A"}\n\nPlease find the PDF receipt attached.`,
      category: "Integration Test",
      attachments: [
        {
          filename: "order-receipt.pdf",
          content: base64Data,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await client.send(mailOptions);

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
