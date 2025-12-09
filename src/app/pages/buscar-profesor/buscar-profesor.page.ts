import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonicSlides, IonIcon, IonButtons, IonMenuButton, IonButton } from '@ionic/angular/standalone';
import { MateriasService } from 'src/app/services/materias.service';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { NivelesComponent } from 'src/app/componentes/niveles/niveles.component';
import { AreaComponent } from 'src/app/componentes/area/area.component';
import { Area } from 'src/app/interfaces/area.interface';
import { MateriaComponent } from "src/app/componentes/materia/materia.component";
import { Materia } from 'src/app/interfaces/materia.interface';
import { ProfesoresComponent } from "src/app/componentes/profesores/profesores.component";
import { addIcons } from 'ionicons';
import { schoolOutline, peopleOutline, layersOutline, bookOutline } from 'ionicons/icons';


@Component({
  selector: 'app-bucas-profesor',
  templateUrl: './buscar-profesor.page.html',
  styleUrls: ['./bucas-profesor.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    NivelesComponent,
    AreaComponent,
    MateriaComponent,
    ProfesoresComponent, IonMenuButton],
})
export class BucasProfesorPage implements OnInit {
  constructor() {
    this.addAllIcons();
  }


  addAllIcons(){
    addIcons({
  'school-outline': schoolOutline,
  'people-outline': peopleOutline,
  'layers-outline': layersOutline,
  'book-outline': bookOutline
});
  }

  nivelSeleccionado: Nivel | null = null;
  areaSeleccionada: Area | null = null;
  materiaSeleccionada: Materia  | null = null;

  ngOnInit() {}

  volverPaso() {
  if (this.materiaSeleccionada) {
    this.materiaSeleccionada = null;
  } else if (this.areaSeleccionada) {
    this.areaSeleccionada = null;
  } else if (this.nivelSeleccionado) {
    this.nivelSeleccionado = null;
  }
}

}
