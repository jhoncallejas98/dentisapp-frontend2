import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside-bar',
  imports: [RouterModule],
    standalone: true,
  templateUrl: './aside-bar.html',
  styleUrl: './aside-bar.css'
})
export class AsideBar {
    showComingSoon() {
    alert("✨ Próximamente disponible");
  }

}
