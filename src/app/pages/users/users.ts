
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
  newUser = { firstName: '', lastName: '', email: '', username: '' };
  editingUser: any = null;

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

  addUser(): void {
    if (
      !this.newUser.firstName ||
      !this.newUser.lastName ||
      !this.newUser.email ||
      !this.newUser.username
    ) {
      return;
    }

    this.api.addUser(this.newUser).subscribe({
      next: (createdUser: any) => {
        const user = {
          ...createdUser,
          id: Number(createdUser?.id ?? this.nextLocalUserId++)
        };

        this.users = [...this.users, user];
        this.newUser = { firstName: '', lastName: '', email: '', username: '' };
        this.cdr.detectChanges();
      },
      error: () => {
        const fallbackUser = {
          ...this.newUser,
          id: Number(this.nextLocalUserId++)
        };

        this.users = [...this.users, fallbackUser];
        this.newUser = { firstName: '', lastName: '', email: '', username: '' };
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(user: any): void {
  this.editingUser = user; 
}

  saveUser(): void {
    if (!this.editingUser) return;

    const id = Number(this.editingUser.id);

    // API user
    if (id < 100000) {
      this.api.updateUser(id, this.editingUser).subscribe(updatedUser => {
        this.users = this.users.map(u =>
          Number(u.id) === id ? updatedUser : u
        );
        this.editingUser = null;
        this.cdr.detectChanges();
      });
      return;
    }

    this.users = this.users.map(u =>
      Number(u.id) === id ? { ...this.editingUser } : u
    );

    this.editingUser = null;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  deleteUser(id: number): void {
    const numericId = Number(id);

    this.users = this.users.filter(u => Number(u.id) !== numericId);
    this.cdr.detectChanges();

    if (numericId < 100000) {
      this.api.deleteUser(numericId).subscribe();
    }
  }
}
