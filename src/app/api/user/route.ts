
import db from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle'

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    try {
        const users = await paginate(db.users,{},query) //db.users.find().toArray()
        const response = NextResponse.json(users);
        return response;
    } catch (error) {
        return NextResponse.json({ error}, { status: 500 });
    }
}