import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";

import prisma from "./prisma";
import { AuthOnboardEmail, resend } from "./emails";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        console.log("Sending magic link email to:", email);
        console.log("Magic link token:", token);
        console.log("Magic link URL:", url);
        // get user data if logging in and some request info
        const user = await prisma.user.findUnique({ where: { email } });
        const requestInfo = {
          ip: request?.headers.get("x-forwarded-for") || "unknown",
          userAgent: request?.headers.get("user-agent") || "unknown",
          referrer: request?.headers.get("referer") || "unknown",
        };

        const payload = {
          authType: user ? "login" : "signup",
          name: user ? user.name : null,
          email,
          token,
          url,
          requestInfo,
        };

        const subject =
          payload.authType === "login"
            ? "P8labs Auth - Login Magic Link"
            : "P8labs Auth - Signup Magic Link";

        const { data, error } = await resend.emails.send({
          from: "P8labs <auth@mails.p8labs.tech>",
          to: [email],
          subject: subject,
          react: AuthOnboardEmail(payload),
        });

        if (error) {
          console.error("Error sending magic link email:", error);
          throw new Error("Failed to send magic link email");
        }
      },
      expiresIn: 60 * 15, // 15 minutes
    }),
  ],
});
