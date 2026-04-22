import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  paymentMethod: 'hbl' | 'easypaisa' = 'hbl';
  hblAccountNumber = '';
  easypaisaAccountNumber = '';
  totalAmount = 0;
  isProcessing = false;
  
  showSuccessDialog = false;
  transactionId = '';
  paymentDate = '';

  accountNumberError = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.totalAmount = this.cartService.getTotalPrice();
    
    if (this.totalAmount === 0) {
      this.router.navigate(['/dashboard/cart']);
    }
  }

  validateHBLAccount(account: string): boolean {
    const hblPattern = /^[0-9]{10,16}$/;
    
    if (!account) {
      this.accountNumberError = 'Account number is required';
      return false;
    }
    
    if (!hblPattern.test(account)) {
      this.accountNumberError = 'Account number must be correct';
      return false;
    }
    
    this.accountNumberError = '';
    return true;
  }

  validateEasyPaisaAccount(account: string): boolean {
    const easypaisaPattern = /^3[0-9]{9}$/;
    
    if (!account) {
      this.accountNumberError = 'Mobile number is required';
      return false;
    }
    
    if (!easypaisaPattern.test(account)) {
      this.accountNumberError = 'Enter 10 digits starting with 3 (e.g., 3XXXXXXXXX)';
      return false;
    }
    
    this.accountNumberError = '';
    return true;
  }

  generateTransactionId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  }

  submitPayment(): void {
    let isValid = false;
    
    if (this.paymentMethod === 'hbl') {
      isValid = this.validateHBLAccount(this.hblAccountNumber);
    } else {
      isValid = this.validateEasyPaisaAccount(this.easypaisaAccountNumber);
    }

    if (!isValid) {
      return;
    }

    this.isProcessing = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isProcessing = false;
      
      this.transactionId = this.generateTransactionId();
      this.paymentDate = new Date().toLocaleString('en-PK', { 
        dateStyle: 'full', 
        timeStyle: 'medium',
        timeZone: 'Asia/Karachi'
      });
      
      this.showSuccessDialog = true;
      this.cdr.detectChanges();
    }, 1000);
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
    this.cdr.detectChanges();
    
    this.cartService.clearCart();
    
    this.router.navigate(['/dashboard/posts']);
  }

  cancelPayment(): void {
    this.router.navigate(['/dashboard/cart']);
  }

  onPaymentMethodChange(): void {
    this.accountNumberError = '';
  }

  onEasyPaisaInput(): void {
    this.easypaisaAccountNumber = this.easypaisaAccountNumber.replace(/\D/g, '');
    
    if (this.easypaisaAccountNumber.length > 10) {
      this.easypaisaAccountNumber = this.easypaisaAccountNumber.substring(0, 10);
    }
  }

  onHBLInput(): void {
    this.hblAccountNumber = this.hblAccountNumber.replace(/\D/g, '');
    
    if (this.hblAccountNumber.length > 16) {
      this.hblAccountNumber = this.hblAccountNumber.substring(0, 16);
    }
  }
}