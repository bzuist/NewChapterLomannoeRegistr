import { principal } from "./principal";

export interface User {
  principal: principal;
  username: string;
  bookshelfID: number;
  bookID: number;
  postID: number;
  //authorName: string;
  userID?: number; // теперь необязательное поле
  postcommentID?: number; // теперь необязательное поле
  id?: string;
}

export class User {
  principal: principal;
  username: string;
  bookshelfID: number;
  bookID: number;
  postID: number;
  //authorName: string;
  userID?: number; // теперь необязательное поле
  postcommentID?: number; // теперь необязательное поле

  constructor(data: any, usersMap: Map<number, string>) {
    this.userID = Number(data.id) || data.userID;
    this.postcommentID = data.postcommentID || null;
    //this.authorName = usersMap.get(data.userID) as string;
    this.username = data.username;
    this.principal = data.principal;
    this.bookshelfID = data.bookshelfID || null;
    this.bookID = data.bookID;
    this.postID = data.postID;
  }
}
