import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.id, quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToPayment(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/dashboard/payment']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/dashboard/posts']);
  }

  exportToCSV(): void {
    if (this.cartItems.length === 0) return;

    const headers = ['Title', 'Price', 'Quantity', 'Subtotal'];
    const rows = this.cartItems.map(item => [
      item.title,
      `$${item.price.toFixed(2)}`,
      item.quantity.toString(),
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    const total = ['', '', 'Total:', `$${this.totalPrice.toFixed(2)}`];
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      total.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cart-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

