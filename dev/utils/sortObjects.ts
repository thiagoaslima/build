import {_slug as slug} from './slug';

export {
    sortObjects
}

export interface ToSortArray<T> {
   data: Array<T>;
    property: string;
    method: string;
    transform: boolean;
    alphabetically(transform: boolean): Array<T>;
    numerically(): Array<T>;
    by(property: string): ToSortArray<T>;
}

function sortObjects<T>(array: Array<T>): ToSortArray<T> {
    return <ToSortArray<T>>{
        data: array,
        property: '',
        method: '',
        transform: true,
        alphabetically: _setAlphabetically,
        numerically: _setNumerically,
        by: _by
    };
}

function _setAlphabetically<T>(transform = true) {
    this.transform = transform;
    return _setMethod<T>(<ToSortArray<T>>this, 'alphabetically');
}
function _setNumerically<T>(): ToSortArray<T>|Array<T> {
    return _setMethod<T>(<ToSortArray<T>>this, 'numerically');
}

function _by<T>(prop: string): ToSortArray<T> {
    this.property = prop;
    return this;
}

function _setMethod<T>(obj: ToSortArray<T>, method) {
    obj.method = method;
    return _run<T>(obj);
}

function _run<T>(obj: ToSortArray<T>): Array<T> {
    
    if (obj.method === 'alphabetically') {
        return _sortAlphabetically<T>(obj.data, obj.property, obj.transform);
    }

    if (obj.method === 'numerically') {
        return _sortNumerically<T>(obj.data, obj.property);
    }
}

function _sortAlphabetically<T>(array, prop, transform = true): Array<T> {
        if (transform) {
            return array.sort( (a, b) => slug(a[prop]) > slug(b[prop]) ? 1 : -1 );
        } else {
            return array.sort( (a, b) => a[prop] > b[prop] ? 1 : -1 );
        }
}

function _sortNumerically<T>(array, prop): Array<T> {
    return array.sort( (a, b) => {
        return parseInt(a[prop], 10) > parseInt(b[prop], 10) ? 1 : -1;
    });
}