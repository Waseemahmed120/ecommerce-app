
// import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ApiService } from '../../services/api.service';

// @Component({
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './gallery.html',
// })
// export class Gallery implements OnInit {

//   @ViewChild('productFormCard') productFormCard!: ElementRef;

//   products: any[] = [];

//   formProduct = {
//     id: null,
//     title: '',
//     description: '',
//     price: 0,
//     images: [''],
//     rating: 0
//   };

//   isEditMode = false;
//   private nextLocalProductId = 100000;
  
//   formErrors: any = {
//     title: '',
//     description: '',
//     price: '',
//     image: '',
//     rating: ''
//   };
  
//   isFormSubmitted = false;
//   formSubmitError = '';
//   formSubmitSuccess = '';
  
//   showDeleteDialog = false;
//   productToDelete: any = null;
  
//   showImagePreview = false;
//   previewImageUrl = '';
//   previewProductTitle = '';

//   constructor(
//     private api: ApiService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.api.getProducts().subscribe(res => {
//       this.products = [...res.slice(0, 20)].map(product => ({
//         ...product,
//         rating: product.rating || this.generateRandomRating()
//       }));
//       this.cdr.detectChanges();
//     });
//   }

//   generateRandomRating(): number {
//     return Math.floor(Math.random() * 3) + 3; // Random rating between 3-5
//   }

//   scrollToForm(): void {
//     setTimeout(() => {
//       if (this.productFormCard) {
//         this.productFormCard.nativeElement.scrollIntoView({ 
//           behavior: 'smooth', 
//           block: 'start' 
//         });
//       }
//     }, 100);
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

//   setRating(product: any, rating: number): void {
//     product.rating = rating;
    
//     if (product.id < 100000) {
//       this.api.updateProduct(product.id, { rating }).subscribe({
//         error: (error) => {
//           console.error('Error updating rating:', error);
//         }
//       });
//     }
//   }

//   getStars(rating: number): number[] {
//     return Array(5).fill(0).map((_, i) => i + 1);
//   }

//   validateField(fieldName: string): boolean {
//     switch (fieldName) {
//       case 'title':
//         if (!this.formProduct.title?.trim()) {
//           this.formErrors.title = 'Title is required';
//           return false;
//         } else if (this.formProduct.title.length < 3) {
//           this.formErrors.title = 'Title must be at least 3 characters';
//           return false;
//         } else if (this.formProduct.title.length > 100) {
//           this.formErrors.title = 'Title cannot exceed 100 characters';
//           return false;
//         } else {
//           this.formErrors.title = '';
//           return true;
//         }
        
//       case 'description':
//         if (!this.formProduct.description?.trim()) {
//           this.formErrors.description = 'Description is required';
//           return false;
//         } else if (this.formProduct.description.length < 10) {
//           this.formErrors.description = 'Description must be at least 10 characters';
//           return false;
//         } else if (this.formProduct.description.length > 500) {
//           this.formErrors.description = 'Description cannot exceed 500 characters';
//           return false;
//         } else {
//           this.formErrors.description = '';
//           return true;
//         }
        
//       case 'price':
//         if (!this.formProduct.price || this.formProduct.price <= 0) {
//           this.formErrors.price = 'Price must be greater than 0';
//           return false;
//         } else if (this.formProduct.price > 999999.99) {
//           this.formErrors.price = 'Price cannot exceed 999,999.99';
//           return false;
//         } else if (!/^\d+(\.\d{1,2})?$/.test(this.formProduct.price.toString())) {
//           this.formErrors.price = 'Price can have maximum 2 decimal places';
//           return false;
//         } else {
//           this.formErrors.price = '';
//           return true;
//         }
        
//       case 'image':
//         if (this.formProduct.images[0]) {
//           const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//           if (!urlPattern.test(this.formProduct.images[0])) {
//             this.formErrors.image = 'Please enter a valid URL';
//             return false;
//           }
//         }
//         this.formErrors.image = '';
//         return true;
        
//       case 'rating':
//         if (this.formProduct.rating < 0 || this.formProduct.rating > 5) {
//           this.formErrors.rating = 'Rating must be between 0 and 5';
//           return false;
//         }
//         this.formErrors.rating = '';
//         return true;
        
//       default:
//         return true;
//     }
//   }

//   validateForm(): boolean {
//     const isTitleValid = this.validateField('title');
//     const isDescriptionValid = this.validateField('description');
//     const isPriceValid = this.validateField('price');
//     const isImageValid = this.validateField('image');
//     const isRatingValid = this.validateField('rating');
    
//     return isTitleValid && isDescriptionValid && isPriceValid && isImageValid && isRatingValid;
//   }

//   hasFormErrors(): boolean {
//     return Object.values(this.formErrors).some(error => error !== '');
//   }

