import { Routes } from '@angular/router';

import { EstadosComponent } from './estados/estados.component';
import { PesquisasComponent } from './pesquisas/pesquisas.component';

export const RootRoutes: Routes = [
    { path: '', redirectTo: 'estados/rio-de-janeiro', pathMatch: 'full' },
    { path: 'estados/:estado', component: EstadosComponent },
    { path: 'pesquisas/:pesquisa', component: PesquisasComponent }
];