import { Component } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cobro-trabajadores-maestro',
  standalone: true,
    imports: [
        CustomTableComponent,
        FuseAlertComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatTab,
        MatTabContent,
        MatTabGroup,
        NgIf,
        FuseCardComponent,
        RouterLink,
    ],
  templateUrl: './cobro-trabajadores-maestro.component.html',
  styleUrl: './cobro-trabajadores-maestro.component.scss'
})
export class CobroTrabajadoresMaestroComponent {

}
