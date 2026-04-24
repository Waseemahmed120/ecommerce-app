
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  
//   showImagePreview = false;
//   previewImageUrl = '';
//   previewProductTitle = '';
  
//   addedToCart = false;
//   addToCartText = 'Add to Cart';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private api: ApiService,
//     private cartService: CartService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       const id = params['id'];
//       if (id) {
//         this.loadProduct(Number(id));
//       } else {
//         this.router.navigate(['/dashboard/posts']);
//       }
//     });
//   }

//   loadProduct(id: number): void {
//     this.loading = true;
    
//     this.api.getProducts().subscribe({
//       next: (products) => {
//         const found = products.find((p: any) => p.id === id);
//         if (found) {
//           this.product = {
//             ...found,
//             rating: found.rating || this.generateRandomRating(),
//             images: found.images || [found.thumbnail || 'https://via.placeholder.com/600x400?text=No+Image'],
//             description: found.description || 'No description available for this product.',
//             category: found.category || 'General',
//             brand: found.brand || 'Generic'
//           };
//           this.loadSuggestedProducts(this.product.category);
//         } else {
//           this.router.navigate(['/dashboard/posts']);
//         }
//         this.loading = false;
//         this.cdr.detectChanges();
//       },
//       error: () => {
//         this.loading = false;
//         this.router.navigate(['/dashboard/posts']);
//       }
//     });
//   }

