import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../modules/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  Router, RouterModule, RouterOutlet } from '@angular/router';
import { Product } from '../../modules/products/product.model';
import { ProductService } from '../../modules/products/product.service';
@Component({
  selector: 'app-layout',
  imports: [CommonModule,FormsModule,RouterOutlet,RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
 
  userEmail: string | null=null;
  products:Product[]=[];
 
  constructor(private authService: AuthService,private productService:ProductService,private router:Router) {
  }
  ngOnInit(): void {
    this.userEmail=this.authService.getUserEmail();
    const userId=Number(this.authService.getUserId());
    this.productService.getProducts().subscribe({
      next:(data)=>this.products=data
    });
  }
 
  logout(): void {
    this.authService.logout();
  }
  get isFeatureRoute():boolean{
    return this.router.url.includes('/features')
  }
}

