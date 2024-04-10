import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
    transform(value: string): string {
        const maxCharacters = 400;
        const words = value.split(' ');

        if (value.length <= maxCharacters) {
            return value;
        }

        let truncatedValue = '';
        let currentLength = 0;
        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            if (currentLength + word.length <= maxCharacters) {
                truncatedValue += word + ' ';
                currentLength += word.length + 1; // +1 for the space
            } else {
                break;
            }
        }

        return truncatedValue.trim();
    }
}
