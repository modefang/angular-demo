import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-rabbitmq',
  templateUrl: './rabbitmq.component.html',
  styles: [
    '.mat-list-item { height: 100% }',
    '.divider { border-bottom: 1px solid rgba(0,0,0,.12); }',
    '.divider:nth-last-child(1) { border-bottom: none; padding: 0; }'
  ]
})
export class RabbitmqComponent {
  private publisherUrl = environment.apiUrl;
  private consumerUrl = environment.consumerApiUrl;
  private publisherClient: any;
  private consumerClient: any;
  public messages = [
    [
      { desc: 'hello', publisherMessages: [], consumerMessages: [] },
      { desc: 'object', publisherMessages: [], consumerMessages: [] }
    ],
    [
      { desc: 'manyToMany', publisherMessages: [], consumerMessages: [] },
      { desc: 'topic', publisherMessages: [], consumerMessages: [] }
    ],
    [
      { desc: 'fanout', publisherMessages: [], consumerMessages: [] },
      { desc: 'callback', publisherMessages: [], consumerMessages: [] }
    ]
  ];

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close');
  }

  showErrorMessage(message: string) {
    this.setConnected(false);
    this.openSnackBar(message);
  }

  connectRabbitmqClient() {
    this.setConnected(true);
    const that = this;
    // publisher
    const publisherWS = new SockJS(this.publisherUrl + '/websocket');
    this.publisherClient = Stomp.over(publisherWS);
    this.publisherClient.connect({}, function() {
      that.publisherClient.subscribe('/topic/error', res => {
        const body = JSON.parse(res.body);
        that.showErrorMessage(body.data);
      });
      that.publisherClient.subscribe('/topic/sendHello', res => {
        that.messages[0][0].publisherMessages.push(res.body);
      });
      that.publisherClient.subscribe('/topic/sendObject', res => {
        that.messages[0][1].publisherMessages.push(res.body);
      });
      that.publisherClient.subscribe('/topic/sendManyToMany', res => {
        that.messages[1][0].publisherMessages.push(res.body);
      });
      that.publisherClient.subscribe('/topic/sendTopic', res => {
        that.messages[1][1].publisherMessages.push(res.body);
      });
      that.publisherClient.subscribe('/topic/sendFanout', res => {
        that.messages[2][0].publisherMessages.push(res.body);
      });
      that.publisherClient.subscribe('/topic/sendCallback', res => {
        that.messages[2][1].publisherMessages.push(res.body);
      });
    }, function (error) {
      that.showErrorMessage(error);
    });
    // consumer
    const consumerWS = new SockJS(this.consumerUrl + '/websocket');
    this.consumerClient = Stomp.over(consumerWS);
    this.consumerClient.connect({}, function() {
      that.publisherClient.subscribe('/topic/error', res => {
        const body = JSON.parse(res.body);
        that.showErrorMessage(body.data);
      });
      that.consumerClient.subscribe('/topic/receiveHello', res => {
        that.messages[0][0].consumerMessages.push(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveObject', res => {
        that.messages[0][1].consumerMessages.push(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveManyToMany', res => {
        that.messages[1][0].consumerMessages.push(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveTopic', res => {
        that.messages[1][1].consumerMessages.push(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveFanout', res => {
        that.messages[2][0].consumerMessages.push(res.body);
      });
      that.consumerClient.subscribe('/topic/receiveCallback', res => {
        that.messages[2][1].consumerMessages.push(res.body);
      });
    }, function (error) {
      that.showErrorMessage(error);
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
    if (this.publisherClient == null) {
      this.openSnackBar('publisher is not online!');
      return;
    }
    this.publisherClient.send('/' + exchange);
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
