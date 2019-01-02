import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app/app.component';
import {HelloComponent} from './hello/hello.component';
import {WebsocketComponent} from './websocket/websocket.component';
import {HttpClientModule} from '@angular/common/http';
import {AlertModule, ButtonsModule, ModalModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule, MatCardModule, MatListModule, MatDividerModule} from '@angular/material';
import {RabbitmqComponent} from './rabbitmq/rabbitmq.component';

@NgModule({
  declarations: [
    RabbitmqComponent,
    WebsocketComponent,
    HelloComponent,
    AppComponent
  ],
  imports: [
    MatDividerModule,
    MatListModule,
    MatCardModule,
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
    RabbitmqComponent,
    WebsocketComponent,
    HelloComponent
  ]
})
export class AppModule { }
