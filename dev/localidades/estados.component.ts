import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UF, LocalidadeService } from './localidades.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'estados',
    template: '<h2>Estado: {{estado}}</h2>',
    providers: [ LocalidadeService ]
})
export class EstadosComponent implements OnInit, OnDestroy {
    estado: UF;
    routeParams: Subscription;

    constructor(private route: ActivatedRoute,
        private localidadeService: LocalidadeService) { }

    ngOnInit() {
        this.routeParams = this.route.params
            .map(params => params['estado'])
            .switchMap<UF>(slug => this.localidadeService.getBySlug(slug))
            .subscribe(estado => this.estado = estado);
    }

    ngOnDestroy() {
        this.routeParams.unsubscribe();
    }
}