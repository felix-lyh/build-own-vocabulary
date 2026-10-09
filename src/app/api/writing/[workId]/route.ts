
import { getDbPool } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import type { UpdateWorkType } from '@/type/writing'

type RouteContext = {
    params: Promise<{ workId: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        const { workId } = await params;
        if (!workId) {
            return NextResponse.json({ error: 'Missing workId parameter' }, { status: 400 });
        }
        const db = await getDbPool();
        const work = await db.works.findOne({ workId });
        return NextResponse.json({ payload: work, message: 'work found successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

// update name/desc/content
export async function PUT(req: NextRequest, { params }: RouteContext) {
    try {
        const { workId } = await params;
        if (!workId) {
            return NextResponse.json({ error: 'Invalid request there is no workId' }, { status: 400 });
        }
        const query: UpdateWorkType = await req.json();
        const db = await getDbPool();
        await db.works.updateOne({ workId }, { $set: { ...query, update: Date.now() } })
        return NextResponse.json({ payload: { ...query, workId }, message: 'work updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// delete a work
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
    try {
        const { workId } = await params;
        if (!workId) {
            return NextResponse.json({ error: 'Invalid request there is no workId' }, { status: 400 });
        }
        const db = await getDbPool();
        await db.works.deleteOne({ workId })
        return NextResponse.json({ message: 'work deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
