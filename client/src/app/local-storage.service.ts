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
  constructor() {  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  getToken(): string | null{
    return localStorage.getItem('token')
  }

  getId(){
    const token = this.getToken();
    if(token)
      return (jwtdecode(token )as Token)._id;
    return 'no jwt stored';
  }

  getUsername(){
    const token = this.getToken();
    if(token)
      return (jwtdecode(token )as Token).username;
    return 'no jwt stored';
  }

  getEmail(){
    const token = this.getToken();
    if(token)
      return (jwtdecode(token )as Token).email;
    return 'no jwt stored';
  }

  getRole(){
    const token = this.getToken();
    if(token)
      return (jwtdecode(token )as Token).role;
    return 'no jwt stored';
  }

  logoOut(){
    this.remove('token');
  }
}
