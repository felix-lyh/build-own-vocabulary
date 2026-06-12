import { ObjectId } from 'mongodb'
import { getDbPool } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle'
import { UserInfoType, LoginParamsType } from '@/type/user';
// import config from '@/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    try {
        const db = await getDbPool();
        const users = await paginate(db.users, {}, query) //db.users.find().toArray()
        const response = NextResponse.json(users);
        return response;
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {

    try {
        const query = await req.json(); // 解析 JSON 資料
        const { email, pwt } = query as LoginParamsType;
        const createTime = Date.now();

        const hashedPassword = await bcrypt.hash(pwt, 10);
        const insertData: UserInfoType = {
            userId: (new ObjectId).toString(),
            name: email,
            email: email,
            pwt: hashedPassword,
            createTime: createTime
        }
        const db = await getDbPool();
        await db.users.insertOne(insertData)
        const token = jwt.sign(
            { userId: insertData.userId, email: insertData.email },
            JWT_SECRET,
            { expiresIn: '1y' }
        );
        return NextResponse.json({ payload: {...insertData,token}, message: 'userinfo saved successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}