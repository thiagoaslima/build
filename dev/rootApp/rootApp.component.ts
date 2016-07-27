import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'root-app',
  directives: [ROUTER_DIRECTIVES],
  template: `
    <!--
    <nav>
      <a [routerLink]="['/']">Root</a>
      <a [routerLink]="['/component-one']">Component One</a>
      <a [routerLink]="['paises']">Paises</a>
    </nav>
    -->
    <router-outlet></router-outlet>
  `
})
export class RootAppComponent { }