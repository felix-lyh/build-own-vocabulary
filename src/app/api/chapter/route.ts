import db from '@/lib/mongodb';
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';
import type { BookChapterType } from '@/type/chapter'

const collectionName = 'chapter'
const collection = db[collectionName]
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    // console.log('searchParams',searchParams)
    const { page,limit } = Object.fromEntries(searchParams.entries());
    const options = { page,limit }
    const query = {  }
    try {
        const vocabulary = await paginate(collection,options,query)
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
        await collection.insertOne(insertData)
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
            await collection.updateOne({bookId,chapterId},{$set: {...query,update:Date.now()}})
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
        const query:{id?:string;idList?:string[]} = await req.json(); // 解析 JSON 資料
        const { id,idList} = query;
        if(!!id){
            await collection.deleteOne({id})
        }
        if(!!idList){
            await collection.deleteMany({ id: { $in: idList }});
        }
        return NextResponse.json({ message: 'vocabulary delete successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}