import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fanfic } from '../models/fanfics';
import { Genre } from '../models/genre';
import { User } from '../models/user';
import { Bookshelf } from '../models/bookshelf';
import { PostComment } from '../models/postcomment';
import { BookComment } from '../models/bookcomment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseServiceService {

  private apiUrl = 'http://localhost:3000';
  private fanficsUrl = `${this.apiUrl}/fanfics`;
  private fanficUrl = `${this.apiUrl}/fanfic`;
  private genresUrl = `${this.apiUrl}/genres`;
  private genreUrl = `${this.apiUrl}/genre`;
  private userUrl = `${this.apiUrl}/users`;
  private postsUrl = `${this.apiUrl}/posts`;
  private blogsUrl = `${this.apiUrl}/blogs`;
  private postUrl = `${this.apiUrl}/post`;
  private bookCommentsUrl = `${this.apiUrl}/bookcomments`;
  private postCommentsUrl = `${this.apiUrl}/postcomments`;

  constructor(private http: HttpClient) {}

  getAllFanfics(): Observable<Fanfic[]> {
    return this.http.get<Fanfic[]>(this.fanficsUrl);
  }

  getFanficById(id: number): Observable<Fanfic> {
    return this.http.get<Fanfic>(`${this.fanficUrl}/${id}`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${id}`);
  }

  addNewFanfic(fanfic: Fanfic): Observable<Fanfic> {
    return this.http.post<Fanfic>(this.fanficUrl, fanfic);
  }

  changeFanfic(fanfic: Fanfic): Observable<Fanfic> {
    return this.http.put<Fanfic>(`${this.fanficUrl}/${fanfic.id}`, fanfic);
  }

  deleteFanfic(id: number): Observable<any> {
    return this.http.delete(`${this.fanficUrl}/${id}`);
  }

  getFanficsByUserId(userID: number): Observable<Fanfic[]> {
    return this.http.get<Fanfic[]>(`${this.fanficUrl}?userId=${userID}`)
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  getUserPosts(userID: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsUrl}?userId=${userID}`);
  }

  getUserFanfics(userID: number): Observable<Fanfic[]> {
  return this.http.get<Fanfic[]>(`${this.fanficUrl}`).pipe(
    map(fanfics => fanfics.filter(f => f.userID === userID))
  );
}


  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.genresUrl);
  }

  getGenreById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.genreUrl}/${id}`);
  }

  getPrincipal(): Observable<User> {
    return this.http.get<User>(this.userUrl);
  }


getBookComments(bookID: number): Observable<BookComment[]> {
  return this.http.get<BookComment[]>(`${this.bookCommentsUrl}?bookID=${bookID}`);
}



addBookComment(bookID: number, userID: number, bookcomment: string): Observable<BookComment> {
  return this.http.post<BookComment>(`${this.apiUrl}/bookcomments`, {
    bookID,
    userID,
    bookcomment
  });
}

  updateBookComment(bookcommentID: number, newComment: string): Observable<any> {
  return this.http.put(`${this.bookCommentsUrl}/${bookcommentID}`, {
    bookcomment: newComment
  });
}


 deleteBookComment(commentId: number): Observable<void> {
  return this.http.delete<void>(`${this.bookCommentsUrl}/${commentId}`);
}

}
