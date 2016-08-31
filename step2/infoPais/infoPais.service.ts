import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { _slug as slug } from '../helpers';

export interface dadoBilingue<T> {
    "pt": T;
    "en": T;
}

export interface Hash<T> {
    [key: number]: T
}
export interface Dictionary<T> {
    [key: string]: T
}

export interface IndicadorResp {
    "id": number;
    "tema": string;
    "tema_en": string;
    "indicador": string;
    "indicador_en": string;
    "unidade": string;
    "unidade_en": string;
    "unidade_tipo": string;
    "unidade_multiplicador": string;
    "fonte": string;
    "fonte_link": URL;
}

export interface ValorResp {
    "pais": string;
    "periodo": string;
    "indicador": number;
    "valor": string;
    "valor_en": string;
}


export interface Tema {
    slug: string;
    nome: dadoBilingue<string>;
    indicadores: dadoBilingue<Indicador[]>; // Indicador.id ordenado por nome em cada idioma
}

export interface Indicador {
    slug: string
    id: number;
    nome: dadoBilingue<string>;
    unidade: {
        nome: dadoBilingue<string>,
        tipo: string,
        multiplicador: string
    },
    fonte: {
        nome: string,
        link: URL
    },
    valores: {
        todos: Valor[],
        porPais: Dictionary<Valor>
    }
}

export interface Valor {
    "slugPais": string;
    "periodo": string;
    "indicador": number;
    "valor": dadoBilingue<string>;
}

function buildValor(valor: ValorResp) {
    return <Valor>{
        slugPais: valor.pais,
        indicador: valor.indicador,
        periodo: valor.periodo,
        valor: {
            pt: valor.valor,
            en: valor.valor_en
        }
    };
}

const dadosOlimpicos: Tema = {
    slug: 'dados-olimpicos',
    nome: {
        pt: 'Dados Olímpicos',
        en: 'Olympics'
    },
    indicadores: {
        pt: [],
        en: []
    }
};


@Injectable()
export class InfoPaisService {
    private _cache: InfoPaisCache;

    private _URLS = {
        indicadores: 'http://servicodados.ibge.gov.br/api/v1/paises/olimpicos/indicadores/',
        valores: {
            indicador: 'http://servicodados.ibge.gov.br/api/v1/paises/olimpicos/valores/indicador/',
            pais: 'http://servicodados.ibge.gov.br/api/v1/paises/olimpicos/valores/pais/',
        }
    }

    private _temaSubject: BehaviorSubject<Tema> = new BehaviorSubject(null);
    tema$ = this._temaSubject.asObservable();

    constructor(private _http: Http) {
        this._cache = new InfoPaisCache;
    }

    getTemaBySlug(slug: string): Observable<Tema> {
        const tema = this._cache.getTemaBySlug(slug);

        if (tema) {
            return Observable.of(tema);
        }

        return this.getTemas()
            .map((temas: Tema[]) => {
                return temas.reduce((agg: Tema, tema: Tema) => {
                    return tema.slug === slug ? tema : agg;
                }, null)
            });
    }

    getTemas(force = false): Observable<Tema[]> {
        const temas = this._cache.getTemas();

        if (!force && temas && temas.length) {
            return Observable.of(temas);
        }

        return this._fetchIndicadores()
            .map((res: Response) => res.json())
            .map(json => this._cache.processarIndicadorResp(json))
            .map(_ => this._cache.getTemas());
    }

    selecionarTema(tema: Tema) {
        this._temaSubject.next(tema);
    }

    getIndicadores(ids: number[] = [], force = false): Observable<Indicador[]> {
        const indicadores = this._cache.getIndicadores(ids);

        if (!force && indicadores && indicadores.length) {
            return Observable.of(indicadores);
        }

        return this._fetchIndicadores()
            .map((res: Response) => res.json())
            .map(json => this._cache.processarIndicadorResp(json))
            .map(_ => this._cache.getIndicadores(ids));
    }

    updateValorePais(siglaPais: string): Observable<Valor[]> {
        return this._http
            .get(this._URLS.valores.pais + siglaPais)
            .map(res => res.json())
            .map(resp => this._cache.processarValoresResp(siglaPais, resp))
    }

    private _fetchIndicadores() {
        return this._http.get(this._URLS.indicadores);
    }

