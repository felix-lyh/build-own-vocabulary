export const dynamic = 'force-dynamic';
import db from '@/lib/mongodb';
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { paginate } from '@/lib/dbhandle';
import type { ArticleItemType,UpsertArticleItemType } from '@/type/article'

// const collectionName = 'articleList'
// const db.articleList = db[collectionName]
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const { page,limit } = Object.fromEntries(searchParams.entries());
    const options = { page,limit }
    const query = {  }
    try {
        const articleList = await paginate(db.articleList,options,query)
        const response = NextResponse.json(articleList);
        return response;
    } catch (error) {
        console.log('error',error)
        return NextResponse.json({ error }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const query = await req.json(); 
        const { articleName,articleDesc='' } = query as UpsertArticleItemType;
        const createTime = Date.now();
        const insertData:ArticleItemType = {
            articleName,
            articleDesc,
            articleId:(new ObjectId).toString(),
            createTime:createTime, // Date.now
            update:createTime
        }     
        await db.articleList.insertOne(insertData)
        await db.article.insertOne(insertData)
        return NextResponse.json({ payload:insertData, message: 'ArticleItem saved successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const query:UpsertArticleItemType = await req.json(); // 解析 JSON 資料
        const { articleId,articleName,articleDesc } = query;
        if(!!articleId){
            await db.articleList.updateOne({articleId},{$set: {articleName,articleDesc,update:Date.now()}})
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
        const query:{id?:string;idList?:string[]} = await req.json(); // 解析 JSON 資料
        const { id,idList} = query;
        if(!!id){
            await db.articleList.deleteOne({id})
        }
        if(!!idList){
            await db.articleList.deleteMany({ id: { $in: idList }});
        }
        return NextResponse.json({ message: 'vocabulary delete successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}