import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'maskContactNumber',
})
export class MaskContactNumberPipe implements PipeTransform {

    transform(data:any) {
        if(data.length == 10){
            return data.replace(/\d(?=\d{4})/g, "*");
        }else{
            let splitData=data.split('@');
            return this.maskValue(splitData[0].split(''))+'@'+splitData[1];
        }
    }
    maskValue(x:any){
        let y:string[]=[];
        x.forEach((element:any,index:any) => {
          if(index<(x.length/2)){
            y.push('*');
          }else{
            y.push(element);
          }
        });
        return y.join('');
      }
}
