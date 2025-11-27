import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonButton,
  IonSpinner,
  IonBackButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { AuthService } from 'src/app/services/auth.service';
import { Profesor } from 'src/app/interfaces/profesor.interface';

@Component({
  selector: 'app-perfil-profesor',
  templateUrl: './perfil-profesor.page.html',
  styleUrls: ['./perfil-profesor.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonBackButton,
    IonSpinner,
    IonButton,
    IonText,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class PerfilProfesorPage implements OnInit {
  profesor?: Profesor;
  modoEdicion = signal(false);
  constructor(
    private route: ActivatedRoute,
    private profesorService: ProfesoresService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      console.log('hay id ');
      this.profesorService
        .obtenerProfesorPorId(Number(id))
        .subscribe((data) => {
          this.profesor = data;
          // Solo permite editar si este profesor pertenece al usuario logueado
          this.modoEdicion.set( this.profesor?.usuario_id === this.authService.usuario?.id);
        });
    } else {
      console.log('no hay ');

      const usuarioId = this.authService.usuario?.id;

      if (usuarioId !== undefined) {
        this.profesorService
          .obtenerProfesorPorIdUsuario(usuarioId)
          .subscribe((data) => {
            this.profesor = data;
            this.modoEdicion.set(true);
          });
      } else {
        console.error('No hay usuario logueado');
      }
    }

    console.log('modoEdicion:', this.modoEdicion, typeof this.modoEdicion);
  }

  enviarWhatsApp(numero: number) {
    const mensaje = encodeURIComponent(
      '¡Hola! Estoy interesado en tus clases, pero cobras muy caro, se puede charlar el precio??.'
    );
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
  }
}
