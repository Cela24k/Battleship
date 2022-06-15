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
  private token= '';
  constructor() { }
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
    return (jwtdecode(this.token )as Token)._id;
  }

  getUsername(){
    return (jwtdecode(this.token )as Token).username;
  }

  getEmail(){
    return (jwtdecode(this.token )as Token).email;
  }

  getRole(){
    return (jwtdecode(this.token )as Token).role;
  }
}
