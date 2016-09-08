import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { LocalidadeComponent } from './localidade.component';
import { EstadoComponent } from './estado/estado.component';

import { LocalidadeService } from './localidade.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        RouterModule
    ],
    declarations: [
        EstadoComponent,
        LocalidadeComponent
    ],
    exports: [
        EstadoComponent,
        LocalidadeComponent
    ],
    providers: [
        LocalidadeService
    ]
})
export class LocalidadeModule { }