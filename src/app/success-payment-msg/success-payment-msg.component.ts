import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-success-payment-msg',
  templateUrl: './success-payment-msg.component.html',
  styleUrl: './success-payment-msg.component.scss'
})
export class SuccessPaymentMsgComponent {

  constructor(private router:Router){}
  backToHome(){
    this.router.navigate(['/home']);
  }
}
