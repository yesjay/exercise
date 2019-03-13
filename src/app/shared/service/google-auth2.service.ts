import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuth2Service {

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.loadAuth2Api();
  }

  loadAuth2Api() {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init(
        {
          client_id: '996603587022-h09eou98jtkmkfuegfr09jukl3eos98f.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/calendar'
        }
      );
    });
  }

  async login() {
    const googleAuth = window.gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    const credential = firebase.auth.GoogleAuthProvider.credential(token);
    await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);


    // Alternative approach, use the Firebase login with scopes and make RESTful API calls
    // const provider = new auth.GoogleAuthProvider()
    // provider.addScope('https://www.googleapis.com/auth/calendar');
    // this.afAuth.auth.signInWithPopup(provider)
  }
}
