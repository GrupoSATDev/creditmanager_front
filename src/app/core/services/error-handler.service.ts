import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';
import { throwError } from 'rxjs';
import { isArray } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
      private swalService: SwalService
  ) { }

  errorHandler(error: any): void {
      console.error('An error occurred:', error);
      console.log('An error occurred:', error);
      const errorMessage =
          isArray(error.error?.errorMenssages) && error.error?.errorMenssages[0]
              ? error.error.errorMenssages[0]
              : error.errors || 'Ocurrió un error inesperado';
      throwError(errorMessage)
      this.swalService.ToastAler({
          icon: 'error',
          title: errorMessage,
          timer: 4000,
      })
  }

}
