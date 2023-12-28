import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Observable, Subscription } from 'rxjs';
import Chart, { Colors, elements } from 'chart.js/auto';
import { Participation } from '../core/models/Participation';
import { Olympic } from '../core/models/Olympic';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  idCountry: number = 0;
  nameCountry: string = "";
  medalsPerCountry: number = 0;
  athletePerCountry: number = 0;
  EntriesPerCountry: Participation[] = [];
  allYearsEntriesPerCountry: number[] = [];
  allMedalsEntriesPerCountry: number[] = [];

  entriesPerCountry: number = 0;

  nbrJO: number[] = [];

  loaded: boolean;
  items: Olympic[] = [];
  country: string[] = [];

  olympicObservable: Subscription | undefined;

  constructor(private route: ActivatedRoute, private OlympicService: OlympicService) {
    this.loaded = false;
    this.route.queryParams.subscribe(params => {
      this.idCountry = params['country'];
    });
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
            this.nameCountry = this.country[this.idCountry];

            const participations = this.items.map((item: { participations: Participation[]; }) => item.participations);
            const nbrMedailles: number[] = [];
            const nbrAthlete: number[] = [];

            participations.forEach((participation) => {
              const medailles = participation.map((item: Participation) => item.medalsCount);
              const athlete = participation.map((item: Participation) => item.athleteCount);

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

            this.EntriesPerCountry.forEach((element: Participation) => {
              const yearrr = element.year;
              const medals = element.medalsCount;
              this.allYearsEntriesPerCountry.push(yearrr);
              this.allMedalsEntriesPerCountry.push(medals);

            });

            this.entriesPerCountry = participations[this.idCountry].length;
            this.medalsPerCountry = nbrMedailles[this.idCountry];
            this.athletePerCountry = nbrAthlete[this.idCountry];

          }

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

