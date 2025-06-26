import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { MatFormField, MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, Observable, startWith, tap } from 'rxjs';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { MatButton } from '@angular/material/button';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { guardar } from '../../../../core/constant/dialogs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const maskConfig: Partial<IConfig> = {
    validation: false,
};
@Component({
    selector: 'app-form-credito-consumos',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatFormField,
        MatOption,
        MatInput,
        MatLabel,
        NgForOf,
        MatSelect,
        NgIf,
        MatButton,
        MatDialogClose,
        NgxMaskDirective,
    ],
    templateUrl: './form-credito-consumos.component.html',
    styleUrl: './form-credito-consumos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormCreditoConsumosComponent implements OnInit {
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private creditoConsumoService = inject(CreditoConsumosService);
    public dialogRef = inject(MatDialogRef<FormCreditoConsumosComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private readonly destroyedRef = inject(DestroyRef);
    private empleadosService = inject(EmpleadosService);
    private empresaClienteService = inject(EmpresasClientesService);
    filteredEmpleados$: Observable<any[]>;
    empleadoControl = new FormControl('');
    empleados = [];
    empresa$ = this.empresaClienteService.getEmpresasClientes().pipe(
        tap((response) => {
            const valorSelected = response.data;
            if (valorSelected) {
                this.form.get('idSubEmpresa').setValue(valorSelected[0].id);
                this.getEmpleadosSubEmpresas(valorSelected[0].id);
            }
        })
    );

    ngOnInit(): void {
        this.createForm();
        this.filteredEmpleados$ = this.empleadoControl.valueChanges.pipe(
            startWith(''),
            map((value: any) => {
                const name =
                    typeof value === 'string'
                        ? value
                        : value?.primerNombre || value?.primerApellido;
                return name ? this._filter(name) : this.empleados.slice();
            })
        );
    }

    displayFn(empleado: any): string {
        return empleado
            ? `${empleado.primerNombre} ${empleado.primerApellido}`
            : '';
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.empleados.filter((empleado) =>
            `${empleado.primerNombre} ${empleado.primerApellido}`
                .toLowerCase()
                .includes(filterValue)
        );
    }

    onOptionSelected(event: any) {
        // Aquí puedes emitir el id del trabajador al formulario padre
        const selectedEmpleado = event.option.value;
        this.empleadoControl.setValue(selectedEmpleado);
        // Si estás usando reactive forms en el componente padre:
        this.form.get('idTrabajador').setValue(selectedEmpleado.id);
    }

    getEmpleadosSubEmpresas(id) {
        this.empleadosService
            .getEmpleadosSubempresas(id)
            .subscribe((response) => {
                if (response.data) {
                    this.empleados = response.data;
                }
            });
    }

    selectedEmpleados(event: MatSelectChange) {
        const id = event.value;
        this.empleadosService
            .getEmpleadosSubempresas(id)
            .subscribe((response) => {
                if (response.data) {
                    this.empleados = response.data;
                    this.empleadoControl.reset('');
                }
            });
    }

    onGuardar() {
        if (this.form.valid) {
            const data = this.form.getRawValue();

           const {cupoAprobado, ...form} = data;
           const createData = {
               cupoAprobado: String(cupoAprobado),
               ...form
           }

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {
                if (response === 'confirmed') {

                    this.creditoConsumoService.postCreditoConsumo(createData).pipe(
                        takeUntilDestroyed(this.destroyedRef),
                    ).subscribe((res) => {
                        console.log(res);

                        this.estadosDatosService.stateGrid.next(true);
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Creado o Actualizado con Exito.',
                            timer: 4000,
                        })
                        this.closeDialog();
                    }, error => {
                        this.swalService.ToastAler({
                            icon: 'error',
                            title: 'Ha ocurrido un error al crear el registro!',
                            timer: 4000,
                        })
                    })

                }else {
                    this.closeDialog();
                }
            })


        }
    }

    private createForm() {
        this.form = this.fb.group({
            idSubEmpresa: ['', Validators.required],
            idTrabajador: ['', Validators.required],
            cupoAprobado: ['', Validators.required],
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
