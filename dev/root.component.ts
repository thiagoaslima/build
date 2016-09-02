import { Component } from '@angular/core';

@Component({
  selector: 'root',
  template: `
    <h1>Teste</h1>
    <a routerLink="/estados/rio-de-janeiro">Estado</a>
    <a routerLink="/pesquisas/censo">Pesquisa</a>
    <router-outlet></router-outlet>`
})

export class RootComponent { }
