import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MateriasService } from 'src/app/services/materias.service';
import { Nivel } from 'src/app/interfaces/nivel.interface';

@Component({
  selector: 'app-bucas-profesor',
  templateUrl: './buscar-profesor.page.html',
  styleUrls: ['./bucas-profesor.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class BucasProfesorPage implements OnInit {
  constructor(private materiaService: MateriasService) {}

  
niveles: Nivel[] = [];

  ngOnInit() {
    this.materiaService
      .obtenerNivles()
      .subscribe((data) => (this.niveles = data));
  }
}
