import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
  imports: [ IonicModule],
})
export class PerfilUsuarioPage implements OnInit {
  usuario?: Usuario;
  modoEdicion = signal(false);

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const usuarioActual = this.authService.getUsuarioActual();

    if (!usuarioActual) {
      console.error('No hay usuario logueado');
      return;
    }

    /** ✔ Caso 1: hay id en la URL */
    if (idParam) {
      const id = Number(idParam);

      // ⚠ Aquí podrías tener un servicio para obtener usuarios por id si existe
      // Por ahora simulamos solo con usuarioActual
      this.usuario = usuarioActual;

      // Solo puede editar si el id en la URL coincide con el id del usuario logueado
      this.modoEdicion.set(id === usuarioActual.id);
    } else {
      /** ✔ Caso 2: NO hay id → perfil propio del usuario */
      this.usuario = usuarioActual;
      this.modoEdicion.set(true); // Siempre puede editar su propio perfil
    }
  }
}
