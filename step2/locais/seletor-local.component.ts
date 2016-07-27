import { Component, Input, Output, EventEmitter, OnInit, OnChanges, DoCheck, AfterContentInit, SimpleChanges, ViewChild, Renderer, ElementRef, HostListener } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

import { Pais, Continente, LocalService } from './locais.service';
import { Idioma, IdiomaSigla } from '../idioma/idioma.service';

import { _slug as slug } from '../helpers';

@Component({
    
    selector: 'local-display',
    template: `<div (click)="editModeOn()" [class.hidden]="hidden"> <input [value]="nome" readonly type="text"> </div>`,
    styles: [`.seletor-local-filtro{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.hidden{height:0;opacity:0;overflow:hidden}.layout--container{width:100%;box-sizing:boder-box}.layout--container--child{width:100%;box-sizing:inherit}`]
    /*
    template: `
        DISPLAY
        <input [hidden]="hidden" type="text" readonly [value]="nome" (click)="editModeOn()" />
    `
    */
})
class LocalDisplay implements OnChanges {
    @Input() pais: Pais;
    @Input() idioma: IdiomaSigla;
    @Input('hide') hidden: boolean = false;

    @Output() editMode: EventEmitter<{}> = new EventEmitter();

    nome: string = '';

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        this.nome = this.pais ? this.pais.nome[this.idioma] : '';
    }

    editModeOn() {
        this.editMode.emit(false);
    }
}


@Component({
    moduleId: __moduleName,
    selector: 'input-search',
    templateUrl: 'input-search.template.html',
    styleUrls: ['seletorLocal.styles.css']
    /*
    template: `
        SEARCH
        <input #input type="text" [(ngModel)]="text" (keyup)="updateText()" />
    `
    */
})
class InputSearch implements OnChanges, AfterContentInit {
    @Input() text: string = '';
    @Input('hide') hidden: boolean = true;

    @Output() textChanges: EventEmitter<{}> = new EventEmitter();

    @ViewChild('input') inputEl: ElementRef;

    private _text: string;

    constructor(private _renderer: Renderer) { }

    updateText() {
        if (this.text !== this._text) {
            this.textChanges.emit(this.text);
            this._text = this.text;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const el = this.inputEl.nativeElement;

        if (changes['hidden'] && changes['hidden'].currentValue === false) {
            this._renderer.setElementStyle(el, 'display', 'block');
            this._renderer.invokeElementMethod(el, 'focus', []);
        } else {
            this._renderer.setElementStyle(el, 'display', 'none');
            this.text = '';
            this.updateText();
        }
    }


    ngAfterContentInit() { }
}


@Component({
    moduleId: __moduleName,
    selector: 'lista-locais',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'lista-locais.template.html',
    styleUrls: ['listaLocais.styles.css']
    /*
    template: `
        LISTA_LOCAIS
        <div [hidden]="hidden">
        <p><span (click)="selecionarContinente(null)">&times;</span> Continente Selecionado: {{continente?.nome | json}}</p>
        <ul>
            <li *ngFor="let continente of lista">
                <h4 (click)="selecionarContinente(continente)">{{continente.nome[idioma]}}</h4>

                <ul>
                    <li *ngFor="let pais of continente.paises[idioma]">
                        <a [routerLink]="['./pais', pais.slug]">
                            {{pais.nome[idioma]}}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    `
    */
})
export class ListaLocaisComponent implements OnChanges {
    @Input() idioma: IdiomaSigla;
    @Input() continente: Continente = null;
    @Input('lista') continentes: Continente[] = [];
    @Input() filterText: string = '';
    @Input('hide') hidden: boolean = true;

    @Output() selecionarContinente: EventEmitter<{}> = new EventEmitter();

    lista: Continente[];

    constructor() { }

    selecionar(continente: Continente) {
        this.selecionarContinente.emit(continente);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["hidden"] && changes['hidden'].currentValue === true) {
            this.selecionar(null);
        }

        if (!this.hidden) {
            let lista = this.continente ? [this.continente] : this.continentes;

            if (this.filterText) {
                lista = lista.reduce((agg: Continente[], continente: Continente) => {

                    let paises: Pais[] = continente.paises[this.idioma];

                    if (paises) {
                        paises = paises.filter((pais: Pais) => slug(pais.nome[this.idioma]).includes(this.filterText));
                    }

                    if (paises && paises.length) {
                        continente = new Continente({ nome: continente.nome, paises: paises });
                        agg.push(continente);
                    }

                    return agg;
                }, <Continente[]>[])
            }

            this.lista = lista;
        }

    }
}




@Component({
    moduleId: __moduleName,
    selector: 'seletor-local',
    directives: [ListaLocaisComponent, InputSearch, LocalDisplay],
    templateUrl: 'seletor-local.template.html',
    styleUrls: ['seletorLocal.styles.css']
    /*
    template: `
    SELETOR_LOCAL
    filterText: {{filterText | async}};
        <div>
            <local-display 
                [hide]="!hide" 
                [idioma]="idioma.sigla" 
                [pais]="paisSelecionado | async"
                (editMode)="updatehide($event)"></local-display>
        </div>
        <div>
            <input-search 
                [hide]="hide" 
                (textChanges)="updateText($event)"></input-search>
        </div>
        <lista-locais 
            [hide]="hide"
            [idioma]="idioma.sigla"
            [filterText]="filterText | async"
            [lista]="listaContinentes | async"
            [continente]="continenteSelecionado | async"
            (selecionarContinente)="selecionarContinente($event)"></lista-locais>
    `
    */
})
export class SeletorLocalComponent implements OnInit {
    @Input() idioma: Idioma;

    // selecionando: Observable<Boolean>;
    hide: Boolean = true;
    paisSelecionado: Observable<Pais>;
    listaContinentes: Observable<Continente[]>;
    continenteSelecionado: Observable<Continente>;

    private _filterText: BehaviorSubject<string> = new BehaviorSubject('');
    filterText: Observable<string> = this._filterText.asObservable()
        .distinctUntilChanged()
        .debounceTime(150)
        .map(slug);

    @HostListener('document:click', ['$event'])
    onOutsideClick(evt: Event) {
        this._localService.toggleSelecionandoPaises(false);
    }

    @HostListener('click', ['$event'])
    onInsideClick(evt: Event) {
        evt.stopPropagation();
    }

    constructor(private _localService: LocalService) { }

    ngOnInit() {
        this.listaContinentes = this._localService.getContinentes();
        this.paisSelecionado = this._localService.localSelecionado.pais;
        this.continenteSelecionado = this._localService.localSelecionado.continente;
        this._localService.selecionandoPaises.subscribe( (bool: Boolean) => {
            this.hide = !bool;
        });

        this.paisSelecionado.subscribe((pais: Pais) => {
            // ao selecionar um país, os seletores de local somem
            if (pais) {
                this._localService.toggleSelecionandoPaises(false);
            }
        });
    }

    selecionarContinente(continente: Continente) {
        this._localService.selecionarContinente(continente);
    }

    updateText(text: string) {
        this._filterText.next(text);
    }

    updatehide(bool: Boolean) {
        this._localService.toggleSelecionandoPaises(!bool);
    }
}

