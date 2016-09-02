import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
    selector: 'pesquisas',
    template: '<h2>Pesquisa: {{pesquisa}}</h2>'
})
export class PesquisasComponent implements OnInit, OnDestroy {
    pesquisa: string = '';

    routeParams: Subscription

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeParams = this.route.params
            .map(params => params['pesquisa'])
            .subscribe(pesquisa => this.pesquisa = pesquisa);
    }

    ngOnDestroy() {
        this.routeParams.unsubscribe();
    }
}