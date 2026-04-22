// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import { Header } from '../header/header';
// import { Sidebar } from '../sidebar/sidebar';

// @Component({
//   standalone: true,
//   selector: 'app-main-layout',
//   imports: [CommonModule, RouterOutlet, Header, Sidebar],
//   templateUrl: './main-layout.html',
//   styleUrl: './main-layout.css'
// })
// export class MainLayout {
//   isSidebarOpen = false;

//   onSidebarToggle(isOpen: boolean): void {
//     this.isSidebarOpen = isOpen;
//   }
// }









import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  isSidebarOpen = false;
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      this.showHeader = !url.includes('/dashboard/users') && !url.includes('/dashboard/payment');
    });
  }

  onSidebarToggle(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }
}