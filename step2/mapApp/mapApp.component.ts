import { Component, Output, OnInit, EventEmitter, HostListener } from '@angular/core';

import { Continente, LocalService } from '../locais/locais.service';
import { Idioma, IdiomaSigla, IdiomaService } from '../idioma/idioma.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

@Component({
    
    selector: 'map-app',
    // templateUrl: 'mapApp.template.html',
    template: `

        <div class="pure-g">
            <div class="pure-u-1-2 pure-u-md-1-3 map--square map--africa" (click)="selecionarContinente(continentes['africa'])"></div>
            <div class="pure-u-1-2 pure-u-md-1-3 map--square map--america" (click)="selecionarContinente(continentes['america'])"></div>
            <div class="pure-u-1-2 pure-u-md-1-3 map--square map--lo"></div>
            <div class="pure-u-1-2 pure-u-md-1-3 map--square map--asia" (click)="selecionarContinente(continentes['asia'])"></div>
            <div class="pure-u-1-2 pure-u-md-1-3 map--square map--europa" (click)="selecionarContinente(continentes['europa'])"></div>
            <div class="pure-u-1-2 pure-u-md-1-3 map--square map--oceania" (click)="selecionarContinente(continentes['oceania'])"></div>



        </div>

       

     
    `,
    styles: [`
        p {
            cursor: pointer;
            display: inline-block;
        }

        .map--square{
            min-width: 143px;
            min-height: 143px;
            outline: 1px solid #ddd;
            background-repeat: no-repeat;
            background-position: center; 
            cursor: pointer;
        }
        .map--lo{
            background-image:url('images/mapa_logo_140.jpg');
            cursor: auto;
        }

        .map--africa{background-image:url('images/mapa_cont_africa_140.jpg');}
        .map--america{background-image:url('images/mapa_cont_america_140.jpg');}
        .map--asia{background-image:url('images/mapa_cont_asia_140.jpg');}
        .map--europa{background-image:url('images/mapa_cont_europa_140.jpg');}
        .map--oceania{background-image:url('images/mapa_cont_oceania_140.jpg');}

        @media screen and (min-width: 48em) {
            .map--square{min-height: 260px;}
            .map--lo{background-image:url('images/mapa_logo_260.jpg');}

            .map--africa{background-image:url('images/mapa_cont_africa_260.jpg');}
            .map--america{background-image:url('images/mapa_cont_america_260.jpg');}
            .map--asia{background-image:url('images/mapa_cont_asia_260.jpg');}
            .map--europa{background-image:url('images/mapa_cont_europa_260.jpg');}
            .map--oceania{background-image:url('images/mapa_cont_oceania_260.jpg');}
        }

       

    `]
})
export class MapAppComponent implements OnInit{
    idiomaSigla: IdiomaSigla; 
    continentes = {};

    @Output() selecionado = new EventEmitter();

    constructor(private _localService: LocalService, private _idiomaService: IdiomaService) { }

    @HostListener('click', ['$event'])
    onHostClick(evt: Event) {
        evt.stopPropagation();
    }

    ngOnInit() {
        this._idiomaService.selecionado
            .combineLatest<Continente[]>(this._localService.getContinentes())
            .subscribe( ([idioma, continentes]) => {
                this.idiomaSigla = idioma.sigla;
                this.continentes = continentes.reduce( (agg, cont) => {
                    agg[cont.slug] = cont;
                    return agg;
                }, {});
            });
    }

    selecionarContinente(continente: Continente) {
        this._localService.selecionarContinente(continente);
        this.selecionado.emit(continente);
        this._localService.toggleSelecionandoPaises(true);
    }
}