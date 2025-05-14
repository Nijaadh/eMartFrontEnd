import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  fetchingUser: any[] = []; // For fetchingUser

  constructor(private userService:UserService){}
  ngOnInit() {
      this.items = [
          { label: 'EMart' }, 
          { label: 'Admin' }, 
          { label: 'User' }
      ];
    
      this.home = { icon: 'pi pi-slack', routerLink: '/admin/dash' };

      this.fetchAllUser();
      console.log("shanuka")
      console.log(this.fetchingUser)
  }

  fetchAllUser(): void {
    this.userService.getAllUser().subscribe(data => {
      // Assuming data.payload contains the array of users
      this.fetchingUser = data.payload.map((user: any) => {
        console.log(user);
        return {
          ...user,
          image: user.image ? 'data:image/png;base64,' + user.image : '' // Convert base64 to image URL
        };
      });
    },

  );
  }
}
