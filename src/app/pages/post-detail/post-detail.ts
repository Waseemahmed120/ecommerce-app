
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css'
})
export class PostDetail implements OnInit {
  product: any = null;
  loading = true;
  quantity = 1;
  suggestedProducts: any[] = [];
  
  showImagePreview = false;
  previewImageUrl = '';
  previewProductTitle = '';
  
  addedToCart = false;
  addToCartText = 'Add to Cart';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(Number(id));
      } else {
        this.router.navigate(['/dashboard/posts']);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    
    this.api.getProducts().subscribe({
      next: (products) => {
        const found = products.find((p: any) => p.id === id);
        if (found) {
          this.product = {
            ...found,
            rating: found.rating || this.generateRandomRating(),
            images: found.images || [found.thumbnail || 'https://via.placeholder.com/600x400?text=No+Image'],
            description: found.description || 'No description available for this product.',
            category: found.category || 'General',
            brand: found.brand || 'Generic'
          };
          this.loadSuggestedProducts(this.product.category);
        } else {
          this.router.navigate(['/dashboard/posts']);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/posts']);
      }
    });
  }

  loadSuggestedProducts(category: string): void {
    this.api.getProducts().subscribe({
      next: (products) => {
        this.suggestedProducts = products
          .filter((p: any) => p.category === category && p.id !== this.product?.id)
          .slice(0, 4)
          .map((p: any) => ({
            ...p,
            rating: p.rating || this.generateRandomRating(),
            images: p.images || [p.thumbnail || 'https://via.placeholder.com/150?text=No+Image']
          }));
        this.cdr.detectChanges();
      }
    });
  }

  generateRandomRating(): number {
    return Math.floor(Math.random() * 3) + 3;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  setRating(star: number): void {
    if (this.product) {
      this.product.rating = star;
      this.cdr.detectChanges();
    }
  }

  openImagePreview(imageUrl: string, title: string): void {
    this.previewImageUrl = imageUrl || 'https://via.placeholder.com/800x600?text=No+Image';
    this.previewProductTitle = title;
    this.showImagePreview = true;
  }

  closeImagePreview(): void {
    this.showImagePreview = false;
    this.previewImageUrl = '';
    this.previewProductTitle = '';
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && !this.addedToCart) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      
      this.addedToCart = true;
      this.addToCartText = 'Added ✓';
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.addedToCart = false;
        this.addToCartText = 'Add to Cart';
        this.cdr.detectChanges();
      }, 2000);
    }
  }

  buyNow(): void {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      this.router.navigate(['/dashboard/cart']);
    }
  }

  viewSuggestedProduct(productId: number): void {
    this.router.navigate(['/dashboard/product', productId]);
  }
}