export interface BookChapterType {
    bookId:string;
    chapterId:string; // backend generation so frontend optional
    chapterName:string;
    chapterDesc:string;
    createTime:number; // Date.now
    update:number;
}

export type UpsertChapterType = Pick<BookChapterType,"bookId"|"chapterName"|"chapterDesc">