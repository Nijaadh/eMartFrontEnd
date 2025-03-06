import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-services',
  templateUrl: './terms-and-services.component.html',
  styleUrl: './terms-and-services.component.scss'
})
export class TermsAndServicesComponent implements OnInit {
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('giftBoxID');
      localStorage.removeItem('giftBoxPrice');
    }
  }

}
