export interface Post {
  postId: number;
  userID: number;
  postdescription: string;
  title: string;
  postcommentID: number;
  authorname: string;
}


export class Post {
  postId: number;
  userID: number;
  postdescription: string;
  title: string;
  postcommentID: number;
  authorname: string;

  constructor(data: any, usersMap: Map<number, string>) {
    this.postId = data.postId;
    this.userID = data.userID;
    this.title = data.title;
    this.postcommentID = data.postcommentID;
    this.authorname = usersMap.get(data.userID) as string;
    this.postdescription = data.postdescription;

  }
}
