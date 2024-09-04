import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  items: MenuItem[] = [
    { label: 'Acuerdos', route: 'acuerdos' },
    { label: 'Agendas', route: 'agendas' },
    { label: 'Áreas', route: 'areas' },
    { label: 'Reuniones', route: 'reuniones' },
    { label: 'Tipos de Reuniones', route: 'tipos-de-reuniones' },
    { label: 'Trabajadores', route: 'trabajadores' },
  ];
}
