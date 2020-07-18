import { Component, OnInit, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent  {

  @Input() title: string = "Sin titulo"
  

  @Input('label') doughnutChartLabels: Label[] = ['','',''];
  @Input('data') doughnutChartData: MultiDataSet = [[100,100,100]];

  public colors: Color[] = [
    { backgroundColor: [ '#6857E6', '#009FEE', '#F02059'] }
  ]
}
