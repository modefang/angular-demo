import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html'
})
export class WebsocketComponent {
  private url = environment.apiUrl;
  private websocketClient: any;
  public messages: string[] = [];

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close');
  }

  connect() {
    this.setConnected(true);
    const ws = new SockJS(this.url + '/websocket');
    this.websocketClient = Stomp.over(ws);
    const that = this;
    this.websocketClient.connect({}, function() {
      that.websocketClient.subscribe('/topic/reply', res => {
        const body = JSON.parse(res.body);
        that.messages.push(body.data);
      });
      that.websocketClient.subscribe('/websocket/error', res => {
        that.setConnected(false);
        that.openSnackBar(res.body);
      });
    });
  }

  disconnect() {
    if (this.websocketClient != null) {
      this.websocketClient.ws.close();
    }
    this.setConnected(false);
  }

  sendMessage(message) {
    if (this.websocketClient != null) {
      this.websocketClient.send('/sendMessage', {}, message);
      $('#message').val('');
    }
    this.openSnackBar('publisher is not online!');
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
