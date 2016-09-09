import { Component, Input } from '@angular/core';

import { UF } from '../localidade.service';

@Component({
    moduleId: __moduleName,
    selector: 'estado',
    templateUrl: 'estado.template.html'
})
export class EstadoComponent {
    @Input('value') estado: UF;

    constructor() {}
}