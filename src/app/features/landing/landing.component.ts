import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <-- Agregar esta línea

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink], // <-- Agregar RouterLink aquí
  templateUrl: './landing.component.html',
  // ...
})
export class LandingComponent {
  // ...
}
