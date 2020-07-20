import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  intervalSubs: Subscription;
  constructor() { 
    

    // this.retornaObs().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs: ', valor),
    //   error => console.warn('Error', error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.retornaIntervalo().subscribe( console.log )
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{
    const intervals$ = interval(1000)
                        .pipe(
                          filter( valor => valor%2 == 1),
                          map(valor => {
                            return valor + 1
                          }),
                          // take(10)
                        );
    return intervals$
  }

  retornaObs() {
    let i = -1
    const obs$ = new Observable<number>( observer => {

      const intervalo = setInterval( () => {
        
        i++;
        observer.next(i);

        if(i == 4) {
          clearInterval( intervalo);
          observer.complete();
        }

        if( i === 2){
          observer.error('i llego al valor de dos')
        }
      }, 1000)
    });
    return obs$
  }
}
