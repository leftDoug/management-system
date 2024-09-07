import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';

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
    {
      label: 'Perfil',
      items: [
        { label: 'Cambiar Contraseña' },
        {
          label: 'Cerrar Sesión',
          command: () => {
            this.authService.logout();
            this.router.navigateByUrl('/');
          },
        },
      ],
    },
  ];

  constructor(private router: Router, private authService: AuthService) {}
}
