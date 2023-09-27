import { CitiesPipe } from './cities.pipe';
import { NgModule } from "@angular/core";

@NgModule({
    declarations: [CitiesPipe],
    exports: [CitiesPipe]
})
export class PipesModule{

}