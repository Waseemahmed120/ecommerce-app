// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { ApiService } from '../../services/api.service';
// import { CartService } from '../../services/cart';

// @Component({
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './post-detail.html',
//   styleUrl: './post-detail.css'
// })
// export class PostDetail implements OnInit {
//   product: any = null;
//   loading = true;
//   quantity = 1;
//   suggestedProducts: any[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private api: ApiService,
//     private cartService: CartService
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.loadProduct(Number(id));
//       this.loadSuggestedProducts();
//     }
//   }

//   loadProduct(id: number): void {
//     this.api.getProducts().subscribe(products => {
//       this.product = products.find(p => p.id === id);
//       if (!this.product) {
//         this.router.navigate(['/dashboard/posts']);
//       }
//       this.loading = false;
//     });
//   }

//   loadSuggestedProducts(): void {
//     this.api.getProducts().subscribe(products => {
//       this.suggestedProducts = products.slice(0, 4);
//     });
//   }

//   getStars(rating: number): number[] {
//     return Array(5).fill(0).map((_, i) => i + 1);
//   }

//   increaseQuantity(): void {
//     this.quantity++;
//   }

//   decreaseQuantity(): void {
//     if (this.quantity > 1) {
//       this.quantity--;
//     }
//   }

//   addToCart(): void {
//     if (this.product) {
//       for (let i = 0; i < this.quantity; i++) {
//         this.cartService.addToCart(this.product);
//       }
      
      
//       alert(`${this.quantity} item(s) added to cart!`);
//     }
//   }

//   buyNow(): void {
//     this.addToCart();
//     this.router.navigate(['/dashboard/cart']);
//   }

//   viewSuggestedProduct(productId: number): void {
//     this.router.navigate(['/dashboard/product', productId]);
//   }
// }








import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Subscribe to route params to handle navigation
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loading = true;
        this.loadProduct(Number(id));
        this.loadSuggestedProducts();
      } else {
        this.router.navigate(['/dashboard/posts']);
      }
    });
  }

  loadProduct(id: number): void {
    // First try to get single product
    this.api.getProductById(id).subscribe({
      next: (product) => {
        this.product = this.formatProduct(product);
        this.loading = false;
      },
      error: () => {
        // Fallback: search in all products
        this.api.getProducts().subscribe({
          next: (products) => {
            const found = products.find((p: any) => p.id === id);
            if (found) {
              this.product = this.formatProduct(found);
            } else {
              console.error('Product not found');
              this.router.navigate(['/dashboard/posts']);
            }
            this.loading = false;
          },
          error: () => {
            console.error('Error loading product');
            this.router.navigate(['/dashboard/posts']);
          }
        });
      }
    });
  }

  formatProduct(product: any): any {
    return {
      ...product,
      rating: product.rating || this.generateRandomRating(),
      images: product.images || [product.thumbnail || 'https://via.placeholder.com/600x400?text=No+Image'],
      description: product.description || 'No description available',
      category: product.category || 'General',
      brand: product.brand || 'Generic',
      stock: product.stock || 'In Stock'
    };
  }

  loadSuggestedProducts(): void {
    this.api.getProducts().subscribe({
      next: (products) => {
        this.suggestedProducts = products
          .filter((p: any) => p.id !== this.product?.id)
          .slice(0, 4)
          .map((p: any) => ({
            ...p,
            rating: p.rating || this.generateRandomRating(),
            images: p.images || [p.thumbnail || 'https://via.placeholder.com/150?text=No+Image']
          }));
      }
    });
  }

  generateRandomRating(): number {
    return Math.floor(Math.random() * 3) + 3; // 3-5 stars
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  setRating(star: number): void {
    if (this.product) {
      this.product.rating = star;
      
      if (this.product.id < 100000) {
        this.api.updateProduct(this.product.id, { rating: star }).subscribe({
          error: (error) => console.error('Error updating rating:', error)
        });
      }
    }
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
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      
      alert(`${this.quantity} item(s) added to cart!`);
    }
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/dashboard/cart']);
  }

  viewSuggestedProduct(productId: number): void {
    this.router.navigate(['/dashboard/product', productId]);
  }
}