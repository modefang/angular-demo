import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app/app.component';
import { HelloComponent } from './hello/hello.component';
import { HttpClientModule } from '@angular/common/http';
import {AlertModule, ButtonsModule, ModalModule} from 'ngx-bootstrap';
import {WebsocketComponent} from './websocket/websocket.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material';

@NgModule({
  declarations: [
    WebsocketComponent,
    HelloComponent,
    AppComponent
  ],
  imports: [
    MatSnackBarModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [
    WebsocketComponent,
    HelloComponent
  ]
})
export class AppModule { }
