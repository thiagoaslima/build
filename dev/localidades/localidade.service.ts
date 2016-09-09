import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { sortObjects, ToSortArray } from '../utils/sortObjects';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/zip';

interface IMap<T> {
    [index: string]: T;
    [index: number]: T;
}

interface Localidade {
    codigo: number;
    nome: string;
    slug: string;
}

export interface Municipio extends Localidade {
    codigo: number;
    uf: number;
    nome: string;
    slug: string;
}

export interface UF extends Localidade {
    codigo: number;
    capital: number;
    nome: string;
    slug: string;
    sigla: string;
    municipios: Municipio[];
}

interface LocalidadeCache<K extends Localidade> {
    porSlug: IMap<K>;
    porCodigo: IMap<K>;
}

const TIPO_LOCALIDADE = {
    "MUNICIPIO": "municipio",
    "UF": "uf"
};

const AGRUPADO_POR = { 
    "SLUG" : "slug", 
    "CODIGO": "codigo"
};

@Injectable()
export class LocalidadeService {
    private _URL = {
        municipios: '/api/lista-municipios.json',
        ufs: '/api/lista-ufs.json'
    };

    private _municipios: LocalidadeCache<Municipio>;
    private _ufs: LocalidadeCache<UF>;
    private _get = this.__get();

    constructor(private http: Http) {}

    public getMunicipioBySlug(slug: string, force = false) {
        return this._get(TIPO_LOCALIDADE.MUNICIPIO, AGRUPADO_POR.SLUG, slug, force);
    }
    public getMunicipioByCodigo(slug, force = false) {
        return this._get(TIPO_LOCALIDADE.MUNICIPIO, AGRUPADO_POR.CODIGO, slug, force);
    }
    
    public getUfBySlug(slug, force = false) {
        return this._get(TIPO_LOCALIDADE.UF, AGRUPADO_POR.SLUG, slug, force);
    }
    public getUfByCodigo(slug, force = false) {
        return this._get(TIPO_LOCALIDADE.UF, AGRUPADO_POR.CODIGO, slug, force);
    }

    private __get(): _get {
        let returned = false;

        return function _get(tipoLocalidade:string, agrupadoPor: string, key: string | number, force = false): Observable<Municipio | UF> {
            if (!force && returned) {
                let array = (tipoLocalidade === TIPO_LOCALIDADE.MUNICIPIO) ? this._municipios : this._ufs;
                return Observable.of(array[agrupadoPor][key]);
            }

            let mun$ = this.getMunicipios(),
                uf$ = this.getUfs();

            return Observable.zip<Municipio[], UF[]>(mun$, uf$)
                .map(([municipios, ufs]) => {
                    this._ufs = ufs.reduce((cache, uf) => this._montarCache(cache, uf), <LocalidadeCache<UF>>{});
                    this._municipios = municipios.reduce((cache, mun) => this._montarCache(cache, mun), <LocalidadeCache<Municipio>>{});
                    let array = (tipoLocalidade === TIPO_LOCALIDADE.MUNICIPIO) ? this._municipios : this._ufs;
                    returned = true;
                    return array[agrupadoPor][key];
                });
        }
    }


    public getMunicipios(): Observable<Municipio[]> {
        return this.http.get(this._URL.municipios)
            .map(extractData)
            .map(municipios => sortObjects(municipios).by(AGRUPADO_POR.SLUG).alphabetically(false));
    }

    public getUfs(): Observable<UF[]> {
        return this.http.get(this._URL.ufs)
            .map(extractData)
            .map(ufs => sortObjects(ufs).by(AGRUPADO_POR.SLUG).alphabetically(false));
    }

    private _montarCache(obj, localidade) {
        if (localidade.uf) {
            if (this._ufs[AGRUPADO_POR.CODIGO][localidade.uf] === undefined) {
                throw new Error(`
                    Não foi possível encontar a uf deste município.
                    Código da UF: ${localidade.uf.toString()}
                    Município: ${localidade.toString()}
                    ` );
            }

            let uf = this._ufs[AGRUPADO_POR.CODIGO][localidade.uf];
            uf.municipios.push(localidade);
        } else {
            localidade.municipios = [];
        }

        Object.keys(AGRUPADO_POR).map(grupo => {
            let prop = AGRUPADO_POR[grupo];

            if (obj[prop] === undefined) {
                obj[prop] = {};
            }

            obj[prop][localidade[prop]] = localidade;
        });

        return obj;
    }
}

function extractData(res: Response) {
    let body = res.json();
    return body.data || [];
}

interface _get {
    (tipoLocalidade:string, agrupadoPor: string, key: string | number, force: boolean): Observable<Municipio | UF>
}