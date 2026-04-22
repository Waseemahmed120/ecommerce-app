
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css'
})
export class Posts implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  viewMode: 'grid' | 'table' = 'grid';
  searchTerm = '';
  sortBy = 'default';
  
  showImagePreview = false;
  previewImageUrl = '';
  previewProductTitle = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.api.getProducts().subscribe(res => {
      this.products = [...res.slice(0, 20)].map(product => ({
        ...product,
        rating: product.rating || this.generateRandomRating(),
        images: product.images || [product.thumbnail || 'https://via.placeholder.com/300x180?text=No+Image']
      }));
      this.filteredProducts = [...this.products];
      this.cdr.detectChanges();
    });
  }

  generateRandomRating(): number {
    return Math.floor(Math.random() * 3) + 3;
  }

  toggleView(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  applyFilters(): void {
    let filtered = [...this.products];
    
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    
    switch (this.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    this.filteredProducts = filtered;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  setRating(event: Event, product: any, star: number): void {
    event.stopPropagation(); 
    product.rating = star;
    
    if (product.id < 100000) {
      this.api.updateProduct(product.id, { rating: star }).subscribe({
        error: (error) => {
          console.error('Error updating rating:', error);
        }
      });
    }
    
    
    this.applyFilters();
  }

  openImagePreview(event: Event, imageUrl: string, title: string): void {
    event.stopPropagation(); 
    this.previewImageUrl = imageUrl || 'https://via.placeholder.com/800x600?text=No+Image';
    this.previewProductTitle = title;
    this.showImagePreview = true;
  }

  closeImagePreview(): void {
    this.showImagePreview = false;
    this.previewImageUrl = '';
    this.previewProductTitle = '';
  }

  viewProductDetails(product: any): void {
    this.router.navigate(['/dashboard/product', product.id]);
  }

  addToCart(event: Event, product: any): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
    
    const button = event.target as HTMLElement;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
    button.classList.add('btn-success');
    button.classList.remove('btn-outline-primary');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('btn-success');
      button.classList.add('btn-outline-primary');
    }, 1500);
  }

  buyNow(event: Event, product: any): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.router.navigate(['/dashboard/cart']);
  }
}