//   submitProduct(): void {
//     this.isFormSubmitted = true;
//     this.formSubmitError = '';
//     this.formSubmitSuccess = '';
    
//     if (!this.validateForm()) {
//       this.formSubmitError = 'Please correct the errors in the form';
//       return;
//     }
    
//     const isDuplicateTitle = this.products.some(p => 
//       p.title?.toLowerCase() === this.formProduct.title?.toLowerCase() && 
//       Number(p.id) !== Number(this.formProduct.id)
//     );
    
//     if (isDuplicateTitle) {
//       this.formSubmitError = 'A product with this title already exists';
//       return;
//     }

//     if (this.isEditMode) {
//       this.saveProduct();
//     } else {
//       this.addProduct();
//     }
//   }

//   addProduct(): void {
//     this.formSubmitError = '';
//     this.formSubmitSuccess = '';
    
//     this.api.addProduct(this.formProduct).subscribe({
//       next: (created: any) => {
//         const product = {
//           ...created,
//           id: created?.id ?? this.nextLocalProductId++,
//           images: this.formProduct.images,
//           rating: this.formProduct.rating || 0
//         };
//         this.products = [...this.products, product];
//         this.formSubmitSuccess = 'Product added successfully!';
//         this.resetForm();
//       },
//       error: (error) => {
//         console.error('Error adding product:', error);
        
//         if (error.status === 409) {
//           this.formSubmitError = 'A product with this title already exists';
//         } else if (error.status === 400) {
//           this.formSubmitError = error.error?.message || 'Invalid product data provided';
//         } else {
//           const fallback = {
//             ...this.formProduct,
//             id: this.nextLocalProductId++,
//             rating: this.formProduct.rating || 0
//           };
//           this.products = [...this.products, fallback];
//           this.formSubmitError = 'Added locally (API unavailable). Changes may not persist.';
//           this.resetForm();
//         }
//       }
//     });
//   }

//   startEdit(product: any): void {
//     this.formProduct = { 
//       ...product,
//       rating: product.rating || 0
//     };
//     this.isEditMode = true;
//     this.isFormSubmitted = false;
//     this.formSubmitError = '';
//     this.formSubmitSuccess = '';
//     this.clearFormErrors();
    
//     this.scrollToForm();
//   }

//   saveProduct(): void {
//     const id = Number(this.formProduct.id);
//     this.formSubmitError = '';
//     this.formSubmitSuccess = '';

//     this.api.updateProduct(id, this.formProduct).subscribe({
//       next: (updated) => {
//         this.products = this.products.map(p =>
//           Number(p.id) === id ? { ...updated, rating: this.formProduct.rating } : p
//         );
//         this.formSubmitSuccess = 'Product updated successfully!';
//         this.resetForm();
//       },
//       error: (error) => {
//         console.error('Error updating product via API:', error);
        
//         this.products = this.products.map(p =>
//           Number(p.id) === id ? { ...this.formProduct } : p
//         );
        
//         if (error.status === 404) {
//           this.formSubmitSuccess = 'Product updated successfully!';
//         } else if (error.status === 500 || error.status === 0) {
//           this.formSubmitSuccess = 'Product updated successfully!';
//         } else {
//           this.formSubmitSuccess = 'Product updated successfully!';
//         }
        
//         this.resetForm();
//       }
//     });
//   }

//   cancelEdit(): void {
//     this.resetForm();
//   }

//   openDeleteDialog(product: any): void {
//     this.productToDelete = product;
//     this.showDeleteDialog = true;
//   }

//   closeDeleteDialog(): void {
//     this.showDeleteDialog = false;
//     this.productToDelete = null;
//   }

//   confirmDelete(): void {
//     if (!this.productToDelete) return;
    
//     const numericId = Number(this.productToDelete.id);
//     this.products = this.products.filter(p => Number(p.id) !== numericId);
    
//     if (numericId < 100000) {
//       this.api.deleteProduct(numericId).subscribe({
        
//       });
//     }
    
//     this.formSubmitSuccess = `${this.productToDelete.title} has been deleted`;
    
//     this.closeDeleteDialog();
    
//     setTimeout(() => {
//       this.formSubmitSuccess = '';
//     }, 3000);
//   }

//   resetForm(): void {
//     this.formProduct = {
//       id: null,
//       title: '',
//       description: '',
//       price: 0,
//       images: [''],
//       rating: 0
//     };
//     this.isEditMode = false;
//     this.isFormSubmitted = false;
//     this.formSubmitError = '';
//     setTimeout(() => {
//       this.formSubmitSuccess = '';
//     }, 3000);
//     this.clearFormErrors();
//     this.cdr.detectChanges();
//   }
  
//   clearFormErrors(): void {
//     this.formErrors = {
//       title: '',
//       description: '',
//       price: '',
//       image: '',
//       rating: ''
//     };
//   }
// }