import { ObjectId } from 'mongodb';
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
        const { email, password, name } = readCredentials(body);

        if (!EMAIL_PATTERN.test(email)) {
            return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json(
                { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
                { status: 400 }
            );
        }

        const db = await getDbPool();
        const existingUser = await db.users.findOne({ email }, { projection: { _id: 1 } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user: UserInfoType = {
            userId: new ObjectId().toString(),
            name: name || email,
            email,
            pwt: hashedPassword,
            createTime: Date.now(),
        };
        await db.users.insertOne(user);

        const token = signAuthToken(user);
        const response = NextResponse.json(
            { payload: { ...sanitizeUser(user), token }, message: 'Registered successfully' },
            { status: 201 }
        );
        return setAuthCookie(response, token);
    } catch (error) {
        return NextResponse.json({ error: 'Unable to register, please try again later' }, { status: 500 });
    }
}
