import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StringcutPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'stringcut',
})
export class StringcutPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if(value.length > args[0]){
      value = value.substr(0, args[0] - 3) + '...';
    }
    return value;
  }
}


@Pipe({
  name: 'timeString',
})
export class timeStringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    var seconds:number = Math.round(value/1000);
    var retstr:string = '';
    var hours:number = Math.floor(seconds / 3600);
    console.log(seconds);
    if(hours > 0) retstr = hours + ":";
    var mins:number =  Math.floor((seconds - hours * 3600 ) / 60);
    retstr = (mins < 10)? retstr + '0' + mins + ':' : retstr + '' + mins + ':';
    var seconds:number =  seconds - hours * 3600 - mins * 60;
    retstr = (seconds < 10)? retstr + '0' + seconds : retstr + '' + seconds;
    return retstr;
  }
}

