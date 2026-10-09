
import { getDbPool } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';

// list vocabulary of one book (or all books when no bookId query param)
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const { bookId, chapterId, page, limit, sort = 'createTime', sortBy = '-1' } = Object.fromEntries(searchParams.entries());
    const options = { page, limit, sort, sortBy }
    const query = { bookId, chapterId }
    Object.keys(query).forEach((item) => {
        const key = item as keyof typeof query
        if (!query[key]) {
            delete query[key]
        }
    })
    try {
        const db = await getDbPool();
        const vocabulary = await paginate(db.vocabulary, options, query)
        return NextResponse.json(vocabulary);
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ error }, { status: 500 });
    }
}
