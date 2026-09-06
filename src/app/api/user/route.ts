import { ObjectId } from 'mongodb'
import { getDbPool } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { UserInfoType, LoginParamsType } from '@/type/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(value: string | null, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
export async function GET(req: NextRequest) {
    try {
        if (!JWT_SECRET) {
            return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 });
        }

        const authorization = req.headers.get('authorization');
        const token = authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : null;

        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
        if (!decoded.userId) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        const db = await getDbPool();
        const payload = await db.users.findOne(
            { userId: decoded.userId }
        );

        if (!payload) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ payload });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Unable to load users' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {

    try {
        const query = await req.json();
        const { email, pwt } = query as LoginParamsType;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!normalizedEmail || typeof pwt !== 'string' || pwt.length < 8) {
            return NextResponse.json({ error: 'A valid email and password of at least 8 characters are required' }, { status: 400 });
        }
        if (!JWT_SECRET) {
            return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 });
        }

        const db = await getDbPool();
        const existingUser = await db.users.findOne({ email: normalizedEmail }, { projection: { _id: 1 } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(pwt, 10);
        const insertData: UserInfoType = {
            userId: (new ObjectId).toString(),
            name: normalizedEmail,
            email: normalizedEmail,
            pwt: hashedPassword,
            createTime: Date.now()
        }
        await db.users.insertOne(insertData)

        const token = jwt.sign(
            { userId: insertData.userId, email: insertData.email },
            JWT_SECRET,
            { expiresIn: '1y' }
        );
        const { pwt: _, ...safeUser } = insertData;
        return NextResponse.json({ payload: { ...safeUser, token }, message: 'userinfo saved successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Unable to create user' }, { status: 500 });
    }
}