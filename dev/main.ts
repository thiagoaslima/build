import { bootstrap } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';

import { RootAppComponent } from './rootApp/rootApp.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';

import { IdiomaGuard } from './idioma/idioma.guard';
import { IdiomaService } from './idioma/idioma.service';

import { LocalGuard } from './locais/local.guard';
import { LocalService } from './locais/locais.service';

import { TemaGuard } from './infoPais/tema.guard';
import { InfoPaisService } from './infoPais/infoPais.service';

const PROVIDERS = [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    IdiomaGuard,
    IdiomaService,
    LocalGuard,
    LocalService,
    TemaGuard,
    InfoPaisService
];

if (window && window.history && window.history.pushState) {
    bootstrap(RootAppComponent, [
        ...PROVIDERS 
    ])
    .catch( (err: Error) => console.error(err));
} else {
    bootstrap(RootAppComponent, [
        ...PROVIDERS,
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ])
    .catch( (err: Error) => console.error(err));
}