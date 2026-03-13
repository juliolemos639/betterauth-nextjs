import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { sendVerificationEmail } from "./send-verification-email";
import { twoFactor } from "better-auth/plugins";
import { sendOtpEmail } from "./send-otp-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    //...other options
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    rateLimit: {
        enabled: true,
        window: 10,
        max: 2,
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({
                to: user.email,
                verificationUrl: url,
                userName: user.name,
            });
        },
    },


    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account", // Optional, forces account selection on each login
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            prompt: "select_account", // Optional, forces account selection on each login
        },
    },

    plugins: [nextCookies(),
    twoFactor({
        skipVerificationOnEnable: true,
        otpOptions: {
            async sendOTP({ user, otp }) {
                // sendOtpEmail({ to: "atiqullah.naemi21@gmail.com", otp });
                sendOtpEmail({ to: user.email, otp });
            },
        },
    }),
    ],
}
);