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