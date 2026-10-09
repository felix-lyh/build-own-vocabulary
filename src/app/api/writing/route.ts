
import { getDbPool } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';
import type { WorkType, AddWorkType } from '@/type/writing'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const { page, limit } = Object.fromEntries(searchParams.entries());
    const options = { page, limit,sortBy:'1' }
    const query = {}
    try {
        const db = await getDbPool();
        const works = await paginate(db.works, options, query)
        return NextResponse.json(works);
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ error }, { status: 500 });
    }
}

// add a work
export async function POST(req: NextRequest) {
    try {
        const query = await req.json();
        const { workName, workDesc = '' } = query as AddWorkType;
        const createTime = Date.now();
        const insertData: WorkType = {
            workName,
            workDesc,
            workId: (new ObjectId).toString(),
            content: '',
            createTime,
            update: createTime
        }
        const db = await getDbPool();
        await db.works.insertOne(insertData)
        return NextResponse.json({ payload: insertData, message: 'work created successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}

// delete one or many works
export async function DELETE(req: NextRequest) {
    try {
        const query: { workId?: string; workIdList?: string[] } = await req.json();
        const { workId, workIdList } = query;
        const db = await getDbPool();
        if (!!workId) {
            await db.works.deleteOne({ workId })
        }
        if (!!workIdList) {
            await db.works.deleteMany({ workId: { $in: workIdList } });
        }
        return NextResponse.json({ message: 'works deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
