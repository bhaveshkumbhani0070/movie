import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { signJwtToken } from "@/lib/jwt";
import bcrypt from 'bcrypt'
import pool from "@/lib/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                username: { label: 'Email', type: 'text', placeholder: 'John Doe' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials
                // await db.connect()
                const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
                const user = result.rows[0];

                if (!user) {
                    throw new Error("Invalid input")
                }

                const comparePass = await bcrypt.compare(password, user.password)

                if (!comparePass) {
                    throw new Error("Invalid input")
                } else {
                    const { password, ...currentUser } = user

                    const accessToken = signJwtToken(currentUser, { expiresIn: '6d' })

                    return {
                        ...currentUser,
                        accessToken
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.email = user.email
            }

            return token
        },
        async session({ session, token }) {
            console.log('token', token)
            if (token) {
                session.user.email = token.email
                session.user.accessToken = token.accessToken
            }

            return session
        }
    }
})

export { handler as GET, handler as POST }