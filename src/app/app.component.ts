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
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  pages = [
    { title: 'Home', url: '/home', icon: 'home', active: true },
    { title: 'Perfil', url: '/profile', icon: 'person', active: false },
    { title: 'Cerrar sesión', route: null, icon: 'log-out', active: false },
  ];
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private profesorService: ProfesoresService
  ) {
    this.addAllIcons();
  }

 ngOnInit(): void {
  this.authService.cargarUsuarioDesdeSesion();

  this.authService.usuario$.subscribe((user) => {
    this.usuario = user;

    if (this.usuario) {
      // Consulto si el usuario es profesor
      this.profesorService
        .obtenerProfesorPorIdUsuario(this.usuario.id)
        .subscribe({
          next: (profesor) => {
            // Si existe un profesor para este usuario
            this.profesor = profesor;
            this.generarMenu();
          },
          error: (err) => {
            if (err.status === 404) {
              // No es profesor → profesor queda null
              this.profesor = null;
              this.generarMenu();
            } else {
              console.error('Error al verificar profesor:', err);
            }
          },
        });
    } else {
      // Usuario no logueado
      this.profesor = null;
      this.generarMenu();
    }
  });
}

generarMenu() {
  this.pages = [{ title: 'Home', url: '/home', icon: 'home', active: true }];

  if (this.usuario) {
    this.pages.push(
      { title: 'Perfil Usuario', url: `/perfil-usuario/${this.usuario.id}` , icon: 'person', active: false },
      { title: 'Cerrar sesión', route: null, icon: 'log-out', active: false }
    );

    if (this.profesor) {
      // Si el usuario es profe → mostrar su perfil de profesor
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
    if (!page?.active) {
      const index = this.pages.findIndex((x) => x.active);
      if (index !== -1) {
        this.pages[index].active = false;
      }
      page.active = true;
    }

    if (page?.url) {
      this.router.navigate([page.url]);
    } else {
      this.preguntarCerrarSesion();
    }
  }

  onLogout() {
    this.authService.logOut().subscribe({
      next: () => {
        console.log('Logout exitoso');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en logout', err);
      },
    });
  }

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
