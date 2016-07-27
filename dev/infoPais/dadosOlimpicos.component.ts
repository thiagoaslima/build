import { Component, OnInit } from '@angular/core';

import { DadosOlimpicosService } from './dadosOlimpicos.service';
import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';
import { Pais, LocalService } from '../locais/locais.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skipWhile';

@Component({
    moduleId: __moduleName,
    selector: 'mostrar-indicadores',
    //templateUrl: 'indicadores.template.html',
    providers: [DadosOlimpicosService],
    styleUrls: ['indicadores.styles.css'],
    template: `
        <div class="temas--tema-selecionado--container">
    <a onclick="document.getElementById('temas--container').classList.add('temas-container--move');"><i class="fa fa-chevron-left temas--temamenu-arrow" aria-hidden="true"></i></a>
    <h3 class="temas--tema-selecionado">{{tema}}</h3>
</div>

<div class="dados--container">
    <ul class="dados--ul">

        <li>

            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-2 dados--tabela--indicador">
                    Primeira participação
                </div>
                <div class="pure-u-1-3 pure-u-md-1-4">
                    <div class="dados--tabela--valor">
                        <span>{{dados.primeira_participacao}}</span>
                    </div>
                </div>
                <div class="pure-u-2-3 pure-u-md-1-4 dados--tabela--unidade">

                </div>
            </div>

        </li>
        <li>

            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-2 dados--tabela--indicador">
                    Última participação
                </div>
                <div class="pure-u-1-3 pure-u-md-1-4">
                    <div class="dados--tabela--valor">
                        <span>{{dados.ultima_participacao}}</span>
                    </div>
                </div>
                <div class="pure-u-2-3 pure-u-md-1-4 dados--tabela--unidade">

                </div>
            </div>

        </li>
        <li>

            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-2 dados--tabela--indicador">
                    Participantes
                </div>
                <div class="pure-u-1-3 pure-u-md-1-4">
                    <div class="dados--tabela--valor">
                        <span>{{dados.participantes}}</span>
                    </div>
                </div>
                <div class="pure-u-2-3 pure-u-md-1-4 dados--tabela--unidade">
                    atletas
                </div>
            </div>

</li>
        <li>

            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-2 dados--tabela--indicador">
                    Modalidades disputadas
                </div>
                <div class="pure-u-1-3 pure-u-md-1-4">
                    <div class="dados--tabela--valor">
                        <span>{{dados.modalidades}}</span>
                    </div>
                </div>
                <div class="pure-u-2-3 pure-u-md-1-4 dados--tabela--unidade">
                    atletas
                </div>
            </div>

</li>
        <li>
            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-2 dados--tabela--indicador">
                    Medalhas
                </div>
                <div class="pure-u-1-3 pure-u-md-1-4">
                    <div class="dados--tabela--valor">
                        <span>{{dados.ouro}} de ouro</span>
                    </div>
                    <div class="dados--tabela--valor">
                        <span>{{dados.prata}} de prata</span>
                    </div>
                    <div class="dados--tabela--valor">
                        <span>{{dados.bronze}} de bronze</span>
                    </div>
                    <div class="dados--tabela--valor">
                        <span>{{dados.total}} no total</span>
                    </div>
                </div>
            </div>

        </li>
    </ul>
</div>
    `
})
export class DadosOlimpicosComponent implements OnInit {
    idiomaSigla: IdiomaSigla;
    siglaPais: string;
    tema: string;
    dados = {};


    constructor(private _idiomaService: IdiomaService,
        private _localService: LocalService,
        private _infoService: DadosOlimpicosService) { }

    ngOnInit() {
        const idioma$ = this._idiomaService.selecionado
            .skipWhile(value => !value)
             .subscribe(idioma => {this.idiomaSigla = idioma.sigla;});
        const pais$ = this._localService.localSelecionado.pais;
        const dados$ = pais$.switchMap(pais => this._infoService.getDados(pais.sigla));

        pais$.subscribe(pais => this.siglaPais = pais.sigla);
        dados$.subscribe(dados => {debugger; this.dados = dados.dadosOlimpicos});

    }
}