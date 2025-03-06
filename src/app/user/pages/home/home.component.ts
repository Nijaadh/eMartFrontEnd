import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

   

    

    ngOnInit(): void {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('giftBoxID');
            localStorage.removeItem('giftBoxPrice');
        }
    }

}
