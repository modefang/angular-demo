import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app/app.component';
import { HelloComponent } from './hello/hello.component';
import { HttpClientModule } from '@angular/common/http';
import {AlertModule, ButtonsModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent
  ],
  imports: [
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [
    HelloComponent
  ]
})
export class AppModule { }
