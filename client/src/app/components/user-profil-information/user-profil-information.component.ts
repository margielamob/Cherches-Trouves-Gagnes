import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '@app/interfaces/user';
import { ImageUploadService } from '@app/services/image-upload/image-upload.service';
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
  @ViewChild('fileInput') fileInput: ElementRef;
  
  constructor(private userControllerService: UserControllerService, private imageUploadService : ImageUploadService) { }

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
    this.fileInput.nativeElement.click();

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // Check if the selected file is a valid image (JPG or PNG)
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        // You can now upload the file to your server or perform any other actions
        console.log('File selected:', file);
        this.imageUploadService.uploadImage(file, "ZDGkOh1uWxUDhp6q9p3NR8u4Zil2");
      } else {
        // Invalid file type
        console.error('Invalid file type. Please select a JPG or PNG file.');
      }
    }
  }

}
