import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'city',
    pure: false
})
export class CitiesPipe implements PipeTransform {
    cities: { code: string, name: string }[] = [
        { code: "CB", name: "COCHABAMBA" },
        { code: "LP", name: "LA PAZ" },
        { code: "SC", name: "SANTA CRUZ" },
        { code: "OR", name: "ORURO" },
        { code: "BN", name: "BENI" },
        { code: "PD", name: "PANDO" },
        { code: "TJ", name: "TARIJA" },
        { code: "CH", name: "CHUQUISACA" },
        { code: "PT", name: "POTOSI" }
    ];
    constructor() { }
    transform(value: string, findBy: string, field: string): string {

        const city = this.cities.find(c => c[findBy] === value);

        return city ? city[field] : "";
    }
}