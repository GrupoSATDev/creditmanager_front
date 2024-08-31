import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class DateAdapterService extends NativeDateAdapter {

    override parse(value: any): Date | null {
        return value ? new Date(Date.parse(value)) : null;
    }

    override format(date: Date, displayFormat: Object): string {
        const pad = (n: number) => n < 10 ? '0' + n : n;
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
        const milliseconds = pad(date.getUTCMilliseconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }
}
