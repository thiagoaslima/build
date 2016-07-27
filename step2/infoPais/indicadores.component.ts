import { Component, OnInit } from '@angular/core';

import { InfoPaisService, Tema, Indicador, dadoBilingue } from './infoPais.service';
import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';
import { Pais, LocalService } from '../locais/locais.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skipWhile';

@Component({
    
    selector: 'mostrar-indicadores',
    template: `<div class="temas--tema-selecionado--container"> <a onclick="document.getElementById('temas--container').classList.add('temas-container--move');"><i aria-hidden="true" class="fa fa-chevron-left temas--temamenu-arrow"></i></a> <h3 class="temas--tema-selecionado">{{tema}}</h3> </div> <div class="dados--container"> <ul class="dados--ul"> <li *ngfor="let indicador of indicadores"> <div class="pure-g" *ngif="indicador.valores.porPais[siglaPais]"> <div class="dados--tabela--indicador pure-u-1 pure-u-md-1-2"> {{indicador.nome[idiomaSigla]}} </div> <div class="pure-u-md-1-4 pure-u-1-3"> <div class="dados--tabela--valor"> <span> {{indicador.valores.porPais[siglaPais].valor[idiomaSigla]}} </span> </div> </div> <div class="pure-u-md-1-4 dados--tabela--unidade pure-u-2-3"> {{indicador.unidade.nome[idiomaSigla]}} </div> </div> </li> </ul> </div>`,
    styles: [`.dados--ul{font-size:.9em;list-style-type:none;padding:0;margin:0}.dados--ul li{border-top:1px solid #CFD8DC;padding:10px;margin:0}.dados--tabela--indicador{padding-bottom:12px}.temas--tema-selecionado,.temas--temamenu-arrow{display:inline-block;margin:0;padding:0}.temas--tema-selecionado--container{border-top:1px solid #CFD8DC;padding:5px}@media screen and (min-width:48em){.temas--tema-selecionado--container{border-bottom:1px solid #CFD8DC;border-top:none;padding:15px 0 0}.dados--ul{padding-top:10px}.dados--tabela--indicador{padding-bottom:0}.dados--tabela--valor{text-align:right;padding:0 5px}.dados--ul li{border-bottom:1px solid #CFD8DC;border-top:none;padding:10px;margin:0}.temas--temamenu-arrow{display:none}}`]
    /*
    template: `
        <!--
        <p *ngFor="let indicador of indicadores">
            {{indicador.nome[idiomaSigla]}}
        </p>
        -->
    `*/
})
export class IndicadoresComponent implements OnInit {
    idiomaSigla: IdiomaSigla;
    siglaPais: string;
    tema: string;
    indicadores: Indicador[];


    constructor(private _idiomaService: IdiomaService,
        private _localService: LocalService,
        private _infoService: InfoPaisService) { }

    ngOnInit() {
        const idioma$ = this._idiomaService.selecionado.skipWhile(value => !value);
        const tema$ = this._infoService.tema$.skipWhile(value => !value);
        const pais$ = this._localService.localSelecionado.pais;
        const valores$ = pais$.combineLatest(tema$).switchMap(([pais, tema]) => this._infoService.updateValorePais(pais.sigla));
        const indicadores$ = tema$.combineLatest(idioma$, valores$).switchMap(([tema, idioma, valores]) => {
            return this._infoService.getIndicadores( tema.indicadores[idioma.sigla].map((ind: Indicador) => ind.id) )
                .zip(pais$, (indicadores, pais) => {
                    return indicadores.filter(indicador => indicador.valores.porPais[pais.sigla]);
                });
        });
        const all$ = indicadores$.combineLatest(idioma$, tema$);

        pais$.subscribe(pais => this.siglaPais = pais.sigla);

        all$
        .subscribe(([indicadores, idioma, tema]) => {
            this.idiomaSigla = idioma.sigla;
            this.tema = tema.nome[idioma.sigla];
            this.indicadores = indicadores;
        });
    }
}