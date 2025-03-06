import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  imagePreviewUrl: string | ArrayBuffer | null = null;
  emailExists: boolean = false;
  unameExists: boolean = false;
  user: any = {
    userName: '',
    address: '',
    email: '',
    tel: '',
    image: '',
    password: ''
  };
  constructor(private userService:UserService, private messageService: MessageService,private router: Router){

  }
  ngOnInit(): void {
    console.log("hi");
  }
  onEmailChange() {
    if (this.user.email) {
      this.userService.checkEmailExists(this.user.email).subscribe(
        (exists: boolean) => {
          this.emailExists = exists;
          if (this.emailExists) {
            console.log('Email already exists');
          } else {
            console.log('Email is available');
          }
        },
        (error) => {
          console.error('Error checking email', error);
        }
      );
    }}

    onUserNameChange() {
      if (this.user.userName) {
        this.userService.checkUserNameExists(this.user.userName).subscribe(
          (exists: boolean) => {
            this.unameExists = exists;
            if (this.unameExists) {
              console.log('Username already exists');
            } else {
              console.log('Username is available');
            }
          },
          (error) => {
            console.error('Error checking Username', error);
          }
        );
      }}

  register() {
    console.log(this.user);
    this.userService.addUser(this.user).subscribe(response =>{
      console.log(response);
      if(response.payload!=null){
        console.log("Successsully"+response.payload);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration Succsessfully' });
        this.router.navigate(['/login']);
      }if(response.errorMessages!=null){
        console.log("REG Fail!!!!"+response.errorMessages);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not register !' });
      }
    });
  }

  // This function is called when an image is selected
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.image = e.target.result.split(',')[1]; // Extract the base64 encoded string
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  }





}
