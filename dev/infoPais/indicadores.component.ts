import { Component, OnInit } from '@angular/core';

import { InfoPaisService, Tema, Indicador, dadoBilingue } from './infoPais.service';
import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';
import { Pais, LocalService } from '../locais/locais.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skipWhile';

@Component({
    moduleId: __moduleName,
    selector: 'mostrar-indicadores',
    templateUrl: 'indicadores.template.html',
    styleUrls: ['indicadores.styles.css']
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