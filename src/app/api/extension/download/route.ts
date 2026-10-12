
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
const ZIP_PATH = path.join(process.cwd(), 'extension-dist', 'dist.zip');
console.log('ZIP_PATH',ZIP_PATH)
export async function GET(req: NextRequest) {
    // const { searchParams } = new URL(req.url);
    // const token = searchParams.get('token');
    // const SECRET_TOKEN = process.env.EXTENSION_DOWNLOAD_TOKEN;

    // if (!SECRET_TOKEN || token !== SECRET_TOKEN) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    if (!fs.existsSync(ZIP_PATH)) {
        return NextResponse.json({ error: 'Build not ready' }, { status: 404 });
    }

    const stat = fs.statSync(ZIP_PATH);
    const stream = fs.createReadStream(ZIP_PATH);

    return new NextResponse(stream as any, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="extension.zip"',
            'Content-Length': stat.size.toString(),
        },
    });
}
