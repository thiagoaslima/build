import { Routes } from '@angular/router';

import { LocalidadeComponent } from './localidades/localidade.component';
import { PesquisasComponent } from './pesquisas/pesquisas.component';

export const RootRoutes: Routes = [
    { path: '', redirectTo: 'estados/rio-de-janeiro', pathMatch: 'full' },
    { path: 'estados/:estado', component: LocalidadeComponent },
    { path: 'pesquisas/:pesquisa', component: PesquisasComponent }
];