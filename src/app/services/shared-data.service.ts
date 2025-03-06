import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private data: any;

  constructor() { }

  // Set the data
  setData(data: any) {
    this.data = data;
  }

  // Get the data
  getData() {
    return this.data;
  }
}
