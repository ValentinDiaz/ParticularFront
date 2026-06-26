import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Area } from 'src/app/interfaces/area.interface';
import { Materia } from 'src/app/interfaces/materia.interface';
import { Nivel } from 'src/app/interfaces/nivel.interface';
import { MateriasService } from 'src/app/services/materias.service';
import {
  IonGrid,
  IonRow,
  IonCard,
  IonCol,
  IonCardContent,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
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
  ticketOutline,
  trashOutline,
  searchOutline,
  chatbubblesOutline,
  chatbubblesSharp,
  starOutline,
  sendOutline,
  closeCircleOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { Profesor } from 'src/app/interfaces/profesor.interface';
import { HttpClient } from '@angular/common/http';
import { Mensaje } from 'src/app/interfaces/mensaje.interface';
import { CommonModule } from '@angular/common';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ia-chat',
  templateUrl: './ia-chat.component.html',
  styleUrls: ['./ia-chat.component.scss'],
  imports: [IonicModule,FormsModule,CommonModule],
})
export class IaChatComponent implements OnInit {

  chatAbierto = false;
  mensajes: Mensaje[] = [];
  mensajeUsuario = '';
  cargando = false;

  private URL_BASE = 'http://localhost:3000/api';

  constructor(private profesorService: ProfesoresService, private router:Router) {
    addIcons({
      sparklesOutline,
      sendOutline,
      personOutline,
      schoolOutline,
      closeCircleOutline,
    });
  }
  ngOnInit() {}

  abrirChat() {
    this.chatAbierto = true;

    // Mensaje de bienvenida
    if (this.mensajes.length === 0) {
      this.mensajes.push({
        tipo: 'ia',
        texto:
          '¡Hola! 👋 Soy tu asistente virtual. Contame qué tipo de profesor estás buscando y te ayudo a encontrarlo.',
        timestamp: new Date(),
      });
    }
  }

  cerrarChat() {
    this.chatAbierto = false;
  }

 enviarMensaje() {
  if (!this.mensajeUsuario.trim() || this.cargando) return;

  // 1. Mostrar mensaje usuario
  const consulta = this.mensajeUsuario;
  this.mensajes.push({
    tipo: 'usuario',
    texto: consulta,
    timestamp: new Date(),
  });

  this.mensajeUsuario = '';
  this.cargando = true;
  setTimeout(() => this.scrollToBottom(), 100);

  const body = { message: consulta };

  this.profesorService.enviarMensajeChatbot(body).subscribe(
    (response: any) => {
      this.cargando = false;
      let textoParaMostrar = '';
      let listaProfesores: any[] = [];

      // --- AQUÍ ESTÁ EL CAMBIO ---
      
      // 1. Extraemos el array real de profesores
      let rawProfesores = [];
      
      // CASO A: Viene encapsulado en { type: 'data', data: [...] }
      if (response && response.data && Array.isArray(response.data)) {
        rawProfesores = response.data;
      } 
      // CASO B: Viene el array directo (por si acaso cambia el backend)
      else if (Array.isArray(response)) {
        rawProfesores = response;
      }

      // 2. Procesamos los datos
      if (rawProfesores.length > 0) {
        textoParaMostrar = `¡Listo! Encontré estos profesores para vos:`;
        
        // Mapeamos para arreglar el tema de las 'materias'
        listaProfesores = rawProfesores.map((p: any) => ({
          ...p,
          // Convertimos el array de objetos materias a array de strings para que se vea bien en el HTML
          materias: p.materias ? p.materias.map((m: any) => m.nombre || m) : []
        }));

      } else if (rawProfesores.length === 0 && (response.type === 'data' || Array.isArray(response))) {
        textoParaMostrar = 'Busqué en la base de datos, pero no encontré profesores con esas características.';
      }
      // CASO C: Es solo texto (ej: mensajes de error del backend)
      else if (typeof response === 'string') {
        textoParaMostrar = response;
      }
      else if (response && response.message) {
        textoParaMostrar = response.message;
      } 
      else {
        textoParaMostrar = 'Recibí una respuesta, pero no pude interpretarla.';
        console.log('Estructura desconocida:', response);
      }

      // 3. Mostrar resultado
      this.mensajes.push({
        tipo: 'ia',
        texto: textoParaMostrar,
        profesores: listaProfesores,
        timestamp: new Date(),
      });
      setTimeout(() => this.scrollToBottom(), 100);
    },
    (error) => {
      this.cargando = false;
      console.error('Error:', error);
      this.mensajes.push({
        tipo: 'ia',
        texto: 'Tuve un problema de conexión.',
        timestamp: new Date(),
      });
      setTimeout(() => this.scrollToBottom(), 100);
    }
  );
}

  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollToBottom() {
    const container = document.querySelector('.mensajes-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  verPerfilProfesor(profesor: Profesor) {
    this.router.navigate(['/perfil-profesor', profesor.id]);

  }
}
