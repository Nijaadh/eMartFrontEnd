import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GiftBoxService } from '../../../services/gift-box.service';
import { StripeService } from '../../../services/stripe.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private stripe: any;
  private elements: any;
  private card: any;
  amount: number = 2000; // Example amount
  clientSecret: string = 'your-client-secret';
  giftBoxID: any;

  constructor(
    private stripeService: StripeService,
    private giftBoxservice: GiftBoxService,
    private router:Router,
    private messageService: MessageService,
  ) {

  }

  async ngOnInit() {
    this.giftBoxID = localStorage.getItem('giftBoxID');
    const priceFromStorage = localStorage.getItem('giftBoxPrice');
    if (priceFromStorage !== null) {
      this.amount = parseInt(priceFromStorage);
    } else {
      console.log('No giftBoxPrice found in localStorage.');
    }
    console.log("ID" + this.giftBoxID);
    console.log("PRICE" + this.amount);

    this.stripe = await loadStripe('pk_test_51PzFfeFoTp81ofWkg2JjvjfPhCy0lCbKkMWMJ1bUp2tRqcGuq9bo20r6vbMCMPiJMcb1qLUMG9PFPCp70M1Nx9uw007sAbMw3d');
    this.elements = this.stripe.elements();

    this.card = this.elements.create('card');
    this.card.mount('#card-element');
    // this.initializeStripe();
  }

  async pay() {
    try {
      const paymentIntentResponse = await this.stripeService.createPaymentIntent(this.amount).toPromise();

      // Ensure paymentIntentResponse is defined and has clientSecret
      if (paymentIntentResponse && paymentIntentResponse.clientSecret) {
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(paymentIntentResponse.clientSecret, {
          payment_method: {
            card: this.card
          }
        });

        if (error) {
          console.error('Payment failed:', error.message);
          this.paymentFaildMsg();
        } else if (paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded!');

          const gift = {
            id: this.giftBoxID,
            paymentStatus: "PAID"
          }
          this.giftBoxservice.updatePayment(gift).subscribe((response) => {
            console.log('Paid  succeeded!');
            this.router.navigate(['/success']);
          }, (error) => {
            console.log("ERROR PAID  :: " + error)
            this.paymentFaildMsg();
          })


        }
      } else {
        console.error('Failed to retrieve clientSecret.');
        this.paymentFaildMsg();
      }
    } catch (error) {
      console.error('An error occurred:', error);
      this.showErrorMsg();
    }
  }

  paymentFaildMsg() {
    this.messageService.add({ severity: 'error', summary: 'error', detail: 'Payment Failed!' });
  }
  
  showErrorMsg() {
    this.messageService.add({ severity: 'info', summary: 'info', detail: 'An error occurred ! ' });
  }

}
