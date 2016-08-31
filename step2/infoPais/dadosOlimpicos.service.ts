import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

interface RespOlimp {
    "dadosOlimpicos": {
        "pais": string,
        "primeira_participacao": string,
        "ultima_participacao": string,
        "participantes": string,
        "modalidades": string,
        "ouro": string,
        "prata": string,
        "bronze": string,
        "total": string
    },
    "medalhistas": { atleta: string, medalhas: number }[],
    "esportesMedalhistas": Array<{ pt: string, en: string }>
}

interface DadosOlimpicos {
    pais: string;
    participacao: {
        primeira: string,
        ultima: string,
    },
    participantes: {
        unidade: {
            nome: {
                pt: string,
                en: string
            }
        }
    }
}

@Injectable()
export class DadosOlimpicosService {

    constructor(private _http: Http) { }

    getDados(siglaPais: string) {
        return this._http.get('http://servicodados.ibge.gov.br/api/v1/paises/olimpicos/dadostotal/' + siglaPais)
            .map(res => <RespOlimp>res.json())
            .map(resp => {
                return {
                    pais: resp.dadosOlimpicos.pais,
                    participacao: {
                        primeira: resp.dadosOlimpicos.primeira_participacao,
                        ultima: resp.dadosOlimpicos.ultima_participacao
                    },
                    participantes: {
                        valor: resp.dadosOlimpicos.participantes,
                        unidade: {
                            nome: {
                                pt: "atletas",
                                en: "athletes"
                            }
                        },
                        tipo: 'numerico'
                    },
                    modalidades: {
                        valor: resp.dadosOlimpicos.modalidades,
                        unidade: {
                            nome: {
                                pt: "esportes",
                                en: "sports"
                            }
                        },
                        tipo: 'numerico'
                    },
                    medalhas: {
                        ouro: resp.dadosOlimpicos.ouro,
                        prata: resp.dadosOlimpicos.prata,
                        bronze: resp.dadosOlimpicos.bronze,
                        total: resp.dadosOlimpicos.total 
                    },
                    medalhistas: {
                        atletas: resp.medalhistas.slice(0, 5),
                        esportes: {
                            pt: resp.esportesMedalhistas.map(esporte => esporte.pt).sort(),
                            en: resp.esportesMedalhistas.map(esporte => esporte.en).sort(),
                        }
                    }
                }
            });
    }
}