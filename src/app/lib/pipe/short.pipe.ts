import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortenString',
})
export class ShortenStringPipe implements PipeTransform {
    transform(value: string): string {
        return value.slice(0, 137) + '...';
    }
}
