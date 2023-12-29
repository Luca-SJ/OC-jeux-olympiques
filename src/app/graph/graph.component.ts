import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart, { Colors } from 'chart.js/auto';
import { OlympicService } from '../core/services/olympic.service';
import { Observable, Subscription } from 'rxjs';
import { Participation } from '../core/models/Participation';
import { Olympic } from '../core/models/Olympic';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnInit, OnDestroy {
  items: Olympic[] = [];

  countryCollection: string[] | undefined;
  nbrCountry: number = 0;

  nbrMedailles: number[] = [];

  loaded: boolean;
  country: string[] = [];
  nbrJOarray: number[][] = [];

  olympicObservable: Subscription | undefined;

  constructor(
    private OlympicService: OlympicService) {
    this.loaded = false;
  }
  ngOnDestroy(): void {
    if (this.olympicObservable) {
      this.olympicObservable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loadAllDatas();
  }

  loadAllDatas(): void {
    this.olympicObservable = this.OlympicService.getCountrys()
      .subscribe(
        itemsCountry => {
          if (itemsCountry?.length) {
            this.nbrCountry = itemsCountry?.length;
            this.countryCollection = itemsCountry;
            this.olympicObservable = this.OlympicService.getMedalsPerCountry()
              .subscribe(
                itemsMedals => {
                  if (itemsMedals?.length) {
                    this.nbrJOarray = itemsMedals;

                    const barChart = new Chart("barCanvas", {
                      type: "pie",
                      data: {
                        labels: this.countryCollection,
                        datasets: [{
                          data: itemsMedals[0]
                        }]
                      },
                      options: {
                        onClick: (evt, element) => {
                          if (element.length > 0) {
                            const indexCountry = element.map((item: { index: number; }) => item.index);
                            const countryName = this.countryCollection? this.countryCollection[indexCountry[0]]:"";
                            window.location.href = "/country-details?country=" + (countryName);
                          }
                        }
                      }
                    })
                  }
                }
              );
          }
        }
      );
  }
}
