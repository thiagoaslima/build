import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { RootComponent } from './root.component';
import { EstadosComponent } from './localidades/estados.component';
import { PesquisasComponent } from './pesquisas/pesquisas.component';

import { LocalidadeModule } from './localidades/localidades.module';

import { RootRoutes } from './root.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    RouterModule.forRoot(RootRoutes),
    LocalidadeModule
  ],
  declarations: [
    RootComponent,
    PesquisasComponent
  ],
  bootstrap: [RootComponent],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class RootModule { }