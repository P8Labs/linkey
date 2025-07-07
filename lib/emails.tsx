import * as React from "react";
import { Resend } from "resend";
import { Html, Button } from "@react-email/components";
export const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateProps {
  authType: "login" | "signup" | string;
  name: string | null;
  email: string;
  token: string;
  url: string;
  requestInfo: {
    ip: string;
    userAgent: string;
    referrer: string;
  };
}

export function AuthOnboardEmail({
  authType,
  email,
  name,
  requestInfo,
  token,
}: EmailTemplateProps) {
  const host = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const url = `${host}/auth/verify?token=${token}`;
  return (
    <Html lang="en">
      <head>
        <title>
          {`P8labs Auth - ${authType === "login" ? "Login" : "Signup"} Magic Link`}
        </title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <h1>
          P8labs Auth - {authType === "login" ? "Login" : "Signup"} Magic Link
        </h1>
        <p>Hello {name || email},</p>
        <p>
          You have requested a {authType} to your P8labs account. Please click
          the button below to proceed:
        </p>
        <Button
          href={url}
          style={{
            backgroundColor: "#007bff",
            color: "#ffffff",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Click here to {authType}
        </Button>
        <p>If you did not request this, please ignore this email.</p>
        <p>Request Info:</p>
        <ul>
          <li>IP Address: {requestInfo.ip}</li>
          <li>User Agent: {requestInfo.userAgent}</li>
        </ul>
        <p>Thank you!</p>
      </body>
    </Html>
  );
}
