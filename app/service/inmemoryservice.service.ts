// import { Genre } from './../models/genre';
// import { Injectable } from '@angular/core';
// import { Fanfic } from '../models/fanfics';

// const NAMES: string[] = [
//   'Lost Boys',
//   'A Min Family Christmas',
//   'Orchestra Boys',
//   'Rainy Days',
// ];
// const AUTHORNAME: string[] = [
//   'Priska',
//   'hopelessandcynical',
//   'al_xx',
//   'Atticus',
// ];

// const DESCRIPTION: string[]=[
//   'They are Lost Boys, all of them haunted by their own tragic fates. This is the story of how they met each other. A story of friendship, love, and betrayal',
//   'It is Yoongi and Jessica first Christmas and they have put a lot of pressure on themselves to make the perfect Christmas.',
//   'orchestra and ballet kids were supposed to stay separated.the mingling of both in two boys was bound to end them in rivalry. but who knew what would happen if they decided to help each other out, starting something more than just a friendship...',
//   'i think bout u',
// ]

// const TEXT: string[]=[
//   ' ',
//   ' ',
//   ' ',
//   ' '
// ]

// const GENRE: number[]=[
//   1,
//   2,
//   3,
//   4
// ]

// @Injectable({
//   providedIn: 'root'
// })
// export class InMemoryDataService {

//   constructor() { };

//   createDb() {
//     var fanfic:Fanfic[];
//     fanfic = Array.from({length: 4}, (_, k=0) => createNewFanfic(k++));
//       /*{id: 0, name: 'Имя', surname: 'Фамилия'},
//       {id: 1, name: 'Имя 1', surname: 'Фамилия 1'},
//       {id: 2, name: 'Имя 2', surname: 'Фамилия 2'}*/
//       console.log(fanfic)
//     return fanfic
//   }

//   genId(fanfic: Fanfic[]): number {
//     return fanfic.length > 0 ? Math.max(...fanfic.map(fanfic => fanfic.id ? fanfic.id : 0)) + 1 : 11;
//   }


// }

// // function createNewFanfic(id: number): Fanfic {
// //   const name =
// //     NAMES[Math.round(Math.random() * (NAMES.length - 1))];
// //   const authorName =
// //     AUTHORNAME[Math.round(Math.random() * (AUTHORNAME.length - 1))];
// //   const description =
// //     DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))];
// //   const text =
// //     TEXT[Math.round(Math.random() * (TEXT.length - 1))];
// //     const Genre =
// //     GENRE[Math.round(Math.random() * (GENRE.length - 1))];
// function createNewFanfic(id: number): Fanfic {
//   const name =
//     NAMES[id];
//   const authorName =
//     AUTHORNAME[id];
//   const description =
//     DESCRIPTION[id];
//   const text =
//     TEXT[id];
//     const Genre =
//     GENRE[id];


//   return {
//     id: id,
//     name:name,
//     authorName: authorName,
//     description: description,
//     text: text,
//     genreid:Genre
//   };
// }
