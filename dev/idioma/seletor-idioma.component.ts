import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Idioma } from './idioma.service';

@Component({
    selector: 'seletor-idioma',
    template: `
        <a *ngFor="let idioma of opcoes" 
            [routerLink]="['/', idioma.sigla, url]" 
            [title]="idioma.nome">
            {{idioma.sigla | uppercase}}
        </a>
    `,
    directives: [ROUTER_DIRECTIVES],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeletorIdioma implements OnChanges {
    @Input('selecionado') idiomaSelecionado: Idioma;
    @Input('lista') idiomas: Idioma[];
    @Input() url: URL;

    opcoes: Idioma[]

    ngOnChanges(changes: SimpleChanges) {
        if (changes['url']) {
            this.url = changes['url'].currentValue.split('/').slice(2).join('/');
        }

        if (changes['idiomaSelecionado'] || changes['idiomas']) {
            this.opcoes = this.idiomas.filter((idioma: Idioma) => {
                return this.idiomaSelecionado.sigla !== idioma.sigla;
            });
        }

    }
}