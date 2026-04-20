
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  USERS = 'https://jsonplaceholder.typicode.com/users';
  PHOTOS = 'https://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) {}

  // USERS
  getUsers() { return this.http.get<any[]>(this.USERS); }
  addUser(user: any) { return this.http.post(this.USERS, user); }
  updateUser(id: number, user: any) { return this.http.put(`${this.USERS}/${id}`, user); }
  deleteUser(id: number) { return this.http.delete(`${this.USERS}/${id}`); }

  // GALLERY
  getPhotos() { return this.http.get<any[]>(this.PHOTOS); }
  addPhoto(photo: any) { return this.http.post(this.PHOTOS, photo); }
  updatePhoto(id: number, photo: any) { return this.http.put(`${this.PHOTOS}/${id}`, photo); }
  deletePhoto(id: number) { return this.http.delete(`${this.PHOTOS}/${id}`); }
}