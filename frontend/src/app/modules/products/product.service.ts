import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product,CreateProductRequest } from './product.model';
import { AuthService } from '../auth/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl='https://localhost:7016/api/products';
  constructor(private http:HttpClient,private authService:AuthService) { }
  private getHeaders():HttpHeaders{
    return new HttpHeaders({
      'X-User-Id':this.authService.getUserId()|| ''
    });
  }
  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl,{
      headers:this.getHeaders()
    });
  }
  createProduct(payload:CreateProductRequest):Observable<Product>{
    return this.http.post<Product>(this.apiUrl,payload,{headers:this.getHeaders()});
  }
  getProductById(productId:number):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${productId}`,{
      headers:this.getHeaders()});
    }
  deleteProduct(productId:number){
    return this.http.delete(`${this.apiUrl}/${productId}`,
    {
      headers:this.getHeaders()
    });
  }
  }
