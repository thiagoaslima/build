import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import { Municipio, UF } from '../shared/localidades';

@Injectable()
export class LocalidadesService() {
    urls = {
        municipios: '/api/lista-municipios.json',
        ufs: '/api/lista-ufs.json'
    };

    municipios: Municipio[] = [];
    ufs: UF[] = [];

    constructor (private http: Http) {}

    getMunicipios(): Observable<Municipio[]> {
        return this.http.get(this.url.municipios)
            .map(extractData)
            .do(municipios => this.municipios = municipios);
    }

    getUfs(): Observable<UF[]> {
         return this.http.get(this.url.ufs)
            .map(extractData)
            .do(ufs => this.ufs = ufs);
    }
}

function extractData(res: Response) {
    let body = res.json();
    return body.data || [];
}