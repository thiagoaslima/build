import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { sortObjects, ToSortArray } from '../utils/sortObjects';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
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

export class Municipio implements Localidade {
    codigo: number;
    uf: number;
    nome: string;
    slug: string;
}

export class UF implements Localidade {
    codigo: number;
    nome: string;
    slug: string;
    sigla: string;
    municipios: Municipio[];
}

interface LocalidadeCache<K extends Localidade> {
    porSlug: IMap<K>;
    porCodigo: IMap<K>;
}

@Injectable()
export class LocalidadeService {
    private _URL = {
        municipios: '/api/lista-municipios.json',
        ufs: '/api/lista-ufs.json'
    };

    private _municipios: LocalidadeCache<Municipio>;
    private _ufs: LocalidadeCache<UF>;

    constructor(private http: Http) { }

    public getMunicipioBySlug(slug, force = false) {
        this._remap();
        return this._getBySlug('municipio', slug, true);
    }
    public getMunicipioByCodigo(slug, force = false) {
        this._remap();
        return this._getByCodigo('municipio', slug, true);
    }
    
    public getUfBySlug(slug, force = false) {
        this._remap();
        return this._getBySlug('uf', slug, true);
    }
    public getUfByCodigo(slug, force = false) {
        this._remap();
        return this._getByCodigo('uf', slug, true);
    }



    private _remap() {
        this.getMunicipioBySlug = (slug, force) => this._getBySlug('municipio', slug, force);
        this.getByCodigo = this._getByCodigo;
    }

    private _getBySlug(type: string, slug: string, force = false) {
        return this._get(type, 'porSlug', slug, force);
    }

    private _getByCodigo(type: string, codigo: number, force = false) {
        return this._get(type, 'porCodigo', codigo, force);
    }

    private _get(type:string, property: string, key: string | number, force = false): Observable<Municipio | UF> {
        if (!force) {
            let array = (type === 'municipio') ? this._municipios : this._ufs;
            return Observable.of(array[property][key]);
        }

        let mun$ = this.getMunicipios(),
            uf$ = this.getUfs();

        return Observable.zip<Municipio[], UF[]>(mun$, uf$)
            .map(([municipios, ufs]) => {
                this._ufs = ufs.reduce((cache, uf) => this._montarCache(cache, uf), <LocalidadeCache<UF>>{});
                this._municipios = municipios.reduce((cache, mun) => this._montarCache(cache, mun), <LocalidadeCache<Municipio>>{});
                let array = (type === 'municipio') ? this._municipios : this._ufs;
                return array[property][key];
            })
    }


    public getMunicipios(): Observable<Municipio[]> {
        return this.http.get(this._URL.municipios)
            .map(extractData)
            .map(municipios => sortObjects(municipios).by('slug').alphabetically(false));
    }

    public getUfs(): Observable<UF[]> {
        return this.http.get(this._URL.ufs)
            .map(extractData)
            .map(ufs => sortObjects(ufs).by('slug').alphabetically(false));
    }

    private _montarCache(obj, localidade) {
        const agrupamentos = {
            "porSlug": "slug",
            "porCodigo": "codigo"
        };

        if (localidade.uf) {
            if (this._ufs.porCodigo[localidade.uf] === undefined) {
                throw new Error(`
                    Não foi possível encontar a uf deste município.
                    Código da UF: ${localidade.uf.toString()}
                    Município: ${localidade.toString()}
                    ` );
            }

            let uf = this._ufs.porCodigo[localidade.uf];
            uf.municipios.push(localidade);
        } else {
            localidade.municipios = [];
        }

        Object.keys(agrupamentos).map(grupo => {
            let prop = agrupamentos[grupo];

            if (obj[grupo] === undefined) {
                obj[grupo] = {};
            }

            obj[grupo][localidade[prop]] = localidade;
        });

        return obj;
    }
}

function extractData(res: Response) {
    let body = res.json();
    return body.data || [];
}

