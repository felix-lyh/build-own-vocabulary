import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDbPool } from '@/lib/mongodb';
import {
    EMAIL_PATTERN,
    MIN_PASSWORD_LENGTH,
    getJwtSecret,
    signAuthToken,
    setAuthCookie,
    sanitizeUser,
    readCredentials,
} from '@/lib/auth';
import type { UserInfoType } from '@/type/user';

export async function POST(req: NextRequest) {
    try {
        if (!getJwtSecret()) {
            return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 });
        }

        const body = await req.json();
        const { email, password } = readCredentials(body);

        if (!EMAIL_PATTERN.test(email) || password.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 400 }
            );
        }

        const db = await getDbPool();
        const user = await db.users.findOne<UserInfoType>({ email });

        // Same response for unknown email and wrong password to avoid user enumeration
        if (!user || !(await bcrypt.compare(password, user.pwt))) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = signAuthToken(user);
        const response = NextResponse.json(
            { payload: { ...sanitizeUser(user), token }, message: 'Logged in successfully' },
            { status: 200 }
        );
        return setAuthCookie(response, token);
    } catch (error) {
        return NextResponse.json({ error: 'Unable to log in, please try again later' }, { status: 500 });
    }
}
