import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'numberSuffix',
  pure: true
})
export class NumberSuffixPipe implements PipeTransform {

  transform(value: number): string {

    const suffixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'];

    if (value == null || !Number.isFinite(value) || value < 0) {
      return '0';
    }

    let power = value === 0 ? 0 : Math.floor(Math.log10(value) / 3);
    if (power < 0) {
      power = 0;
    } else if (power >= suffixes.length) {
      power = suffixes.length - 1;
    }
    if (power < 0) {
      power = 0;
    }
    const scaledValue = value / Math.pow(1000, power);
    const suffix = suffixes[power];

    return scaledValue.toFixed(2) + suffix;
  }

}
