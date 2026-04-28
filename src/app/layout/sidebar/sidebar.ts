
import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, Router, RouterLinkActive , NavigationStart} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Output() sidebarToggled = new EventEmitter<boolean>();
  isSidebarOpen = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeSidebar();
      }
    });

  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    this.sidebarToggled.emit(false);
  }

  logout(): void {
    this.auth.logout();
    this.isSidebarOpen = false;
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}