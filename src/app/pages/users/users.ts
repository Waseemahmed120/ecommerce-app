
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './users.html',
})

export class Users implements OnInit {

  users: any[] = [];

  formUser = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  };

  isEditMode = false;
  private nextLocalUserId = 100000;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.api.getUsers().subscribe(res => {
      this.users = [...res];
      this.cdr.detectChanges();
    });
  }

  /* ---------- ADD OR SAVE ---------- */
  submitUser(): void {
    if (!this.formUser.firstName || !this.formUser.lastName) return;

    if (this.isEditMode) {
      this.saveUser();
    } else {
      this.addUser();
    }
  }

  /* ---------- ADD ---------- */
  addUser(): void {
    this.api.addUser(this.formUser).subscribe({
      next: (createdUser: any) => {
        const user = {
          ...createdUser,
          id: Number(createdUser?.id ?? this.nextLocalUserId++)
        };

        this.users = [...this.users, user];
        this.resetForm();
      },
      error: () => {
        const fallbackUser = {
          ...this.formUser,
          id: Number(this.nextLocalUserId++)
        };

        this.users = [...this.users, fallbackUser];
        this.resetForm();
      }
    });
  }

  /* ---------- EDIT ---------- */
  startEdit(user: any): void {
    this.formUser = { ...user };
    this.isEditMode = true;
  }

  saveUser(): void {
    const id = Number(this.formUser.id);

    if (id < 100000) {
      this.api.updateUser(id, this.formUser).subscribe(updatedUser => {
        this.users = this.users.map(u =>
          Number(u.id) === id ? updatedUser : u
        );
        this.resetForm();
      });
      return;
    }

    this.users = this.users.map(u =>
      Number(u.id) === id ? { ...this.formUser } : u
    );

    this.resetForm();
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.formUser = {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      username: ''
    };
    this.isEditMode = false;
    this.cdr.detectChanges();
  }

  deleteUser(id: number): void {
    const numericId = Number(id);
    this.users = this.users.filter(u => Number(u.id) !== numericId);

    if (numericId < 100000) {
      this.api.deleteUser(numericId).subscribe();
    }
  }
}