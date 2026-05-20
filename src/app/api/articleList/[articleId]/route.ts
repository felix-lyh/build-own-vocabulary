import db from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import type { AreticleType,UpsertArticleItemType,UpsertAreticleType } from '@/type/article'

const collectionName = 'article'
const collection = db[collectionName]
export async function GET(_: NextRequest,{ params }: { params: Promise<{ articleId: string }>}) {
    try {
        const { articleId } = await params;
        
        const article = await collection.findOne({articleId});
        return NextResponse.json({payload:article, message: 'Article found successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const query = await req.json(); 
        const { articleId,content } = query as UpsertAreticleType;
        const createTime = Date.now();
        const insertData:UpsertAreticleType = {
            content,
            articleId,
            createTime:createTime, // Date.now
            update:createTime
        }     
        await collection.updateOne({articleId},{$set:insertData})
        return NextResponse.json({ payload:insertData, message: 'ArticleItem saved successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const query:AreticleType = await req.json(); // 解析 JSON 資料
        const { articleId,content } = query;
        if(!!articleId){
            await collection.updateOne({articleId},{$set: {content,update:Date.now()}})
        }else{
            return NextResponse.json({ error: 'Invalid request there is no id' }, { status: 400 });
        }
        return NextResponse.json({payload:query, message: 'vocabulary updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
// delete 
export async function DELETE(req: NextRequest) {
    try {
        const query:{articleId?:string} = await req.json(); // 解析 JSON 資料
        const { articleId } = query;
        if(!!articleId){
            await collection.deleteOne({articleId})
        }
        return NextResponse.json({ message: 'vocabulary delete successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}