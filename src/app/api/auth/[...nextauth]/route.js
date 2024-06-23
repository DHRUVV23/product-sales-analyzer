import connectToDB from "@/database";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// const secret = process.env.NEXTAUTH_SECRET; 

async function createUserIfNotExists(name, email) {
  try {
    await connectToDB();
    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      const res = await fetch(`${process.env.API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Failed to create user. Status: ${res.status}, Response: ${errorText}`);
        throw new Error('Failed to create user');
      }

      const data = await res.json();

      if (data.success) {
        return true; // Sign in success
      } else {
        console.error("Failed to create user:", data.message);
        return false; // Return false to deny the sign-in
      }
    }

    return true; // User exists, proceed with sign-in
  } catch (error) {
    console.error("Error creating user:", error);
    return false; // Return false to deny the sign-in
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;
        return await createUserIfNotExists(name, email);
      }
      return true; // Allow sign-in for other providers
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // site: process.env.NEXTAUTH_URL, // Specify NEXTAUTH_URL here
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
