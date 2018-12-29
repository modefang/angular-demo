import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-rabbitmq',
  templateUrl: './rabbitmq.component.html'
})
export class RabbitmqComponent {
  private publisherUrl = environment.apiUrl;
  private publisherClient: any;
  private consumerUrl = 'http://localhost:8090';
  private consumerClient: any;
  public helloPublisher: string[] = [];
  public helloConsumer: string[] = [];

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

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
        that.helloPublisher.push(res.body);
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
        that.helloConsumer.push(res.body);
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
