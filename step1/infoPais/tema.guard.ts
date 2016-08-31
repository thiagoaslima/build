import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { InfoPaisService, Tema } from './infoPais.service';

@Injectable()
export class TemaGuard implements CanActivate {
    constructor(protected router: Router, protected _infoService: InfoPaisService) { }

    canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const slugTema: string = routeSnapshot.params['tema'];
        const tema = this._infoService.getTemaBySlug(slugTema);

        if (!tema) {
            // TODO: Criar serviço de mensagens/erros
            alert('Tema não encontrado');
            return false;
        }

        tema.forEach(tema => this._infoService.selecionarTema(tema));
        
        return true;
    }
}