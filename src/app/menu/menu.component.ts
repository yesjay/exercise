import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import {
  GoogleAuth2Service,
  DialogService
} from '../shared/service/index';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isVerified = false;
  userName: string;
  userPhotoSrc: string;
  userEmail: string;

  constructor(
    private afAuth: AngularFireAuth,
    private googleAuth2: GoogleAuth2Service,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((userData: firebase.User) => {
      if (userData && userData.emailVerified) {
        this.isVerified = userData.emailVerified;
        this.userName = userData.displayName;
        this.userPhotoSrc = userData.photoURL;
        this.userEmail = userData.email;
      }
    });
  }

  openDialog(dialogType: string, dialogWidth: string) {
    this.dialogService.openDialog(dialogType, dialogWidth);
  }

  login() {
    this.googleAuth2.login();
  }

  logout() {
    this.afAuth.auth.signOut();
    location.reload();
  }
}

