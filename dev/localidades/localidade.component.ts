import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UF, LocalidadeService } from './localidade.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'local',
    template: '<estado [value]="estado">',
    providers: [ LocalidadeService ]
})
export class LocalidadeComponent implements OnInit, OnDestroy {
    estado: UF = null;
    routeParams: Subscription;

    constructor(private route: ActivatedRoute,
        private localidadeService: LocalidadeService) { }

    ngOnInit() {
        console.log('init');
        this.routeParams = this.route.params
            .do(params => console.log('!', params))
            .map(params => params['estado'])
            .filter(slug => {
                debugger;
                return !!slug
            })
            .switchMap<UF>(slug => this.localidadeService.getUfBySlug(slug))
            .distinctUntilChanged()
            .subscribe(estado => {
                debugger;
                this.estado = estado;
            });
    }

    ngOnDestroy() {
        this.routeParams.unsubscribe();
    }
}