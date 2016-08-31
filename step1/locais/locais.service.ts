import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/zip';

import { _slug as slug } from '../helpers';

import { PAISES } from '../api/paises2';
import { CONTINENTES } from '../api/continentes';

interface Dictionary<T> {
    [key: string]: Array<T>
}
interface Hash<T> {
    [key: string]: T
}

export interface dadoBilingue<T> {
    "pt": T;
    "en": T;
}

interface ProtoPais {
    nome: dadoBilingue<string>;
    sigla: string;
    continente: string;
    slug?: string;
}

interface ProtoContinente {
    nome: dadoBilingue<string>;
    slug?: string;
    paises: {
        "pt"?: Pais[],
        "en"?: Pais[]
    };
}

interface PaisResp {
    "pais": "Afeganistão",
    "pais_en": "Afghanistan",
    "a2": "AF",
    "a3": "AFG",
    "ddi": "93"
}

export class Pais {
    nome: dadoBilingue<string>;
    sigla: string;
    continente: string;
    slug: string

    constructor({nome, sigla, continente}: ProtoPais = { nome: { 'pt': '', 'en': '' }, sigla: '', continente: '' }) {
        this.nome = nome;
        this.sigla = sigla;
        this.continente = continente;
        this.slug = slug(nome.pt);
    }
}

export class Continente {
    nome: dadoBilingue<string>;
    slug: string;
    paises: dadoBilingue<Pais[]>;

    constructor({nome = { 'pt': '', 'en': '' }, paises = <Pais[]>[]}) {
        this.nome = nome;
        this.paises = {
            "pt": paises.slice(0).sort( (a,b) => slug(a.nome.pt) > slug(b.nome.pt) ? 1 : -1 ),
            "en": paises.slice(0).sort( (a,b) => slug(a.nome.en) > slug(b.nome.en) ? 1 : -1 )
        };    
        this.slug = slug(nome.pt);
    }
}

@Injectable()
export class LocalService {
    private url = 'http://servicodados.ibge.gov.br/api/v1/paises/olimpicos/paises';

    private _paisSelecionado = new BehaviorSubject<Pais>(null);
    private _continenteSelecionado = new BehaviorSubject<Continente>(null);
    private _selecionandoPaises = new BehaviorSubject<Boolean>(false);
    private _cache: LocalServiceCache;

    public localSelecionado = {
        pais: this._paisSelecionado.asObservable(),
        continente: this._continenteSelecionado.asObservable()
    };

    public selecionandoPaises = this._selecionandoPaises.asObservable();

    constructor(private http: Http) {
        this._cache = new LocalServiceCache;
    }

    getPaisBySlug(slug: string): Pais {
        return this._cache.getPaisBySlug(slug);
    }

    getPaises(forceRequest = false): Observable<Pais[]> {
        const paises = this._cache.getPaises();

        if (paises.length && !forceRequest) {
            return Observable.of(paises);
        }

        return this.http.get('app/api/paises.json')
            .map((res: Response) => res.json())
            .map(this._cache.savePaises);
    }

    getContinentes(forceRequest = false): Observable<Continente[]> {
        const continentes = this._cache.getContinentes();

        if (continentes.length && !forceRequest) {
            return Observable.of(continentes);
        }

        return this.http.get('app/api/continentes.json')
            .map((res: Response) => res.json())
            .zip(this.getPaises(), this._cache.saveContinentes);
    }

    selecionarPais(pais: Pais) {
        this._paisSelecionado.next(pais);
    }

    selecionarContinente(continente: Continente) {
        this._continenteSelecionado.next(continente);
    }

    toggleSelecionandoPaises(bool: Boolean) {
        this._selecionandoPaises.next(bool);
    }
}


class LocalServiceCache {
    private paises: Pais[] = [];
    private paisesSlugHash: Hash<Pais>;
    private continentes: Continente[] = [];

    constructor() {
        this.savePaises(PAISES);
        this.saveContinentes(CONTINENTES, this.paises);
    }

    getPaises() {
        return this.paises;
    }

    getPaisBySlug(slug: string) {
        return this.paisesSlugHash[slug] || null;
    }

    savePaises(paises: ProtoPais[]): Pais[] {
        this.paises = paises
            .map((obj: Pais) => new Pais(obj))
            .sort((a, b) => a.slug > b.slug ? 1 : -1);

        this.buildSlugHash(this.paises);
        this.saveContinentes(this.continentes, this.paises);

        return this.paises;
    }


    getContinentes() {
        return this.continentes;
    }

    saveContinentes(continentes: ProtoContinente[], paises: Pais[]): Continente[] {
        let continentesPorPaises = paises.reduce((agg: Dictionary<Pais>, pais: Pais) => {
            const _slug = slug(pais.continente);
            if (agg[_slug]) {
                agg[_slug].push(pais);
            } else {
                agg[_slug] = [pais];
            }

            return agg;
        }, <Dictionary<Pais>>{});

        this.continentes = continentes.map((continente: Continente) => {
            let _slug = slug(continente.nome.pt);
            return new Continente({nome: continente.nome, paises: continentesPorPaises[_slug] });
        });

        return this.continentes;
    }

    private buildSlugHash(paises: Pais[]) {
        this.paisesSlugHash = paises.reduce((agg: Hash<Pais>, pais: Pais) => {
            agg[pais.slug] = pais;
            return agg;
        }, <Hash<Pais>>{})
    }
}