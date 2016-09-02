import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RootModule } from './root.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(RootModule);