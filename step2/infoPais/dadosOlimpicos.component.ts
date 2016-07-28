import { Component, OnInit } from '@angular/core';

import { DadosOlimpicosService } from './dadosOlimpicos.service';
import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';
import { Pais, LocalService } from '../locais/locais.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skipWhile';

@Component({
    
    selector: 'mostrar-indicadores',
    //templateUrl: 'indicadores.template.html',
    providers: [DadosOlimpicosService],
    styles: [`.dados--ul{font-size:.9em;list-style-type:none;padding:0;margin:0}.dados--ul li{border-top:1px solid #CFD8DC;padding:10px;margin:0}.dados--tabela--indicador{padding-bottom:12px}.temas--tema-selecionado,.temas--temamenu-arrow{display:inline-block;margin:0;padding:0}.temas--tema-selecionado--container{border-top:1px solid #CFD8DC;padding:5px}@media screen and (min-width:48em){.temas--tema-selecionado--container{border-bottom:1px solid #CFD8DC;border-top:none;padding:15px 0 0}.dados--ul{padding-top:10px}.dados--tabela--indicador{padding-bottom:0}.dados--tabela--valor{text-align:left;padding:0 5px}.dados--ul li{border-bottom:1px solid #CFD8DC;border-top:none;padding:10px;margin:0}.temas--temamenu-arrow{display:none}}`],
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
                        <span>{{dados.participacao?.primeira}}</span>
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
                        <span>{{dados.participacao?.ultima}}</span>
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
                        <span>{{dados.participantes?.valor}}</span>
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
                        <span>{{dados.modalidades?.valor}}</span>
                    </div>
                </div>
                <div class="pure-u-2-3 pure-u-md-1-4 dados--tabela--unidade">
                    esportes
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
                        <span>{{dados.medalhas?.ouro}} de ouro</span>
                    </div>
                    <div class="dados--tabela--valor">
                        <span>{{dados.medalhas?.prata}} de prata</span>
                    </div>
                    <div class="dados--tabela--valor">
                        <span>{{dados.medalhas?.bronze}} de bronze</span>
                    </div>
                    <div class="dados--tabela--valor">
                        <span>{{dados.medalhas?.total}} no total</span>
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
        dados$.subscribe(dados => {debugger; this.dados = dados});

    }
}