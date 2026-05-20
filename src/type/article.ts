export interface ArticleItemType {
    articleName: string; 
    articleDesc: string; 
    articleId: string;
    createTime: number; // Date.now
    update: number;
}

export type UpsertArticleItemType = {
  articleName: string;
  articleDesc: string;
  articleId?: string;
}

export interface AreticleType {
    content:string;
    articleName: string; 
    articleDesc: string; 
    articleId: string;
    createTime?: number; // Date.now
    update?: number;
}

export type UpsertAreticleType = Omit<AreticleType,"articleName"|"articleDesc">


export interface NoteType {
    articleId: string;
    noteId:string;
    note:string;
    createTime:number;
    update:number;
}
export type UpsertNoteType = Pick<NoteType,"note">