
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.html',
})
export class Gallery implements OnInit {

  products: any[] = [];

  formProduct = {
    id: null,
    title: '',
    description: '',
    price: 0,
    images: ['']
  };

  isEditMode = false;
  private nextLocalProductId = 100000;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.api.getProducts().subscribe(res => {
      this.products = [...res.slice(0, 20)];
      this.cdr.detectChanges();
    });
  }

  /* ---------- ADD OR SAVE ---------- */
  submitProduct(): void {
    if (!this.formProduct.title || !this.formProduct.description || !this.formProduct.price) {
      return;
    }

    if (this.isEditMode) {
      this.saveProduct();
    } else {
      this.addProduct();
    }
  }

  /* ---------- ADD ---------- */
  addProduct(): void {
    this.api.addProduct(this.formProduct).subscribe({
      next: (created: any) => {
        const product = {
          ...created,
          id: created?.id ?? this.nextLocalProductId++,
          images: this.formProduct.images
        };
        this.products = [...this.products, product];
        this.resetForm();
      },
      error: () => {
        const fallback = {
          ...this.formProduct,
          id: this.nextLocalProductId++
        };
        this.products = [...this.products, fallback];
        this.resetForm();
      }
    });
  }

  /* ---------- EDIT ---------- */
  startEdit(product: any): void {
    this.formProduct = { ...product };
    this.isEditMode = true;
  }

  saveProduct(): void {
    const id = Number(this.formProduct.id);

    if (id < 100000) {
      this.api.updateProduct(id, this.formProduct).subscribe(updated => {
        this.products = this.products.map(p =>
          p.id === id ? updated : p
        );
        this.resetForm();
      });
      return;
    }

    this.products = this.products.map(p =>
      p.id === id ? { ...this.formProduct } : p
    );
    this.resetForm();
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteProduct(product: any): void {
    this.products = this.products.filter(p => p.id !== product.id);

    if (product.id < 100000) {
      this.api.deleteProduct(product.id).subscribe();
    }
  }

  resetForm(): void {
    this.formProduct = {
      id: null,
      title: '',
      description: '',
      price: 0,
      images: ['']
    };
    this.isEditMode = false;
    this.cdr.detectChanges();
  }
}