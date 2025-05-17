export class Fanfic {
  id: number;
  name: string;
  userID: number;
  description: string;
  text: string;
  genreID: number[];
  fanficcommentID: number;
  authorLogin: string;

constructor(data: any, usersMap: Map<number, string>) {
  this.id = data.id;
  this.name = data.name;
  this.userID = data.userID || data.author;
  this.description = data.description;
  this.text = data.text;
  this.genreID = data.genreID || [];
  this.fanficcommentID = data.fanficcommentID || null;
  this.authorLogin = usersMap.get(data.userID) as string;
}}
export interface Fanfic {
  id: number;
  name: string;
  userID: number;
  description: string;
  text: string;
  genreID: number[];
  fanficcommentID: number;
  authorLogin: string;
}
