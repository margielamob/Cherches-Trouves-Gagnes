import { Component, OnInit } from '@angular/core';
import { User } from '@app/interfaces/user';
import { UserControllerService } from '@app/services/user-controller/user-controller.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profil-information',
  templateUrl: './user-profil-information.component.html',
  styleUrls: ['./user-profil-information.component.scss']
})
export class UserProfilInformationComponent implements OnInit {
  users$ = new Subscription();
  users: User[] = [];
  currentUserId: string;
  userAvatar: string;
  
  constructor(private userControllerService: UserControllerService) { }

  ngOnInit(): void {
    this.users$ = this.userControllerService.getUserObservable().subscribe((usersFound) => {
      this.users = usersFound;
    });
    this.setUserAvatar();
  }

  setUserAvatar() {
    this.userControllerService.userService.getImageOfSignedUser("ZDGkOh1uWxUDhp6q9p3NR8u4Zil2").subscribe((url) => {
      console.log('url: ', url);
      this.userAvatar = url;
    });
  }

  editAvatar() {
    console.log('edit avatar')
  }

}
