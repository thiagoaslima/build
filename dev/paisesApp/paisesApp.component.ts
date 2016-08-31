import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';
import { SeletorIdioma } from '../idioma/seletor-idioma.component';

import { LocalService, Pais, Continente } from '../locais/locais.service';
import { SeletorLocalComponent } from '../locais/seletor-local.component';

/*
@Component({
    selector: 'local-app',
    directives: [SeletorLocalComponent],
    template: `
    LOCAL_APP
        <seletor-local 
            [idioma]="idioma.sigla"
            [continentes]="continentes | async"
            [selecionado]="paisSelecionado | async"
        ></seletor-local>
    `
})
export class LocalAppComponent implements OnInit {
    @Input() idioma: Idioma;
    continentes: Observable<Continente[]>;
    paisSelecionado: Observable<Pais>;

    constructor(private _localService: LocalService) { }

    ngOnInit() {
        this.continentes = this._localService.getContinentes();
        this.paisSelecionado = this._localService.localSelecionado.pais;
    }
}
*/


@Component({
    moduleId: __moduleName,
    selector: 'paises-app',
    templateUrl: 'paisesApp.template.html',
    styleUrls: ['paisesApp.styles.css'],
    directives: [ROUTER_DIRECTIVES, SeletorIdioma, SeletorLocalComponent]
    /*
    template: `
        Paises-App
        <p>pais selecionado: {{pais | async | json}}</p>
        <p>idioma corrente: {{idioma | async | json}}</p>

         <seletor-local 
            [idioma]="idioma | async"
            [continentes]="continentes | async"
            [selecionado]="paisSelecionado | async"
        ></seletor-local>

        <seletor-idioma [selecionado]="idioma | async" [lista]="idiomas" [url]="url"></seletor-idioma>

        <nav>
            <a [routerLink]="['/', siglaIdioma, '/child-one']">Child One</a>
            <a [routerLink]="['/', siglaIdioma, '/child-two']">Child Two</a>
        </nav>

        <router-outlet></router-outlet>
    `
    */
})
export class PaisesAppComponent implements OnInit {
    pais: Observable<Pais>;
    idioma: Observable<Idioma>;
    continentes: Observable<Continente[]>;
    paisSelecionado: Observable<Pais>;

    idiomas: Idioma[];
    siglaIdioma: IdiomaSigla;
    url: string;

    constructor(private _localService: LocalService,
        private _idiomaService: IdiomaService,
        private _router: Router) {
        this.idiomas = this._idiomaService.idiomas;
    }

    ngOnInit() {
        this.continentes = this._localService.getContinentes();
        this.paisSelecionado = this._localService.localSelecionado.pais;


        this.pais = this._localService.localSelecionado.pais;
        this.url = this._router.url;

        this.idioma = this._idiomaService.selecionado.do((idioma: Idioma) => {
            this.siglaIdioma = idioma.sigla;
        });

        this._router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.url = event.url;
            }
        });
    }
}