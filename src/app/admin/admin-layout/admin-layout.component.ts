import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN_MENU, USER_MENU } from '../menu/menu';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  sidebarVisible: boolean = false;
  menuList: { path: string; icon: string; label: string }[] = [];

  currentDate: string;

  constructor(private router: Router) {
    const date = new Date();
    this.currentDate = date.toDateString();
  }
  ngOnInit(): void {
    let userRole = localStorage.getItem('role');
    this.menuList = userRole === 'Admin' ? ADMIN_MENU : USER_MENU;
  }

  logout() {
    localStorage.clear();
    //window.location.reload()
    this.router.navigate(['/home']); // Redirect to login page
    console.log('Logout');
  }
}
