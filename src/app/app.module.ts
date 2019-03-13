import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './core/material.module';

import { AppComponent } from './app.component';
import { TabataComponent } from './tabata/tabata.component';

// shared
import { DialogComponent } from './shared/component/index';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    TabataComponent,
    DialogComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase), // init
    AngularFireDatabaseModule, // add realtime DB module
    AngularFireStorageModule, // add cloudstore DB module
    AngularFireAuthModule, // add auth module
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogComponent,
  ]
})
export class AppModule { }
