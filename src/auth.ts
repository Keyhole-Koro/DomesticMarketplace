import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Internal ID",
            credentials: {
                name: { label: "Name", type: "text", placeholder: "Your Name" },
            },
            async authorize(credentials) {
                if (!credentials?.name) return null;
                const nameStr = credentials.name as string;

                let user = await prisma.user.findFirst({ where: { name: nameStr } });
                if (!user) {
                    const userCount = await prisma.user.count();
                    user = await prisma.user.create({
                        data: {
                            name: nameStr,
                            email: `${nameStr.replace(/\s+/g, '.').toLowerCase()}@internal.c0mpile.io`,
                            role: userCount === 0 ? "ADMIN" : "USER",
                        }
                    });
                }
                return user as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
    },
});
