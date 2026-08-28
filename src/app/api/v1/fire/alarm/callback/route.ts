

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;


// add a book
export async function POST(req: NextRequest) {
    try {
        const query = await req.json(); 
        console.log('query', query);
        return NextResponse.json({ message: 'I get fire alarm' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
