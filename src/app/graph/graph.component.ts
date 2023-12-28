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
  loaded: boolean;
  country: string[] = [];
  nbrJO: number[] = [];

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

    this.getOlympics();
  }

  getOlympics(): void {
    this.loaded = false;
    this.olympicObservable = this.OlympicService.getOlympics()
      .subscribe(
        items => {
          this.items = items;
          if (this.items.length > 0) {
            this.country = this.items.map((item: { country: string; }) => item.country);
            const participations = this.items.map((item: { participations: Participation[]; }) => item.participations);
            const nbrMedailles: number[] = [];
            const nbrJOarray: number[] = [];

            participations.forEach((participation: { medalsCount: number; }[]) => {
              const medailles = participation.map((item: { medalsCount: number; }) => item.medalsCount);

              const sumWithInitial = medailles.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
              nbrMedailles.push(sumWithInitial);

            });

            participations.forEach((participation: { year: number; }[]) => {
              const jo = participation.map((item: { year: number; }) => item.year);

              jo.forEach(element => {
                nbrJOarray.push(element);
              });

              this.nbrJO = [...new Set(nbrJOarray)];

            });

            const barChart = new Chart("barCanvas", {
              type: "pie",
              data: {
                labels: this.country,
                datasets: [{
                  data: nbrMedailles,
                }]

              },
              options: {
                onClick: function (evt, element) {
                  if (element.length > 0) {
                    const indexCountry = element.map((item: { index: number; }) => item.index);
                    window.location.href = "/country-details?country=" + indexCountry[0];
                  }
                }
              }
            })

          }
        });
  }


}
