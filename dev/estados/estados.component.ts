import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
    selector: 'estados',
    template: '<h2>Estado: {{estado}}</h2>'
})
export class EstadosComponent implements OnInit, OnDestroy {
    estado: string = '';

    routeParams: Subscription

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeParams = this.route.params
            .map(params => params['estado'])
            .subscribe(estado => this.estado = estado);
    }

    ngOnDestroy() {
        this.routeParams.unsubscribe();
    }
}