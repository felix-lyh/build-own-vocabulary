export interface BookChapterType {
    bookId:string;
    chapterId:string; // backend generation so frontend optional
    chapterName:string;
    chapterDesc:string;
    createTime:number; // Date.now
    update:number;
}

export type AddChapterType = Pick<BookChapterType,"bookId"|"chapterName"|"chapterDesc">

export type UpdateChapterType = Omit<BookChapterType,"createTime"|"update">