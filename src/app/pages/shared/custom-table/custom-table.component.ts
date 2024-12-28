import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { IButton } from '../interfaces/buttonsInterfaces';
import { CustomPaginatorService } from './custom-paginator.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
@Component({
  selector: 'app-custom-table',
  standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatIconButton,
        MatButton,
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: CustomPaginatorService }
    ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})


export class CustomTableComponent<T> implements  OnInit, AfterViewInit, OnChanges {
    @Input() columns: string[] = [];
    @Input() displayedColumns: string[] = [];
    @Input() data: T[] = [];
    @Input() buttons: IButton[] = [];
    @Input() columnPropertyMap: { [key: string]: string } = {};
    @Input() searchTerm: string = '';
    @Input() filterProperties: string[] = [];
    filteredData: T[] = [];


    dataSource = new MatTableDataSource<T>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {

        if (this.buttons.length > 0 && !this.displayedColumns.includes('actions')) {
            this.displayedColumns = [...this.displayedColumns, 'actions'];
        }

        this.dataSource.sortingDataAccessor = (data: T, sortHeaderId: string) => {
            const property = this.columnPropertyMap[sortHeaderId] || sortHeaderId;
            return this.resolveNestedProperty(data, property);
        };
    }

    resolveNestedProperty(data: any, property: string): any {
        return property.split('.').reduce((obj, key) => obj && obj[key], data) || '';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.dataSource.data = this.data;
        }

        if (changes['data'] || changes['searchTerm']) {
            this.filterData();
        }

    }

    filterData() {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
        const properties = Object.values(this.columnPropertyMap);
        this.dataSource.data  = this.data.filter((item: any) => {
            return properties.some(property => {
                const valueToFilter = item[property]?.toString().toLowerCase();
                return valueToFilter.includes(lowerCaseSearchTerm);
            });
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onButtonClick(action: (element: T) => void, element: T) {
        action(element);
    }

}
