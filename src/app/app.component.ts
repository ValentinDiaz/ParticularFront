import { Component, OnInit } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonLabel,
  IonIcon,
  IonItem,
  IonList,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenu,
  IonAvatar,
  IonText,
  IonMenuToggle,
  IonButton,
} from '@ionic/angular/standalone';
import { ChangeDetectorRef } from '@angular/core'; // <--- IMPORTANTE

import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from './interfaces/usuario.interface';
import { addIcons } from 'ionicons';
import {
  add,
  arrowBackOutline,
  bagHandle,
  bagHandleOutline,
  bagHandleSharp,
  documentLockOutline,
  documentLockSharp,
  homeOutline,
  homeSharp,
  informationCircleOutline,
  informationCircleSharp,
  keyOutline,
  keySharp,
  locationOutline,
  locationSharp,
  logInSharp,
  logOutOutline,
  logOutSharp,
  personOutline,
  personSharp,
  remove,
  schoolOutline,
  schoolSharp,
  star,
  ticketOutline,
  trashOutline,
} from 'ionicons/icons';
import { NgClass } from '@angular/common';
import { LoginRequest } from './interfaces/login-request.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { Profesor } from './interfaces/profesor.interface';
import { ProfesoresService } from './services/profesores.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonButton,
    IonText,
    IonAvatar,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    NgClass,
    IonMenuToggle,
  ],
})
export class AppComponent implements OnInit {
  usuario: Usuario | null = null;
  profesor!: Profesor | null;

  pages: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private profesorService: ProfesoresService,
    private loadingCtrl: LoadingController,
    private cd: ChangeDetectorRef,
  ) {
    this.addAllIcons();
  }

  ngOnInit(): void {
    // 1. Escuchar cambios (REACTIVO)
    this.authService.usuario$.subscribe((user) => {
      console.log('AppComponent detectó cambio de usuario:', user);

      this.usuario = user;

      // --- CORRECCIÓN CLAVE ---
      if (!user) {
        // Si no hay usuario, LIMPIAMOS INMEDIATAMENTE al profesor
        this.profesor = null;
      }

      // Regeneramos el array del menú con los nuevos datos (o nulls)
      this.generarMenu();

      // --- EL TRUCO MÁGICO ---
      // Forzamos a Angular a repintar el HTML del menú en este preciso momento
      this.cd.detectChanges();

      if (user) {
        // Si hay usuario, buscamos si es profe
        this.verificarSiEsProfesor(user.id);
      }
    });
    // La validación inicial contra /auth/me ya la hace el constructor de AuthService;
    // no hace falta repetirla acá (evita un GET /auth/me duplicado en cada carga).
  }

  private verificarSiEsProfesor(id: number) {
    this.profesorService.obtenerProfesorPorIdUsuario(id).subscribe({
      next: (p) => {
        this.profesor = p;
        this.generarMenu(); // CORRECCIÓN: Regeneramos para AGREGAR la opción de profe
      },
      error: () => {
        this.profesor = null;
        this.generarMenu(); // Regeneramos por si había basura anterior
      },
    });
  }

  generarMenu() {
    // Reiniciamos el array
    this.pages = [
      {
        title: 'Home',
        url: '/home',
        icon: 'home',
        active: this.router.url === '/home',
      },
    ];

    if (this.usuario) {
      this.pages.push({
        title: 'Perfil Usuario',
        url: `/perfil-usuario/${this.usuario.id}`,
        icon: 'person',
        active: false, // Ojo: La lógica de 'active' es mejor manejarla con routerLinkActive en el HTML
      });

      if (this.profesor) {
        this.pages.push({
          title: 'Perfil Profesor',
          url: `/perfil-profesor/${this.profesor.id}`,
          icon: 'school',
          active: false,
        });
      } else {
        this.pages.push({
          title: 'Hacete Profe',
          url: '/registro-profesor',
          icon: 'school',
          active: false,
        });
      }

      // Botón Cerrar Sesión (Siempre al final)
      this.pages.push({
        title: 'Cerrar sesión',
        url: null,
        icon: 'log-out',
        active: false,
      });
    } else {
      this.pages.push({
        title: 'Iniciar sesión',
        url: '/login',
        icon: 'log-in',
        active: false,
      });
    }
  }

  addAllIcons() {
    addIcons({
      star,
      bagHandleOutline,
      bagHandle,
      bagHandleSharp,
      trashOutline,
      add,
      remove,
      arrowBackOutline,
      ticketOutline,
      locationOutline,
      homeOutline,
      homeSharp,
      informationCircleOutline,
      informationCircleSharp,
      documentLockOutline,
      documentLockSharp,
      logOutOutline,
      logOutSharp,
      personOutline,
      personSharp,
      locationSharp,
      keyOutline,
      keySharp,
      logInSharp,
      schoolOutline,
      schoolSharp,
    });
  }

  onItemTap(page: any) {
    // CORRECCIÓN: Simplificamos la lógica de navegación
    if (page.url) {
      this.router.navigate([page.url]);
    } else {
      // Si no tiene URL, asumimos que es una acción (Logout)
      this.preguntarCerrarSesion();
    }
  }

  async onLogout() {
    const loading = await this.loadingCtrl.create({
      message: 'Cerrando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    this.authService.logOut().subscribe({
      next: async () => {
        await loading.dismiss();
        // Si tu authService ya redirige, quita esta línea.
        // Si no, déjala para ir al home.
        this.router.navigate(['/home']);
      },
      error: async (err) => {
        console.error('Error logout', err);
        await loading.dismiss();
        // Incluso si da error, forzamos la ida al home o login
        this.router.navigate(['/home']);
      },
    });
  }

  // ... resto de funciones (preguntarCerrarSesion, addIcons) iguales ...
  async preguntarCerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Querés cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí',
          handler: () => {
            this.onLogout();
          },
        },
      ],
    });
    await alert.present();
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}
