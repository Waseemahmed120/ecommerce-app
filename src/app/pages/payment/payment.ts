import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  paymentMethod: 'hbl' | 'easypaisa' | 'account' = 'hbl';
  accountNumber = '';
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalAmount = this.cartService.getTotalPrice();
    
    // Redirect if cart is empty
    if (this.totalAmount === 0) {
      this.router.navigate(['/dashboard/cart']);
    }
  }

  submitPayment(): void {
    if (this.paymentMethod === 'account' && !this.accountNumber) {
      alert('Please enter account number');
      return;
    }

    // Show success message
    alert('✅ Payment Successful! Thank you for your purchase.');
    
    // Clear cart
    this.cartService.clearCart();
    
    // Redirect to home (posts)
    this.router.navigate(['/dashboard/posts']);
  }

  cancelPayment(): void {
    this.router.navigate(['/dashboard/cart']);
  }
}