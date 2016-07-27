import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

type IdiomaSigla = 'pt' | 'en';

interface Idioma {
    nome: string,
    sigla: IdiomaSigla
}

@Injectable()
class IdiomaService {
    idiomas = <Idioma[]>[{
            "nome": "Português Brasileiro",
            "sigla": "pt"
        }, {
            "nome": "English",
            "sigla": "en"
        }
    ]

    private _idiomaSelecionado = new BehaviorSubject<Idioma>(this.idiomas[0]);
    selecionado = this._idiomaSelecionado.asObservable();

    constructor(private router: Router) {}

    selecionarIdioma(idioma: Idioma) {
        this._idiomaSelecionado.next(idioma);
    }

    getCurrentIdioma(): Idioma {
        return this._idiomaSelecionado.getValue();
    }

    private _getIdioma(sigla: string) {
        return this.idiomas.reduce( (agg, idioma) => {
            return idioma.sigla === sigla ? idioma : agg;
        }, <Idioma>null);
    }
}

export { Idioma, IdiomaSigla, IdiomaService }