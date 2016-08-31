import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/take';

import { Continente, Pais, LocalService } from './locais.service';

@Injectable()
export class LocalGuard implements CanActivate {
    constructor(protected router: Router, protected _localService: LocalService) { }

    canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const slugPais: string = routeSnapshot.params['pais'];
        const pais = this._localService.getPaisBySlug(slugPais);

        if (!pais) {
            // TODO: Criar serviço de mensagens/erros
            alert('País não encontrado');
            return false;
        }

        this._localService.selecionarPais(pais);
        return true;
    }
}