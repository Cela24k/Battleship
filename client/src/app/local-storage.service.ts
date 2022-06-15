import { Injectable } from '@angular/core';
import jwtdecode from 'jwt-decode';

interface Token{
  id : string;
  username: string,
  role: number,
  email: string,
  _id: string
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private token;
  constructor() { this.token = localStorage.getItem('token') }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
    this.token = value;
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  getId(){
    if(this.token)
      return (jwtdecode(this.token )as Token)._id;
    return 'no jwt stored';
  }

  getUsername(){
    if(this.token)
      return (jwtdecode(this.token )as Token).username;
    return 'no jwt stored';
  }

  getEmail(){
    if(this.token)
      return (jwtdecode(this.token )as Token).email;
    return 'no jwt stored';
  }

  getRole(){
    if(this.token)
      return (jwtdecode(this.token )as Token).role;
    return 'no jwt stored';
  }
}
