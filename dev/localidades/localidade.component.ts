import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UF, LocalidadeService } from './localidade.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'local',
    template: '<estado [value]="estado | async">',
    providers: [LocalidadeService]
})
export class LocalidadeComponent implements OnInit {
    estado: Observable<UF> = null;

    constructor(private route: ActivatedRoute,
        private localidadeService: LocalidadeService) { }

    ngOnInit() {
        this.estado = this.route.params
            .map(params => params['estado'])
            .filter(slug => !!slug)
            .switchMap<UF>(slug => this.localidadeService.getUfBySlug(slug))
            .distinctUntilChanged();
    }
}