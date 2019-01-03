import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styles: [
    '.mat-list-item { height: 100% }',
    '.divider { border-bottom: 1px solid rgba(0,0,0,.12); }',
    '.divider:nth-last-child(1) { border-bottom: none; padding: 0; }'
  ]
})
export class WebsocketComponent {
  private url = environment.apiUrl;
  private websocketClient: any;
  public messages: string[] = [];

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close');
  }

  showErrorMessage(message: string) {
    this.setConnected(false);
    this.openSnackBar(message);
  }

  connect() {
    this.setConnected(true);
    const ws = new SockJS(this.url + '/websocket');
    this.websocketClient = Stomp.over(ws);
    const that = this;
    this.websocketClient.connect({}, function() {
      that.websocketClient.subscribe('/topic/error', res => {
        const body = JSON.parse(res.body);
        that.showErrorMessage(body.data);
      });
      that.websocketClient.subscribe('/topic/reply', res => {
        const body = JSON.parse(res.body);
        that.messages.push(body.data);
      });
    }, function (error) {
      that.showErrorMessage(error);
    });
  }

  disconnect() {
    if (this.websocketClient != null) {
      this.websocketClient.ws.close();
    }
    this.setConnected(false);
  }

  sendMessage(message) {
    if (this.websocketClient == null) {
      this.openSnackBar('Publisher is not online!');
    } else if (message == null || message === '') {
      this.openSnackBar('Message cannot be empty!');
    } else {
      this.websocketClient.send('/sendMessage', {}, message);
      $('#message').val('');
    }
  }

  setConnected(connected) {
    if (connected) {
      $('#connect').attr('disabled', 'disabled');
      $('#disconnect').removeAttr('disabled');
    } else {
      $('#connect').removeAttr('disabled');
      $('#disconnect').attr('disabled', 'disabled');
    }
  }
}
