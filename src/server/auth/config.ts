import axios from "axios";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "~/env";



declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      accountType: string;
      userEmail: string;
    } & DefaultSession["user"];
  }

  interface User {
    userEmail: string;
    accountType: string
  }
}

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email"
        },
        password: {
          label: "Password",
          type: "password"
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials"); 
        }
        const response = await axios.post<ApiResponseProps<LoginProps>>(`${env.API_URL}/account/login`, {
          email: credentials.email,
          password: credentials.password
        });
        return {
          id: response.data.data.user.id,
          userEmail: response.data.data.user.email,
          accountType: response.data.data.user.accountType,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.userEmail = user.userEmail;
        token.accountType = user.accountType;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        name: token.name,
        email: token.userEmail as string,
        userEmail: token.userEmail as string,
        accountType: token.accountType as string,
      },
    }),
  },
  pages: { signIn: '/' },
} satisfies NextAuthConfig;