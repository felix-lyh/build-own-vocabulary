export interface VocabularyDataType {
    bookId:string;
    chapterId:string;
    id: string;
    SourceWeb: string; // the vocabulary from which website
    vocabulary:string; // word or phrase
    translations:string; 
    definitions?: string[]; // multiple definitions of the word
    examples:string;
    createTime:number; // Date.now
    update:number;
    reviewTime:number; // The first follow-up occurs after a one-day interval, subsequent follow-ups occur at two-day intervals,and the data is deleted on the 30th day.
    XPath:string // the location of the word on the source web page, used for later review and preview
}

export type AddVocaType = Pick<VocabularyDataType, "vocabulary" | "translations" | "definitions" | "examples" | "bookId" | "chapterId">

export interface BookType {
    bookName:string; // the vocabulary belong to which file
    bookDesc:string; // the description of the vocabulary book
    bookId:string;
    createTime:number; // Date.now
    update:number;
}

export interface AddBookType {
    bookName:string;
    bookDesc?:string;
}