import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  sidebarVisible: boolean = false;

  currentDate: string;

  constructor(private router: Router) {
    const date = new Date();
    this.currentDate = date.toDateString();

  }

  logout() {
    localStorage.clear();
    //window.location.reload()
    this.router.navigate(['/home']); // Redirect to login page
    console.log('Logout');
  }

}