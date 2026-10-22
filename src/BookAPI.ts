import {Book, Shelf} from "./types";

const api="https://reactnd-books-api.udacity.com";

let token=localStorage.token;
if(!token){
    token=localStorage.token=crypto.randomUUID().replace(/-/g, '').slice(0, 8);
}

const headers: HeadersInit={
    Accept: "application/json",
    Authorization: token,
};
export const getAll=async(): Promise<Book[]>=>{
    const res=await fetch(`${api}/books`,{headers});
    const data=await res.json();
    return data.books;
};
export const update= async (book: Book, shelf:Shelf): Promise<any>=>{
    const res=await fetch(`${api}/books/${book.id}`,{
        method:"PUT",
        headers: {...headers,"Content-Type":"application/json"},
        body:JSON.stringify({shelf}),
    });
    return res.json();
};
export const search =async(query: string, maxResults=20): Promise<Book[]>=>{
    const res= await fetch(`${api}/search`,{
        method: "POST",
        headers:{...headers,"Content-Type":"application/json"},
        body: JSON.stringify({query,maxResults}),
    });
    const data=await res.json();
    return data.error ?[]:data.books;
};