import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonCol,
  IonGrid,
  IonTitle,
  IonRow,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-niveles',
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCard,
    IonRow,
    IonTitle,
    IonGrid,
    IonCol,
    IonHeader,
    IonToolbar,
    IonContent,
  ],
})
export class NivelesComponent implements OnInit {
  @Output() nivelSeleccionadoChange: EventEmitter<Nivel> = new EventEmitter<Nivel>();
  @Input() nivelSeleccionado: Nivel | null = null;
  niveles: Nivel[] = [];

  constructor(private materiaService: MateriasService) {}

  ngOnInit() {
    this.materiaService
      .obtenerNivles()
      .subscribe((data) => (this.niveles = data));
  }

  seleccionarNivel(nivel: Nivel) {
    this.nivelSeleccionado = nivel;
    this.nivelSeleccionadoChange.emit(this.nivelSeleccionado);
  }
}
