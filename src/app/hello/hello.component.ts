import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {
  title = 'Hello, Angular.';
  url = 'http://35.187.159.0/api';
  code: string;
  message: string;
  data: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(this.url + '/hello').subscribe((res: any) => {
      this.code = res.code;
      this.message = res.message;
      this.data = res.data;
    });
  }

  public addCount() {
    this.http.get(this.url + '/count/add').subscribe((res: any) => {
      this.code = res.code;
      this.message = res.message;
      this.data = res.data;
    });
  }
}
