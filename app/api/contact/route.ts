import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// HTML Email Template Function
function createEmailHTML(name: string, email: string, subject: string, message: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">New Contact Form Submission</h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 30px;">
                <!-- From -->
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 5px 0; font-weight: 600; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">FROM</p>
                  <p style="margin: 5px 0; color: #333333; font-size: 16px;">${name}</p>
                </div>

                <!-- Email -->
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 5px 0; font-weight: 600; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">EMAIL</p>
                  <p style="margin: 5px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 16px;">${email}</a></p>
                </div>

                <!-- Subject -->
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 5px 0; font-weight: 600; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">SUBJECT</p>
                  <p style="margin: 5px 0; color: #333333; font-size: 16px;">${subject}</p>
                </div>

                <!-- Message -->
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 5px 0; font-weight: 600; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">MESSAGE</p>
                  <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; border-radius: 4px; margin-top: 10px;">
                    <p style="margin: 0; color: #333333; font-size: 16px; white-space: pre-wrap;">${message}</p>
                  </div>
                </div>

                <!-- Reply Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Reply to ${name}</a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; font-size: 12px; color: #666666;">This email was sent from your portfolio website contact form.</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #999999;">Sent on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the site administrator.' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // You'll update this with your verified domain
      to: ['palv499@gmail.com'], // Your email
      replyTo: validatedData.email, // Sender's email for easy reply
      subject: `Portfolio Contact: ${validatedData.subject}`,
      html: createEmailHTML(
        validatedData.name,
        validatedData.email,
        validatedData.subject,
        validatedData.message
      ),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully!', data },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
