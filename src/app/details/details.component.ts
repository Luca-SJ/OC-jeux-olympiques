import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { GraphComponent } from '../graph/graph.component';
import Chart, { Colors } from 'chart.js/auto';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  idCountry: any;
  nameCountry: string = "";
  medalsPerCountry: number = 0;
  athletePerCountry: number = 0;
  EntriesPerCountry: any;
  allYearsEntriesPerCountry: number[] = [];
  allMedalsEntriesPerCountry: number[] = [];

  entriesPerCountry: number = 0;

  nbrJO: number[] = [];

  loaded: boolean;
  items: any;
  country: string[] = [];

  constructor(private route: ActivatedRoute, private OlympicService: OlympicService) {
    this.loaded = false;
    this.route.queryParams.subscribe(params => {
      this.idCountry = params['country'];
    });
  }



  ngOnInit(): void {
    this.getOlympics();

  }

  getOlympics(): void {
    this.loaded = false;
    this.OlympicService.getOlympics()
      .subscribe(
        items => {
          this.items = items;

          if (this.items) {
            this.country = this.items.map((item: { country: any; }) => item.country);
            this.nameCountry = this.country[this.idCountry];
            // console.log(this.country);
            // console.log(this.nameCountry);

            const participations = this.items.map((item: { participations: any; }) => item.participations);
            const nbrMedailles: number[] = [];
            const nbrAthlete: number[] = [];

            participations.forEach((participation: { medalsCount: any; athleteCount: any; }[]) => {
              const medailles = participation.map((item: { medalsCount: any; }) => item.medalsCount);
              const athlete = participation.map((item: { athleteCount: any; }) => item.athleteCount);

              const sumWithInitial = medailles.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
              const sumWithInitial2 = athlete.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
              nbrMedailles.push(sumWithInitial);
              nbrAthlete.push(sumWithInitial2);

            });

            this.EntriesPerCountry = participations[this.idCountry];

            this.EntriesPerCountry.forEach((element: any) => {
              const yearrr = element.year;
              const medals = element.medalsCount;
              this.allYearsEntriesPerCountry.push(yearrr);
              this.allMedalsEntriesPerCountry.push(medals);

            });
            // console.log(this.allYearsEntriesPerCountry);
            // console.log(this.allMedalsEntriesPerCountry);
            // console.log(nbrYear);

            this.entriesPerCountry = participations[this.idCountry].length;

            // console.log(participations[0].length);
            // console.log(participations[0]);
            this.medalsPerCountry = nbrMedailles[this.idCountry];
            this.athletePerCountry = nbrAthlete[this.idCountry];

            // console.log(this.yearsEntriesPerCountry);
            // console.log(items);
            // console.log(nbrMedailles);
            // console.log(this.nbrJO);
          }
          // console.log(this.allYearsEntriesPerCountry);
          if (this.allYearsEntriesPerCountry?.length > 0) {
            const barChart = new Chart("barCanvas2", {
              type: "line",
              data: {
                labels: this.allYearsEntriesPerCountry,
                datasets: [{
                  data: this.allMedalsEntriesPerCountry,
                }]

              },
              options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                  }
                }
            })
          }
        });


  }

}

