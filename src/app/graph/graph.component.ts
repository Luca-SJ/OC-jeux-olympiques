import { Component, OnInit } from '@angular/core';
import Chart, { Colors } from 'chart.js/auto';
import { OlympicService } from '../core/services/olympic.service';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  items: any;
  loaded: boolean;
  country: string[] = [];
  nbrJO: number[] = [];
  // pays1 = "test";

  constructor(
    private OlympicService: OlympicService) {
    this.loaded = false;

    // interface olympic {
    //   id: number;
    //   country: string;
    // }
  }

  ngOnInit(): void {

    this.getOlympics();

    // const barCanvas = document.getElementById("barCanvas");
    // const barChart = new Chart("barCanvas", {
    //   type: "pie",
    //   data: {
    //     labels: [this.items[0].country, "Italie", "Espagne"],
    //     datasets: [{
    //       data: [100, 300, 200]
    //     }]
    //   }
    // })
  }

  getOlympics(): void {
    this.loaded = false;
    this.OlympicService.getOlympics()
      .subscribe(
        items => {
          this.items = items;
          // this.loaded = true;
          // console.log(items);
          console.log(items);
          if (this.items) {
            this.country = this.items.map((item: { country: any; }) => item.country);
            // console.log(this.country);
            const participations = this.items.map((item: { participations: any; }) => item.participations);
            const nbrMedailles: number[] = [];
            const nbrJOarray: number[] = [];

            participations.forEach((participation: { medalsCount: any; }[]) => {
              const medailles = participation.map((item: { medalsCount: any; }) => item.medalsCount);

              const sumWithInitial = medailles.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
              nbrMedailles.push(sumWithInitial);

            });

            participations.forEach((participation: { year: any; }[]) => {
              const jo = participation.map((item: { year: any; }) => item.year);

              jo.forEach(element => {
                nbrJOarray.push(element);
              });

              this.nbrJO = [...new Set(nbrJOarray)];
              // console.log(this.nbrJO.length);

            });

            // console.log(participations);
            // console.log(nbrJO);
            // console.log(medailles);
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
                    const indexCountry = element.map((item: { index: any; }) => item.index);
                    console.log(indexCountry[0]);
                    window.location.href = "/country-details?country=" + indexCountry[0];
                  }
                }
              }
            })

          }
        });
  }


}
