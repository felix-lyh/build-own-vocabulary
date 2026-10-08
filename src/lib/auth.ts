import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { UserInfoType } from '@/type/user';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;
export const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function getJwtSecret(): string | null {
    return process.env.JWT_SECRET || null;
}

export function signAuthToken(user: Pick<UserInfoType, 'userId' | 'email'>): string {
    return jwt.sign(
        { userId: user.userId, email: user.email },
        getJwtSecret() as string,
        { expiresIn: '1y' }
    );
}

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: TOKEN_MAX_AGE_SECONDS,
    });
    return response;
}

export function sanitizeUser(user: UserInfoType) {
    return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        createTime: user.createTime,
    };
}

/** Accept both the project's `pwt` field and a conventional `password` field. */
export function readCredentials(body: unknown): { email: string; password: string; name: string } {
    const data = (body ?? {}) as Record<string, unknown>;
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    const rawPassword = typeof data.pwt === 'string' ? data.pwt
        : typeof data.password === 'string' ? data.password : '';
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    return { email, password: rawPassword, name };
}
