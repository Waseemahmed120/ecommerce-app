import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "https://dummyjson.com";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/users`).pipe(
      map(res => res.users)
    );
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/add`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/users/${id}`);
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/photos`);
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/photos/${id}`);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/products`).pipe(
      map(res => res.products)
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/add`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/${id}`);
  }
}