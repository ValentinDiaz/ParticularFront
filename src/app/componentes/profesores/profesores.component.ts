import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader, IonIcon, IonButton, IonChip, IonLabel, IonAvatar, IonBadge, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { Materia } from 'src/app/interfaces/materia.interface';
import { Profesor } from 'src/app/interfaces/profesor.interface';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardTitle, IonBadge, IonAvatar, IonLabel, IonChip, IonButton, IonIcon, IonCardHeader, IonCardContent, IonCard, IonCol, IonRow, IonGrid,CommonModule],
})
export class ProfesoresComponent implements OnChanges {
buscarOtraMateria() {
throw new Error('Method not implemented.');
}
  @Input() materiaSeleccionada: Materia | null = null;
  profesores: Profesor[] = [];
  cargandoProfesores = true;

  constructor(private profesorService: ProfesoresService, private router:Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materiaSeleccionada'] && this.materiaSeleccionada) {
      this.cargandoProfesores=true;
      this.profesorService
        .obtenerProfesorByMateria(this.materiaSeleccionada.id)
        .subscribe((data) => (this.profesores = data));
        this.cargandoProfesores=false;
    }
  }

  obtenerNombresMaterias(profesor: Profesor): string {
    return profesor.materias?.map((m) => m.nombre).join(', ') ?? '';
  }

  seleccionarProfesor(profesor: Profesor) {
    this.router.navigate(['/perfil-profesor', profesor.id]);

  }
}
