import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { EstadosComponent } from './estados.component';
import { LocalidadeService } from './localidades.service';

@NgModule({
    imports: [
        HttpModule,
        RouterModule
    ],
    declarations: [
        EstadosComponent
    ],
    exports: [
        EstadosComponent
    ],
    providers: [LocalidadeService]
})
export class LocalidadeModule { }