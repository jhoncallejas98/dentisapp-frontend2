import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;

  faqs = [
    {
      question: '¿Cómo puedo agendar una cita?',
      answer: 'Puedes agendar tu cita a través de nuestra aplicación DentisApp, llamándonos directamente o enviándonos un mensaje por este formulario.',
      isOpen: false
    },
    {
      question: '¿Qué documentos necesito para mi primera consulta?',
      answer: 'Para tu primera consulta necesitas: documento de identidad, historia clínica previa (si la tienes) y cualquier radiografía reciente.',
      isOpen: false
    },
    {
      question: '¿Aceptan seguros médicos?',
      answer: 'Sí, trabajamos con la mayoría de aseguradoras. Te recomendamos contactarnos para verificar la cobertura de tu póliza específica.',
      isOpen: false
    },
    {
      question: '¿Qué debo hacer en caso de emergencia dental?',
      answer: 'En caso de emergencia dental, llámanos inmediatamente al +57 323 214 3166. Atendemos emergencias fuera del horario habitual.',
      isOpen: false
    },
    {
      question: '¿Ofrecen servicios de ortodoncia?',
      answer: 'Sí, ofrecemos tratamientos de ortodoncia tradicional y con brackets estéticos. Agenda una consulta para evaluar tu caso específico.',
      isOpen: false
    },
    {
      question: '¿Cuánto tiempo toma un tratamiento de implantes?',
      answer: 'El tiempo varía según cada caso, pero típicamente toma entre 3-6 meses desde la primera consulta hasta la colocación final del implante.',
      isOpen: false
    }
  ];

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simular envío del formulario
    setTimeout(() => {
      console.log('Formulario enviado:', this.formData);
      
      // Mostrar mensaje de éxito (aquí podrías integrar con tu backend)
      alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
      
      // Limpiar formulario
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
      
      this.isSubmitting = false;
    }, 2000);
  }

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
