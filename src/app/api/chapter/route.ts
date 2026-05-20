import db from '@/lib/mongodb';
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';
import type { BookChapterType } from '@/type/chapter'

// const collectionName = 'chapter'
// const db.chapter = db[collectionName]
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    // console.log('searchParams',searchParams)
    const { page,limit,bookId } = Object.fromEntries(searchParams.entries());
    const options = { page,limit }
    const query = { bookId }
    try {
        const vocabulary = await paginate(db.chapter,options,query)
        const response = NextResponse.json(vocabulary);
        return response;
    } catch (error) {
        console.log('error',error)
        return NextResponse.json({ error }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const query = await req.json(); 
        const { bookId,chapterName,chapterDesc='' } = query as BookChapterType;
        const createTime = Date.now();
        const insertData:BookChapterType = {
            bookId,
            chapterName, // the chapter name
            chapterDesc,
            chapterId:(new ObjectId).toString(),
            createTime:createTime, // Date.now
            update:createTime
        }
        await db.chapter.insertOne(insertData)
        return NextResponse.json({ payload:insertData, message: 'chapter saved successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const query:BookChapterType = await req.json(); // 解析 JSON 資料
        const { bookId,chapterId } = query;
        if(!!chapterId){
            await db.chapter.updateOne({bookId,chapterId},{$set: {...query,update:Date.now()}})
        }else{
            return NextResponse.json({ error: 'Invalid request there is no id' }, { status: 400 });
        }
        return NextResponse.json({payload:query, message: 'vocabulary updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
// delete chapter
export async function DELETE(req: NextRequest) {
    try {
        const query:{chapterId?:string;chapterIdList?:string[]} = await req.json(); // 解析 JSON 資料
        const { chapterId,chapterIdList} = query;
        if(!!chapterId){
            await db.chapter.deleteOne({chapterId})
            await db.vocabulary.deleteMany({chapterId})
        }
        if(!!chapterIdList){
            await db.chapter.deleteMany({ id: { $in: chapterIdList }});
            await db.vocabulary.deleteMany({ id: { $in: chapterIdList }});
        }
        return NextResponse.json({ message: 'vocabulary delete successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error,message: 'Invalid request' }, { status: 400 });
    }
}