    /*
    private _fetchValores(slugPais: string, indicadorId: number) {
        const porPais$: Observable<ValorResp[]> = this._http
            .get(this._URLS.valores.pais + slugPais)
            .map(res => res.json());
        const porIndicador$: Observable<ValorResp[]> = this._http
            .get(this._URLS.valores.indicador + indicadorId)
            .map(res => res.json());

        return porIndicador$.combineLatest(porPais$)
            .map(resp => this._cache.processarValoresResp(resp));
    }
    */
}


class InfoPaisCache {
    private temas: Tema[] = null;
    private temasBySlug: Dictionary<Tema> = null;
    private indicadores: Hash<Indicador> = null;

    getTemaBySlug(slug: string): Tema {
        if (!this.temasBySlug) {
            return null;
        }
        return this.temasBySlug[slug];
    }

    getTemas(): Tema[] {
        return this.temas;
    }

    getIndicadores(ids: number[] = []): Indicador[] {
        if (!this.indicadores) {
            return null;
        }

        let array = ids.length ?
            ids.map((id: number) => this.indicadores[id]).filter((indicador: Indicador) => !!indicador) :
            Object.keys(this.indicadores).map((id: string) => this.indicadores[parseInt(id, 10)]);

        return array.length ? array : [];
    }

    processarIndicadorResp(json: IndicadorResp[]): boolean {
        const len = json.length;

        let dados = {
            temas: <Dictionary<Tema>>{},
            indicadores: <Hash<Indicador>>{}
        }

        dados.temas[dadosOlimpicos.slug] = dadosOlimpicos;

        json.forEach(item => {
            const indicadorSlug = slug(item.indicador);
            const temaSlug = slug(item.tema);

            const indicador = <Indicador>{
                slug: indicadorSlug,
                id: item.id,
                nome: {
                    pt: item.indicador,
                    en: item.indicador_en
                },
                unidade: {
                    nome: {
                        pt: item.unidade,
                        en: item.unidade_en
                    },
                    tipo: item.unidade_tipo,
                    multiplicador: item.unidade_multiplicador
                },
                fonte: {
                    nome: item.fonte,
                    link: item.fonte_link
                },
                valores: {
                    todos: [],
                    porPais: {}
                }
            };

            dados.indicadores[indicador.id] = indicador;

            if (dados.temas[temaSlug]) {
                let indicadores = dados.temas[temaSlug].indicadores;
                Object.keys(indicadores).forEach(key => {
                    indicadores[key].push(indicador);
                })
            } else {
                const tema = <Tema>{
                    slug: temaSlug,
                    nome: {
                        pt: item.tema,
                        en: item.tema_en
                    },
                    indicadores: {
                        pt: [indicador],
                        en: [indicador]
                    }
                }

                dados.temas[tema.slug] = tema;
            }

        });

        this.temas = Object.keys(dados.temas).sort().reduce((array: Tema[], slugTema: string) => {
            let tema = dados.temas[slugTema];
            let indicadores = tema.indicadores;

            Object.keys(indicadores).forEach(key => {
                indicadores[key].sort((a: Indicador, b: Indicador) => {
                    return slug(a.nome[key]) > slug(b.nome[key]) ? 1 : -1;
                })
            });

            if (slugTema === 'sintese') {
                array = [tema].concat(...array);
            } else {
                array.push(tema);
            }

            return array;
        }, <Tema[]>[]);

        this.temasBySlug = dados.temas;
        this.indicadores = dados.indicadores;

        return true;
    }

    processarValoresResp(id: string | number, valores: ValorResp[]): Valor[] {
        if (!valores || !valores.length) {
            return [];
        }
        
        // recebe os valores por Pais
        const _valores = valores.map(valor => buildValor(valor));

        if (typeof id === 'string') {
            const slugPais = _valores[0].slugPais;
            _valores.map(valor => {
                this.indicadores[valor.indicador].valores.porPais[valor.slugPais] = valor;
            });
        }

        return _valores;
    }

/*
    processarValoresResp([valoresIndicador, valoresPais]: Array<ValorResp[]>): [Valor[], Valor[]] {
        const valoresInd = valoresIndicador.map(valor => buildValor(valor));
        const valoresP = valoresPais.map(valor => buildValor(valor));

        const indicadorId = valoresInd[0].indicador;
        const slugPais = valoresP[0].slugPais;

        this.indicadores[indicadorId].valores.todos = valoresInd;
        valoresP.map(valor => {
            this.indicadores[valor.indicador].valores.porPais[valor.slugPais] = valor;
        });

        return [valoresInd, valoresP];
    }
    */
}