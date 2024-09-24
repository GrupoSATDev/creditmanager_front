import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoOptions',
  standalone: true
})
export class FormatoOptionsPipe implements PipeTransform {

  transform(item: any): string {
    return `${item.numCredito} - ${new Date(item.fechaAprobacion).toLocaleDateString('es-ES')}`;
  }

}
