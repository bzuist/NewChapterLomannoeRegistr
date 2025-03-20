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
  private bookshelfUrl = `${this.apiUrl}/bookshelf`;
  private postsUrl = `${this.apiUrl}/posts`;
  private blogsUrl = `${this.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  // Получить список всех фанфиков
  getAllFanfics(): Observable<Fanfic[]> {
    return this.http.get<Fanfic[]>(this.fanficsUrl);
  }

  // Получить фанфик по ID
  getFanficById(id: number): Observable<Fanfic> {
    return this.http.get<Fanfic>(`${this.fanficUrl}/${id}`);
  }

  // Добавить новый фанфик
  addNewFanfic(fanfic: Fanfic): Observable<Fanfic> {
    return this.http.post<Fanfic>(this.fanficUrl, fanfic);
  }

  // Изменить фанфик
  changeFanfic(fanfic: Fanfic): Observable<Fanfic> {
    return this.http.put<Fanfic>(`${this.fanficUrl}/${fanfic.id}`, fanfic);
  }

  // Удалить фанфик
  deleteFanfic(id: number): Observable<any> {
    return this.http.delete(`${this.fanficUrl}/${id}`);
  }

  // Получить фанфики пользователя по ID
  getFanficsByUserId(userId: number): Observable<Fanfic[]> {
    return this.http.get<Fanfic[]>(`${this.fanficsUrl}?userId=${userId}`)
  }

  // Получить данные пользователя по ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  // Получить посты пользователя
  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsUrl}?userId=${userId}`);
  }

  //Получить все посты
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  // Получить книжную полку пользователя
  getBookshelfByUserId(userId: number): Observable<Bookshelf[]> {
    return this.http.get<Bookshelf[]>(`${this.bookshelfUrl}?userId=${userId}`);
  }

  // Добавить новую книжную полку
  addNewBookshelf(bookshelf: Bookshelf): Observable<Bookshelf> {
    return this.http.post<Bookshelf>(this.bookshelfUrl, bookshelf);
  }

  // Получить все жанры
  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.genresUrl);
  }

  // Получить жанр по ID
  getGenreById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.genreUrl}/${id}`);
  }

  // Получить основного (авторизованного) пользователя
  getPrincipal(): Observable<User> {
    return this.http.get<User>(this.userUrl);
  }

  // Добавить новый комментарий к книге
  addNewBookComment(bookComment: BookComment): Observable<BookComment> {
    return this.http.post<BookComment>(`${this.apiUrl}/bookComment`, bookComment);
  }

  // Получить все комментарии к книге
  getBookComments(bookId: number): Observable<BookComment[]> {
    return this.http.get<BookComment[]>(`${this.apiUrl}/bookComments?bookId=${bookId}`);
  }
}
