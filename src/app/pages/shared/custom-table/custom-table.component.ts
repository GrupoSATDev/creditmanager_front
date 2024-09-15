import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { IButton } from '../interfaces/buttonsInterfaces';

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
    filteredData: T[] = [];


    dataSource = new MatTableDataSource<T>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {

        if (this.buttons.length > 0 && !this.displayedColumns.includes('actions')) {
            this.displayedColumns = [...this.displayedColumns, 'actions'];
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.dataSource.data = this.data;
            console.log('Data received in ngOnChanges:', this.data);

            console.log('Columns:', this.columns);
            console.log('Displayed Columns:', this.displayedColumns);
        }

        if (changes['data'] || changes['searchTerm']) {
            this.filterData();
        }

    }

    filterData() {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
        this.dataSource.data  = this.data.filter((item: any) => {
                return item.razonSocial.toLowerCase().includes(lowerCaseSearchTerm)
            }
        );
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
