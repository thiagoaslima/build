import { provideRouter, RouterConfig } from '@angular/router';

import { PaisesAppComponent } from './paisesApp/paisesApp.component';
import { MapAppComponent } from './mapApp/mapApp.component';
import { InfoPaisComponent } from './infoPais/infoPais.component';
import { IndicadoresComponent } from './infoPais/indicadores.component';
import { DadosOlimpicosComponent } from './infoPais/dadosOlimpicos.component';

import { IdiomaGuard } from './idioma/idioma.guard';
import { LocalGuard } from './locais/local.guard';
import { TemaGuard } from './infoPais/tema.guard';

import ComponentOne from './component-one';
import ComponentTwo from './component-two';
import ChildOne from './child-one';
import ChildTwo from './child-two';

export const routes: RouterConfig = [
  { path: '', redirectTo: 'pt', pathMatch: 'full' },
  { path: 'component-one', component: ComponentOne },
  { path: ':idioma', component: PaisesAppComponent, canActivate: [IdiomaGuard],
    children: [
      { path: '', component: MapAppComponent, pathMatch: 'full' },
      { path: 'pais/:pais', component: InfoPaisComponent, canActivate: [LocalGuard],
        children: [
          { path: '', redirectTo: 'info/sintese', pathMatch: 'full'},
          { path: 'info/dados-olimpicos', component: DadosOlimpicosComponent },
          { path: 'info/:tema', component: IndicadoresComponent, canActivate: [TemaGuard] }
        ]
     }
    ]
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];