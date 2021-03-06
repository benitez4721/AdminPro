import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  titulo: string;
  tituloSubs$: Subscription;
  constructor( private router:Router, private route: ActivatedRoute) { 
    this.tituloSubs$ = this.getArgumentRuta().subscribe( ({titulo}) => {this.titulo = titulo;
      document.title = titulo
     })
   
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentRuta(){
    return this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd),
      filter( (event:ActivationEnd) => event.snapshot.firstChild == null),
      map( (event:ActivationEnd) => event.snapshot.data),

    )
    
  }

}
