import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/take';

import { Idioma, IdiomaService, IdiomaSigla } from './idioma.service';

@Injectable()
export class IdiomaGuard implements CanActivate {
    constructor(protected router: Router, protected _idiomaService: IdiomaService) { }

    canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const url = state.url;
        const siglaIdioma: IdiomaSigla = routeSnapshot.params['idioma'];
        const idiomaMemoria = this._idiomaService.getCurrentIdioma();

        const idiomaUrl: Idioma = this._idiomaService.idiomas.reduce((agg, idioma) => {
            return idioma.sigla === siglaIdioma ? idioma : agg;
        }, <Idioma>null);

        if (!idiomaUrl) {
            this.router.navigate([idiomaMemoria.sigla, url.replace(`/${siglaIdioma}`, '')]);
            return false;
        }

        if (idiomaUrl) {
            this._idiomaService.selecionarIdioma(idiomaUrl);
            return true;
        }
    }
}