import { ChangeDetectionStrategy, ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { Product } from '../products/product.model';
import { ProductService } from '../products/product.service';
import { FormsModule,NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection:ChangeDetectionStrategy.Default

})
export class DashboardComponent implements OnInit {
 
  products: Product[] = [];
  loading = false;
  showModal = false;
  saving = false;
  newProductName = '';
  newProductDescription = '';
  private userId:number;
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {
    this.userId=Number(this.authService.getUserId());
  }
 
  ngOnInit(): void {
    this.loadProducts();
  }
 
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      }
    });
  }
 
  openModal(): void {
    this.showModal = true;
    this.newProductName = '';
    this.newProductDescription = '';
    this.cdr.detectChanges();
  }
 
  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }
 
  onCreateProduct(form: NgForm): void {
    if (form.invalid) return;
 
    this.saving = true;
    const userId = Number(this.authService.getUserId());
 
    this.productService.createProduct({
      name: this.newProductName,
      description: this.newProductDescription,
      userId: userId
    }).subscribe({
      next: (product) => {
        this.products.push(product);
        this.saving = false;
        this.closeModal();
      }
    });
  }
  goToFeatures(productId: number): void {
    this.router.navigate(['app','products', productId, 'features']);
  }
  deleteProduct(productId:number,event:Event):void{
    event.stopPropagation();
    const confirmDelete=confirm("Delete this product?")
    if(!confirmDelete) return ;
    this.productService.deleteProduct(productId).subscribe({
      next:()=>{
        this.products=this.products.filter(p=>p.id!=productId);
      }
    });
  }
}
