
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  @ViewChild('userFormCard') userFormCard!: ElementRef;
  users: any[] = [];
  originalApiUsers: any[] = [];

  formUser: {
    id: number | null;
    firstName: string;
    lastName: string;
    email: string;
    // username: string;
  } = {
    id: null,
    firstName: '',
    lastName: '',
    email: ''
    // username: ''
  };

  isEditMode = false;
  private nextLocalUserId = 100000;
  
  formErrors: any = {
    firstName: '',
    lastName: '',
    email: ''
    // username: ''
  };
  
  isFormSubmitted = false;
  formSubmitError = '';
  formSubmitSuccess = '';
  
  showDeleteDialog = false;
  userToDelete: any = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (res: any) => {
        this.originalApiUsers = res.map((user: any) => ({
          ...user,
          id: Number(user.id),
          isLocal: false
        }));
        this.users = [...this.originalApiUsers];
        this.cdr.detectChanges();
      },
      error: () => {
        this.users = [];
        this.originalApiUsers = [];
      }
    });
  }

  scrollToForm(): void {
    setTimeout(() => {
      if (this.userFormCard) {
        this.userFormCard.nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  }

  validateField(fieldName: string): boolean {
    switch (fieldName) {
      case 'firstName':
        if (!this.formUser.firstName?.trim()) {
          this.formErrors.firstName = 'First name is required';
          return false;
        } else if (this.formUser.firstName.length < 2) {
          this.formErrors.firstName = 'First name must be at least 2 characters';
          return false;
        } else if (this.formUser.firstName.length > 50) {
          this.formErrors.firstName = 'First name cannot exceed 50 characters';
          return false;
        } else {
          this.formErrors.firstName = '';
          return true;
        }
        
      case 'lastName':
        if (!this.formUser.lastName?.trim()) {
          this.formErrors.lastName = 'Last name is required';
          return false;
        } else if (this.formUser.lastName.length < 2) {
          this.formErrors.lastName = 'Last name must be at least 2 characters';
          return false;
        } else if (this.formUser.lastName.length > 50) {
          this.formErrors.lastName = 'Last name cannot exceed 50 characters';
          return false;
        } else {
          this.formErrors.lastName = '';
          return true;
        }
        
      case 'email':
        if (this.formUser.email) {
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(this.formUser.email)) {
            this.formErrors.email = 'Please enter a valid email address';
            return false;
          }
        }
        this.formErrors.email = '';
        return true;
        
      // case 'username':
      //   if (this.formUser.username) {
      //     if (this.formUser.username.length < 3) {
      //       this.formErrors.username = 'Username must be at least 3 characters';
      //       return false;
      //     } else if (this.formUser.username.length > 30) {
      //       this.formErrors.username = 'Username cannot exceed 30 characters';
      //       return false;
      //     } else if (!/^[a-zA-Z0-9_]+$/.test(this.formUser.username)) {
      //       this.formErrors.username = 'Username can only contain letters, numbers, and underscores';
      //       return false;
      //     }
      //   }
      //   this.formErrors.username = '';
      //   return true;
        
      default:
        return true;
    }
  }

  validateForm(): boolean {
    const isFirstNameValid = this.validateField('firstName');
    const isLastNameValid = this.validateField('lastName');
    const isEmailValid = this.validateField('email');
    // const isUsernameValid = this.validateField('username');
    return isFirstNameValid && isLastNameValid && isEmailValid ;
  }

  hasFormErrors(): boolean {
    return Object.values(this.formErrors).some((error: any) => error !== '');
  }

  submitUser(): void {
    this.isFormSubmitted = true;
    this.formSubmitError = '';
    this.formSubmitSuccess = '';
    
    if (!this.validateForm()) {
      this.formSubmitError = 'Please correct the errors in the form';
      return;
    }
    
    const isDuplicateEmail = this.users.some(u => 
      u.email?.toLowerCase() === this.formUser.email?.toLowerCase() && 
      u.id !== this.formUser.id
    );
    
    if (isDuplicateEmail && this.formUser.email) {
      this.formSubmitError = 'A user with this email already exists';
      return;
    }

    if (this.isEditMode) {
      this.saveUser();
    } else {
      this.addUser();
    }
  }

  addUser(): void {
    const newLocalUser = {
      firstName: this.formUser.firstName,
      lastName: this.formUser.lastName,
      email: this.formUser.email,
      // username: this.formUser.username,
      id: this.nextLocalUserId++,
      isLocal: true
    };

    this.users = [...this.users, newLocalUser];
    this.formSubmitSuccess = 'User added successfully!';
    this.resetForm();
  }

  startEdit(user: any): void {
    this.formUser = { ...user };
    this.isEditMode = true;
    this.isFormSubmitted = false;
    this.formSubmitError = '';
    this.formSubmitSuccess = '';
    this.clearFormErrors();
    this.scrollToForm();
  }

  saveUser(): void {
    const id = this.formUser.id;

    if (id === null || id === undefined) {
      this.formSubmitError = 'Invalid user ID';
      return;
    }

    const numericId = Number(id);

    this.users = this.users.map(u => 
      u.id === numericId ? { ...u, ...this.formUser, id: numericId } : u
    );
    
    this.formSubmitSuccess = 'User updated successfully!';
    this.resetForm();
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.formUser = { id: null, firstName: '', lastName: '', email: '' };
    this.isEditMode = false;
    this.isFormSubmitted = false;
    this.formSubmitError = '';
    setTimeout(() => { this.formSubmitSuccess = ''; }, 3000);
    this.clearFormErrors();
    this.cdr.detectChanges();
  }
  
  clearFormErrors(): void {
    this.formErrors = { firstName: '', lastName: '', email: ''};
  }

  openDeleteDialog(user: any): void {
    this.userToDelete = user;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;

    const targetId = this.userToDelete.id;

    this.users = this.users.filter(u => u.id !== targetId);

    this.formSubmitSuccess = `${this.userToDelete.firstName} ${this.userToDelete.lastName} deleted successfully`;
    this.closeDeleteDialog();

    setTimeout(() => { this.formSubmitSuccess = ''; }, 3000);
  }

  getUserIndex(user: any): number {
    return this.users.findIndex(u => u.id === user.id) + 1;
  }
}