import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-rabbitmq',
  templateUrl: './rabbitmq.component.html'
})
export class RabbitmqComponent {
  private publisherUrl = environment.apiUrl;
  private consumerUrl = 'http://localhost:8090';
  private publisherClient: any;
  private consumerClient: any;
  public messages = [
    [
      { desc: 'hello', publisherMessages: [], consumerMessages: [] },
      { desc: 'object', publisherMessages: [], consumerMessages: [] }
    ]
  ];

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close');
  }

  connectRabbitmqClient() {
    this.setConnected(true);
    const that = this;
    // publisher
    const publisherWS = new SockJS(this.publisherUrl + '/websocket');
    this.publisherClient = Stomp.over(publisherWS);
    this.publisherClient.connect({}, function() {
      that.publisherClient.subscribe('/websocket/error', res => {
        that.setConnected(false);
        that.openSnackBar(res.body);
      });
      that.publisherClient.subscribe('/topic/sendHello', res => {
        that.messages[0][0].publisherMessages.push(res.body);
      });
      that.publisherClient.subscribe('/topic/sendObject', res => {
        that.messages[0][1].publisherMessages.push(res.body);
      });
    });
    // consumer
    const consumerWS = new SockJS(this.consumerUrl + '/websocket');
    this.consumerClient = Stomp.over(consumerWS);
    this.consumerClient.connect({}, function() {
      that.consumerClient.subscribe('/websocket/error', res => {
        that.setConnected(false);
        that.openSnackBar(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveHello', res => {
        that.messages[0][0].consumerMessages.push(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveObject', res => {
        that.messages[0][1].consumerMessages.push(res.body);
      });
    });
  }

  disconnectRabbitmqClient() {
    if (this.publisherClient != null) {
      this.publisherClient.ws.close();
    }
    if (this.consumerClient != null) {
      this.consumerClient.ws.close();
    }
    this.setConnected(false);
  }

  sendRabbitmqMessage(exchange) {
    if (this.publisherClient != null) {
      this.publisherClient.send('/' + exchange);
    }
    this.openSnackBar('publisher is not online!');
  }

  setConnected(connected) {
    if (connected) {
      $('#connectRabbitmqClient').attr('disabled', 'disabled');
      $('#disconnectRabbitmqClient').removeAttr('disabled');
    } else {
      $('#connectRabbitmqClient').removeAttr('disabled');
      $('#disconnectRabbitmqClient').attr('disabled', 'disabled');
    }
  }
}
