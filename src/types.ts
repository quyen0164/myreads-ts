export type Shelf="currentlyReading"|"wantToRead"|"read"|"none";

export interface Book{
    id: string;
    title: string;
    author?: string[];
    imageLinks?:{
        thumbnail:string;
    };
    shelf?:Shelf;
}