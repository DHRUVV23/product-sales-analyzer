import connectToDB from "@/database";
import User from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;

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
          console.error("Error during sign in:", error);
          return false; 
        }
      }

      return true; 
    },
  },
  pages: {
    signIn: '/auth/signin',  
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
