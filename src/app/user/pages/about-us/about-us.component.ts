import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: false,
      offset: 120
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
     
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
