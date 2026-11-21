import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'hashSuffix'
})
export class HashSuffixPipe implements PipeTransform {

  private static _this = new HashSuffixPipe();

  public static transform(value: number): string {
    return this._this.transform(value);
  }

  public transform(value: number): string {

    if (value == null || !Number.isFinite(value) || value < 0) {
      return '0';
    }

    const suffixes = [' H/s', ' KH/s', ' MH/s', ' GH/s', ' TH/s', ' PH/s', ' EH/s', ' ZH/s', ' YH/s', ' RH/s', ' QH/s'];

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

    return scaledValue.toFixed(1) + suffix;
  }


}
