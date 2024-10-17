import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class HexagonService {
  constructor(private https: HttpClient) {}

  getHexagon() {
    return this.https.get('data.json');
  }
}
