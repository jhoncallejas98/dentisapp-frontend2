import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../../../services/auth-services';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [RouterLink],
  styleUrls: ['./header.css']
})
export class Header {
  menuOpen = false;

  constructor( private authServices: AuthServices, private router: Router) {

  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(){
    this.authServices.deleteLocalStorage('token')
    this.router.navigateByUrl('home')
  }
}