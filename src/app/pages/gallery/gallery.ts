
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css'],
})
export class Gallery implements OnInit {

  products: any[] = [];
  newProduct = { title: '', description: '', price: 0, images: [''] };
  editingProduct: any = null;
  private nextLocalProductId = 100000;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.api.getProducts().subscribe({
      next: (res: any[]) => {
        this.products = [...res.slice(0, 20)]; 
        this.cdr.detectChanges();
      },
      error: () => console.error('Failed to load products')
    });
  }

  addProduct(): void {
    if (!this.newProduct.title || !this.newProduct.description || !this.newProduct.price) {
      return;
    }

    this.api.addProduct(this.newProduct).subscribe({
      next: (createdProduct: any) => {
        const product = {
          ...createdProduct,
          id: createdProduct?.id ?? this.nextLocalProductId++,
          images: this.newProduct.images,
        };

        this.products = [...this.products, product]; 
        this.resetNewProduct();
        this.cdr.detectChanges();
      },
      error: () => {
        const fallbackProduct = {
          ...this.newProduct,
          id: this.nextLocalProductId++,
          images: this.newProduct.images,
        };

        this.products = [...this.products, fallbackProduct];
        this.resetNewProduct();
        this.cdr.detectChanges();
      },
    });
  }

  startEdit(product: any): void {
    this.editingProduct = { ...product };
  }

  saveProduct(): void {
    if (!this.editingProduct) return;

    if (this.editingProduct.id < 100000) {
      this.api.updateProduct(this.editingProduct.id, this.editingProduct).subscribe({
        next: (updatedProduct: any) => {
          this.products = this.products.map(p =>
            p.id === updatedProduct.id ? updatedProduct : p
          );
          this.editingProduct = null;
          this.cdr.detectChanges();
        },
        error: () => {
          this.products = this.products.map(p =>
            p.id === this.editingProduct.id ? { ...this.editingProduct } : p
          );
          this.editingProduct = null;
          this.cdr.detectChanges();
        },
      });
      return;
    }

    this.products = this.products.map(p =>
      p.id === this.editingProduct.id ? { ...this.editingProduct } : p
    );

    this.editingProduct = null;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  deleteProduct(product: any): void {
    this.products = this.products.filter(p => p.id !== product.id);
    this.cdr.detectChanges();

    if (product.id < 100000) {
      this.api.deleteProduct(product.id).subscribe();
    }
  }

  onImageLoad(): void {
    this.cdr.detectChanges(); 
  }

  private resetNewProduct(): void {
    this.newProduct = { title: '', description: '', price: 0, images: [''] };
  }

  trackById(index: number, product: any) {
    return product.id;
  }
}









