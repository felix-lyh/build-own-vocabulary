
import { getDbPool } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';
import type { BookType } from '@/type/vocabulary'
import type { BookChapterType } from '@/type/chapter'
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
        const db = await getDbPool();
        const vocabulary = await paginate(db.vocabulary, options, query)
        const response = NextResponse.json(vocabulary);
        return response;
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ error }, { status: 500 });
    }
}

// add a book
export async function POST(req: NextRequest) {
    try {
        const query = await req.json(); 
        const { bookName } = query as BookType;
        const createTime = Date.now();
        const insertData:BookType = {
            bookName, // the book name
            bookDesc:'',
            bookId:(new ObjectId).toString(),
            createTime:createTime, // Date.now
            update:createTime
        }
        const db = await getDbPool();
        await db.books.insertOne(insertData)
        const insertChapter:BookChapterType = {
            bookId:insertData.bookId,
            chapterName:'default', // the chapter name
            chapterDesc:'default chapter',
            chapterId:(new ObjectId).toString(),
            createTime:createTime, // Date.now
            update:createTime
        }
        await db.chapter.insertOne(insertChapter)
        return NextResponse.json({ payload:insertData, message: 'book created successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
// update a book
export async function PUT(req: NextRequest) {
    try {
        const query:BookType = await req.json(); // 解析 JSON 資料
        const { bookId } = query;
        const db = await getDbPool();
        if(!!bookId){
            await db.books.updateOne({bookId},{$set: query})
        }else{
            return NextResponse.json({ error: 'Invalid request there is no id' }, { status: 400 });
        }
        return NextResponse.json({ payload:query, message: 'vocabulary updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
// delete book
export async function DELETE(req: NextRequest) {
    try {
        const query:{bookId?:string;bookIdList?:string[]} = await req.json(); // 解析 JSON 資料
        const { bookId,bookIdList} = query;
        const db = await getDbPool();
        if(!!bookId){
            await db.books.deleteOne({bookId})
            await db.chapter.deleteMany({bookId})
            await db.vocabulary.deleteMany({bookId})
        }
        if(!!bookIdList){
            await db.books.deleteMany({ bookId: { $in: bookIdList }});
        }
        return NextResponse.json({ message: 'vocabulary delete successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}