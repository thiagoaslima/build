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
    template: `<div class="temas--container" id="temas--container"> <a class="temas--lista--fechar" onclick="document.getElementById('temas--container').classList.remove('temas-container--move');"><i aria-hidden="true" class="fa fa-times"></i></a> <a *ngFor="let tema of temas" [routerLink]="['/', idioma, '/pais/', pais, '/info/', tema.slug]"> {{tema.nome[idioma]}} </a> </div>`,
    styles: [`.temas--container{width:0;overflow:hidden;position:absolute;z-index:2;border-top:1px solid #ccc;border-bottom:1px solid #ccc;background-color:#fff;-webkit-transition:all .5s;transition:all .5s}.temas--container a{display:block;padding:10px;font-size:1.1em;width:250px;text-decoration:none;color:#607D8B}.temas--container a.temas--lista--fechar{width:240px;border-bottom:none;text-align:right;margin-bottom:-29px;padding:5px}.temas-container--move{width:250px;border-right:1px solid #ccc}@media screen and (min-width:48em){.temas--container{width:100%;position:relative;margin-left:0;border:none}.temas--container a.temas--lista--fechar{display:none}}`]
})
export class ListaTemasComponent {
    @Input() temas: Tema[];
    @Input() idioma: string;
    @Input() pais: string;

    constructor() {}
}




@Component({
    
    selector: 'info-pais',
    directives: [ListaTemasComponent, ROUTER_DIRECTIVES],
    template: `<div class="layout--cardpais--boxexternal"> <div class="layout--cardpais--boxinternal"> <div class="layout--pais--titulo"> <img [src]="getBandeiraSrc()" class="layout--bandeira--mini"> <h2 class="pais--titulo">{{nomePais}}</h2> </div> <div class="pure-g"> <div class="pure-u-1-1 pure-u-md-1-4"> <div class="layout--pais--box-temas"> <div class="layout--bandeira--container"> <img [src]="getBandeiraSrc()" class="layout--bandeira"> </div> <lista-temas [idioma]="siglaIdioma" [pais]="slugPais" [temas]="temas"></lista-temas> </div> </div> <div class="pure-u-1-1 pure-u-md-3-4"> <div class="layout--pais--box-dados"> <router-outlet></router-outlet> </div> </div> </div> </div> </div>`,
    styles: [`.layout--cardpais--boxexternal{width:100%;top:10px;position:relative;z-index:1}.layout--cardpais--boxinternal{background-color:#fff;width:96%;margin:0 auto;box-shadow:0 2px 10px 1px rgba(0,0,0,.5)}.layout--pais--titulo{padding:10px}.pais--titulo{padding-left:10px;margin:0;display:inline}.layout--bandeira--container{width:100%;background-color:#ccc;margin:15px 0;display:none}.layout--bandeira--mini{display:inline-block;height:18px;width:auto}.layout--bandeira{width:100%;height:auto;max-width:450px;display:block;margin:0 auto}.layout--pais--box-dados,.layout--pais--box-temas{width:100%}@media screen and (min-width:48em){.layout--bandeira--container{width:auto;padding:0 15px;background-color:#fff;display:block}.layout--bandeira--mini{display:none}}`]/*,
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
