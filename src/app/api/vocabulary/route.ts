import db from '@/lib/mongodb';
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';
import type { VocabularyDataType } from '@/type/vocabulary'
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    // console.log('searchParams',searchParams)
    const { bookId, chapterId, page, limit, SourceWeb, sort = 'createTime', sortBy = '-1' } = Object.fromEntries(searchParams.entries());
    const options = { page, limit, sort, sortBy }
    const query = { bookId, chapterId, SourceWeb }
    Object.keys(query).forEach((item) => {
        const key = item as keyof typeof query
        if (!query[key]) {
            delete query[key]
        }
    })
    try {
        const vocabulary = await paginate(db.vocabulary, options, query)
        const response = NextResponse.json(vocabulary);
        return response;
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ error }, { status: 500 });
    }
}

// add a word
export async function POST(req: NextRequest) {
    try {
        const query = await req.json(); // 解析 JSON 資料
        const { bookId, chapterId, vocabulary, translations, examples, SourceWeb = '', XPath } = query as VocabularyDataType;
        const createTime = Date.now();
        // const reviewTime = Date.now();
        const insertData: VocabularyDataType = {
            bookId,
            chapterId,
            id: (new ObjectId).toString(),
            vocabulary,
            translations,
            examples,
            createTime,
            update: createTime,
            reviewTime: createTime,
            SourceWeb,
            XPath
        }
        await db.vocabulary.insertOne(insertData)
        return NextResponse.json({ payload: insertData, message: 'vocabulary saved successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
// update a word
export async function PUT(req: NextRequest) {
    try {
        const query: VocabularyDataType = await req.json(); // 解析 JSON 資料
        const { id } = query;
        if (!!id) {
            await db.vocabulary.updateOne({ id }, { $set: {...query,update: Date.now()} })
        } else {
            return NextResponse.json({ error: 'Invalid request there is no id' }, { status: 400 });
        }
        return NextResponse.json({ payload:query, message: 'vocabulary updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
    }
}
// delete vocabulary
export async function DELETE(req: NextRequest) {
    try {
        const query: { id?: string; idList?: string[] } = await req.json(); // 解析 JSON 資料
        const { id, idList } = query;
        if (!!id) {
            await db.vocabulary.deleteOne({ id })
        }
        if (!!idList) {
            await db.vocabulary.deleteMany({ id: { $in: idList } });
        }
        return NextResponse.json({ message: 'vocabulary delete successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}