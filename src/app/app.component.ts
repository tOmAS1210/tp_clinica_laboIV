import {
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<re-captcha
    (resolved)="resolved($event)"
    siteKey="YOUR_SITE_KEY"
  ></re-captcha>`,
})
export class AppComponent implements OnInit {
  title = 'tp2';
  precio = 2000;
  fecha = new Date();
  texto = 'hola mundo';

  datos = {
    title: this.title,
    precio: this.precio,
    fecha: this.fecha,
  };

  constructor() {}

  ngOnInit(): void {
    // this.usuario = this.userService.getUsuarioPersistente();
    // console.log('Usuario actual: ', this.usuario);
  }
}
