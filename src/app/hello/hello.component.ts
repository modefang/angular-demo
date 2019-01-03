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
  content = 'no data';
  code: string;
  desc: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(this.url + '/hello').subscribe((res: any) => {
      this.code = res.code;
      this.desc = res.desc;
      if (this.code === '00001') {
        this.content = 'Hello, spring boot. Database count: ' + res.data.databaseCount + '. Redis count: ' + res.data.redisCount;
      }
    });
  }

  public addCount() {
    this.http.get(this.url + '/count/add').subscribe((res: any) => {
      this.code = res.code;
      this.desc = res.desc;
      if (this.code === '00001') {
        this.content = 'Hello, spring boot. Database count: ' + res.data.databaseCount + '. Redis count: ' + res.data.redisCount;
      }
    });
  }
}
