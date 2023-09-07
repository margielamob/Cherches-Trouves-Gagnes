import { Injectable } from '@angular/core';
import { User } from '@app/interfaces/user';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {
  allUsersObservable = new Observable<User[]>();

  constructor(public userService: UserService) {
    this.allUsersObservable = this.userService.getUsers();
  }

    // Renvoie l'observable users
    getUserObservable() {
      return this.allUsersObservable;
    }
}
