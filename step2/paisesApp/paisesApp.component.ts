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
    
    selector: 'paises-app',
    template: `<div class="layout--size--fullwidth layout--bgimg--top layout--color--main layout--header"> <div class="layout--size--maxwidth"> <div class="pure-g"> <div class="pure-u-1 layout--size--oneclickheight pure-u-md-3-4"> <div class="pure-g"> <div class="layout--header--centercontent pure-u-3-4 layout--header--hspacer--tit"> <a [routerLink]="['/']"> <img class="layout--img--titulopaises--m" src="images/paises-olimpicos-titulo-m.png"> <img class="layout--img--titulopaises--d" src="images/paises-olimpicos-titulo-d.png"> </a> </div> <div class="pure-u-1-4 layout--header--hspacer--log"> <a href="http://www.ibge.gov.br/" target="_blank"> <img class="layout--img--logoibge--m" src="images/ibge-logo-m.png"> <img class="layout--img--logoibge--d" src="images/ibge-logo-d.png"> </a> </div> </div> </div> <div class="pure-u-1 layout--size--oneclickheight layout--color--main--nav pure-u-md-1-4"> <nav> <div class="pure-g"> <div class="layout--header--centercontent pure-u-3-4 layout--header--hspacer--sel"> <seletor-local [continentes]="continentes | async" [idioma]="idioma | async" [selecionado]="paisSelecionado | async"></seletor-local> </div> <div class="pure-u-1-4 layout--header--hspacer--idi"> <div> <div class="layout--color--neutral--light layout--ico--language layout--textcolor--main"> <seletor-idioma [lista]="idiomas" [selecionado]="idioma | async" [url]="url"></seletor-idioma> </div> </div> </div> </div> </nav> </div> </div> </div> </div> <div class="pure-g layout--mainbox layout--size--fullwidth"> <div class="pure-u-1 layout--size--maxwidth"> <div class="pure-g"> <div class="pure-u-1 layout--info--desktop"> </div> <div class="pure-u-1 layout--shin--headerspacer layout--size--oneclickheight--2x"> </div> <div class="pure-u-1 layout--maincontentbox"> <main> <router-outlet></router-outlet> </main> </div> <div class="pure-u-1 layout--size--oneclickheight layout--shin--footerspacer"> </div> </div> </div> </div> <div class="layout--size--fullwidth layout--color--accent layout--footer--desktop"> <div class="pure-g layout--size--maxwidth"> <div class="pure-u-1"> <p class="footer--desktop--item"><a href="http://www.ibge.gov.br/" target="_blank">IBGE 2016</a></p> <p class="footer--desktop--item"> <a href="http://www.facebook.com/ibgeoficial" target="_blank"><span class="fa-lg fa-stack"><i class="fa layout--textcolor--neutral--light fa-square-o fa-stack-2x"></i><i class="fa layout--textcolor--neutral--light fa-stack-1x fa-facebook"></i></span></a> <a href="http://twitter.com/ibgecomunica" target="_blank"><span class="fa-lg fa-stack"><i class="fa layout--textcolor--neutral--light fa-square-o fa-stack-2x"></i><i class="fa layout--textcolor--neutral--light fa-stack-1x fa-twitter"></i></span></a> <a href="http://www.youtube.com/ibgeoficial" target="_blank"><span class="fa-lg fa-stack"><i class="fa layout--textcolor--neutral--light fa-square-o fa-stack-2x"></i><i class="fa layout--textcolor--neutral--light fa-stack-1x fa-youtube-play"></i></span></a> <a href="https://www.instagram.com/ibgeoficial/" target="_blank"><span class="fa-lg fa-stack"><i class="fa layout--textcolor--neutral--light fa-square-o fa-stack-2x"></i><i class="fa layout--textcolor--neutral--light fa-stack-1x fa-instagram"></i></span></a> </p> <p class="footer--desktop--item"> <strong>Fontes para dados Olímpicos</strong>: <br><a href="https://www.theguardian.com/sport/series/london-2012-olympics-data" target="_blank">theguardian.com/sport/series/london-2012-olympics-data</a> e <a href="http://www.sports-reference.com/olympics/" target="_blank">sports-reference.com/olympics/</a>, <br>acessados em 21/07/2016. </p> <p>&nbsp;</p> <p>&nbsp;</p> </div> </div> </div> <div class="layout--size--fullwidth layout--color--accent layout--info--mobile"> <div class="pure-g"> <div class="pure-u-1 layout--size--oneclickheight"> <p class="footer--mobile--item"><a href="http://www.ibge.gov.br/" target="_blank">IBGE 2016</a></p> </div> </div> </div>`,
    styles: [``],
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