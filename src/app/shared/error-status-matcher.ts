import { FormControl, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStatusMatcher implements ErrorStateMatcher {
    
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean 
    {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }

    getErrorMessage(field: string, form: FormGroup)
    {
        const catchError = form.get(field);

        if(catchError.errors.pattern)
            return `Este campo solo acepta ${this.getPatternMessage(catchError.errors.pattern.requiredPattern)}`;

        if(catchError.errors.required)
            return "Este campo no puede estar vacio";

        if(catchError.errors.minlength)
            return `La cantidad minima de caracteres es ${catchError.errors.minlength.requiredLength}`;

        if(catchError.errors.maxlength)
            return `La cantidad maxima de caracteres es ${catchError.errors.maxlength.requiredLength}`;

        if(catchError.errors.email)
            return `Dirección de correo incorrecta`;

        if(catchError.errors.min)
            return `Ingrese un numero mas alto`;
        
        if(catchError.errors.max)
            return `Ingrese un numero menor`;

        return "Error desconocido";
    }

    getPatternMessage(RegEx: string) : string
    {
        switch(RegEx)
        {
            case "^[a-zA-ZÀ-ú0-9 ñ '&() .,-]*$" : return "letras, números y caracteres '&() .,-"
            case "^[0-9]*$": return "números";
            case "^[a-zA-Z0-9]*$": return "números y letras";
            case "^[0-9]+(\.[0-9]{1,2})?$": return "números y 2 decimales";
            default: return RegEx;
        }
    }
}
