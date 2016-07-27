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
    
    selector: 'lista-temas',
    directives: [ROUTER_DIRECTIVES],
    template: `<div class="temas--container" id="temas--container"> <a class="temas--lista--fechar" onclick="document.getElementById('temas--container').classList.remove('temas-container--move');"><i aria-hidden="true" class="fa fa-times"></i></a> <a *ngfor="let tema of temas" [routerlink]="['/', idioma, '/pais/', pais, '/info/', tema.slug]"> {{tema.nome[idioma]}} </a> </div>`,
    styles: [`.temas--container{width:0;overflow:hidden;position:absolute;z-index:2;border-top:1px solid #ccc;border-bottom:1px solid #ccc;background-color:#fff;-webkit-transition:all .5s;transition:all .5s}.temas--container a{display:block;padding:10px;font-size:1.1em;width:250px;text-decoration:none;color:#607D8B}.temas--container a.temas--lista--fechar{width:240px;border-bottom:none;text-align:right;margin-bottom:-29px;padding:5px}.temas-container--move{width:250px;border-right:1px solid #ccc}@media screen and (min-width:48em){.temas--container{width:100%;position:relative;margin-left:0;border:none}.temas--container a.temas--lista--fechar{display:none}}`]
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
