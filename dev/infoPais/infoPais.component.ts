import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { InfoPaisService, Tema, Indicador, dadoBilingue } from './infoPais.service';
import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';
import { Pais, LocalService } from '../locais/locais.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


@Component({
    moduleId: __moduleName,
    selector: 'lista-temas',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'listaTemas.template.html',
    styleUrls: ['listaTemas.styles.css']
})
export class ListaTemasComponent {
    @Input() temas: Tema[];
    @Input() idioma: string;
    @Input() pais: string;

    constructor() {}
}




@Component({
    moduleId: __moduleName,
    selector: 'info-pais',
    directives: [ListaTemasComponent, ROUTER_DIRECTIVES],
    templateUrl: 'infoPais.template.html',
    styleUrls: ['infoPais.styles.css']/*,
    template: `
        <h1 [ngSwitch]="siglaIdioma">
            <span *ngSwitchCase="'en'">About</span>
            <span *ngSwitchDefault>Sobre</span>
            {{nomePais}}
        </h1>
    
        <a *ngFor="let tema of temas" 
            [routerLink]="['/', siglaIdioma, '/pais/', slugPais, '/info/', tema.slug]">
            {{tema.nome[siglaIdioma]}}
        </a>
        <lista-indicador [indicadores]="indicadores" [idioma]="siglaIdioma"></lista-indicador>   
    `*/
})
export class InfoPaisComponent implements OnInit {
    siglaIdioma: string;
    siglaPais: string;
    nomePais: string;
    slugPais: string;
    temas: Tema[]

    constructor(private _infoService: InfoPaisService,
        private _locaisService: LocalService,
        private _idiomaService: IdiomaService) { }

    ngOnInit() {
        const idioma$ = this._idiomaService.selecionado;
        const pais$ = this._locaisService.localSelecionado.pais;
        const temas$ = this._infoService.getTemas();

        idioma$.subscribe(idioma => this.siglaIdioma = idioma.sigla);

        idioma$.combineLatest(pais$).subscribe(([idioma, pais]) => {
            this.nomePais = pais.nome[idioma.sigla];
            this.slugPais = pais.slug;
            this.siglaPais = pais.sigla;
        })

        temas$.subscribe(temas => this.temas = temas);
    }

    getBandeiraSrc() {
        return `images/bandeiras/${this.siglaPais.toUpperCase()}.gif`;
    }
}