//   loadSuggestedProducts(category: string): void {
//     this.api.getProducts().subscribe({
//       next: (products) => {
//         this.suggestedProducts = products
//           .filter((p: any) => p.category === category && p.id !== this.product?.id)
//           .slice(0, 4)
//           .map((p: any) => ({
//             ...p,
//             rating: p.rating || this.generateRandomRating(),
//             images: p.images || [p.thumbnail || 'https://via.placeholder.com/150?text=No+Image']
//           }));
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   generateRandomRating(): number {
//     return Math.floor(Math.random() * 3) + 3;
//   }

//   getStars(rating: number): number[] {
//     return Array(5).fill(0).map((_, i) => i + 1);
//   }

//   setRating(star: number): void {
//     if (this.product) {
//       this.product.rating = star;
//       this.cdr.detectChanges();
//     }
//   }

//   openImagePreview(imageUrl: string, title: string): void {
//     this.previewImageUrl = imageUrl || 'https://via.placeholder.com/800x600?text=No+Image';
//     this.previewProductTitle = title;
//     this.showImagePreview = true;
//   }

//   closeImagePreview(): void {
//     this.showImagePreview = false;
//     this.previewImageUrl = '';
//     this.previewProductTitle = '';
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
//     if (this.product && !this.addedToCart) {
//       for (let i = 0; i < this.quantity; i++) {
//         this.cartService.addToCart(this.product);
//       }
      
//       this.addedToCart = true;
//       this.addToCartText = 'Added ✓';
//       this.cdr.detectChanges();
      
//       setTimeout(() => {
//         this.addedToCart = false;
//         this.addToCartText = 'Add to Cart';
//         this.cdr.detectChanges();
//       }, 2000);
//     }
//   }

//   viewSuggestedProduct(productId: number): void {
//     this.router.navigate(['/dashboard/product', productId]);
//   }
// }










// import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
// export class PostDetail implements OnInit, OnDestroy {
//   product: any = null;
//   loading = true;
//   quantity = 1;
//   suggestedProducts: any[] = [];
//   allSuggestedProducts: any[] = [];
//   displayedSuggestedProducts: any[] = [];
  
//   showImagePreview = false;
//   previewImageUrl = '';
//   previewProductTitle = '';
  
//   addedToCart = false;
//   addToCartText = 'Add to Cart';
  
//   private swapInterval: any;
//   private currentIndex = 0;
//   private readonly ITEMS_PER_VIEW = 4;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private api: ApiService,
//     private cartService: CartService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       const id = params['id'];
//       if (id) {
//         this.loadProduct(Number(id));
//       } else {
//         this.router.navigate(['/dashboard/posts']);
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.swapInterval) {
//       clearInterval(this.swapInterval);
//     }
//   }

//   loadProduct(id: number): void {
//     this.loading = true;
    
//     this.api.getProducts().subscribe({
//       next: (products) => {
//         const found = products.find((p: any) => p.id === id);
//         if (found) {
//           this.product = {
//             ...found,
//             rating: found.rating || this.generateRandomRating(),
//             images: found.images || [found.thumbnail || 'https://via.placeholder.com/600x400?text=No+Image'],
//             description: found.description || 'No description available for this product.',
//             category: found.category || 'General',
//             brand: found.brand || 'Generic'
//           };
//           this.loadSuggestedProducts(this.product.category);
//         } else {
//           this.router.navigate(['/dashboard/posts']);
//         }
//         this.loading = false;
//         this.cdr.detectChanges();
//       },
//       error: () => {
//         this.loading = false;
//         this.router.navigate(['/dashboard/posts']);
//       }
//     });
//   }

//   loadSuggestedProducts(category: string): void {
//     this.api.getProducts().subscribe({
//       next: (products) => {
//         this.allSuggestedProducts = products
//           .filter((p: any) => p.category === category && p.id !== this.product?.id)
//           .slice(0, 8)
//           .map((p: any) => ({
//             ...p,
//             rating: p.rating || this.generateRandomRating(),
//             images: p.images || [p.thumbnail || 'https://via.placeholder.com/150?text=No+Image']
//           }));
        
//         this.updateDisplayedProducts();
//         this.startAutoSwap();
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   updateDisplayedProducts(): void {
//     const start = this.currentIndex;
//     const end = start + this.ITEMS_PER_VIEW;
    
//     if (this.allSuggestedProducts.length <= this.ITEMS_PER_VIEW) {
//       this.displayedSuggestedProducts = [...this.allSuggestedProducts];
//     } else {
//       this.displayedSuggestedProducts = [];
//       for (let i = start; i < end; i++) {
//         const index = i % this.allSuggestedProducts.length;
//         this.displayedSuggestedProducts.push(this.allSuggestedProducts[index]);
//       }
//     }
//   }

//   startAutoSwap(): void {
//     if (this.swapInterval) {
//       clearInterval(this.swapInterval);
//     }
    
//     if (this.allSuggestedProducts.length > this.ITEMS_PER_VIEW) {
//       this.swapInterval = setInterval(() => {
//         this.currentIndex = (this.currentIndex + 1) % this.allSuggestedProducts.length;
//         this.updateDisplayedProducts();
//         this.cdr.detectChanges();
//       }, 3000);
//     }
//   }

//   generateRandomRating(): number {
//     return Math.floor(Math.random() * 3) + 3;
//   }

//   getStars(rating: number): number[] {
//     return Array(5).fill(0).map((_, i) => i + 1);
//   }

//   setRating(star: number): void {
//     if (this.product) {
//       this.product.rating = star;
//       this.cdr.detectChanges();
//     }
//   }

//   openImagePreview(imageUrl: string, title: string): void {
//     this.previewImageUrl = imageUrl || 'https://via.placeholder.com/800x600?text=No+Image';
//     this.previewProductTitle = title;
//     this.showImagePreview = true;
//   }

//   closeImagePreview(): void {
//     this.showImagePreview = false;
//     this.previewImageUrl = '';
//     this.previewProductTitle = '';
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
//     if (this.product && !this.addedToCart) {
//       for (let i = 0; i < this.quantity; i++) {
//         this.cartService.addToCart(this.product);
//       }
      
//       this.addedToCart = true;
//       this.addToCartText = 'Added ✓';
//       this.cdr.detectChanges();
      
//       setTimeout(() => {
//         this.addedToCart = false;
//         this.addToCartText = 'Add to Cart';
//         this.cdr.detectChanges();
//       }, 2000);
//     }
//   }

//   viewSuggestedProduct(productId: number): void {
//     if (this.swapInterval) {
//       clearInterval(this.swapInterval);
//     }
//     this.router.navigate(['/dashboard/product', productId]);
//   }
// }









import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class PostDetail implements OnInit, OnDestroy {
  product: any = null;
  loading = true;
  quantity = 1;
  allSuggestedProducts: any[] = [];
  displayedSuggestedProducts: any[] = [];
  
  showImagePreview = false;
  previewImageUrl = '';
  previewProductTitle = '';
  
  addedToCart = false;
  addToCartText = 'Add to Cart';
  
  private swapInterval: any;
  private currentIndex = 0;
  private readonly ITEMS_PER_VIEW = 4;

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

  ngOnDestroy(): void {
    if (this.swapInterval) {
      clearInterval(this.swapInterval);
    }
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
          this.loadAllSuggestedProducts(products, id);
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

  loadAllSuggestedProducts(products: any[], currentProductId: number): void {
    this.allSuggestedProducts = products
      .filter((p: any) => p.id !== currentProductId)
      .slice(0, 12)
      .map((p: any) => ({
        ...p,
        rating: p.rating || this.generateRandomRating(),
        images: p.images || [p.thumbnail || 'https://via.placeholder.com/150?text=No+Image']
      }));
    
    this.currentIndex = 0;
    this.updateDisplayedProducts();
    this.startAutoSwap();
  }

  updateDisplayedProducts(): void {
    const totalProducts = this.allSuggestedProducts.length;
    
    if (totalProducts === 0) {
      this.displayedSuggestedProducts = [];
      return;
    }
    
    if (totalProducts <= this.ITEMS_PER_VIEW) {
      this.displayedSuggestedProducts = [...this.allSuggestedProducts];
    } else {
      this.displayedSuggestedProducts = [];
      for (let i = 0; i < this.ITEMS_PER_VIEW; i++) {
        const index = (this.currentIndex + i) % totalProducts;
        this.displayedSuggestedProducts.push(this.allSuggestedProducts[index]);
      }
    }
  }

  startAutoSwap(): void {
    if (this.swapInterval) {
      clearInterval(this.swapInterval);
    }
    
    if (this.allSuggestedProducts.length > this.ITEMS_PER_VIEW) {
      this.swapInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.allSuggestedProducts.length;
        this.updateDisplayedProducts();
        this.cdr.detectChanges();
      }, 3000);
    }
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

  viewSuggestedProduct(productId: number): void {
    if (this.swapInterval) {
      clearInterval(this.swapInterval);
    }
    this.router.navigate(['/dashboard/product', productId]);
  }
}