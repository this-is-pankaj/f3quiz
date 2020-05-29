import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'f3q';
  constructor() { }

  private getUserInfo() {
    let that  = this,
      info = localStorage.getItem(that.storageKey);
    try{
      return JSON.parse(info);
    }
    catch(exc){
      return info;
    }
  }

  public getUserId(){
    try{
      let info  = this.getUserInfo();
      return info.id;
    }
    catch(exc){
      return false;
    }
  }

  public getUserRole() {
    try{
      let info  = this.getUserInfo();
      return info.role;
    }
    catch(exc){
      return false;
    }
  }

  public setUserInfo(info) {
    try{
      localStorage.setItem(this.storageKey, JSON.stringify(info));
    }
    catch(exc){
      console.info(`Unable to save info ${exc}`);
    }
  }
}
