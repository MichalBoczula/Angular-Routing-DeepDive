import { Component } from '@angular/core';
import { slideInAnimation } from './app.animation';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd, NavigationError, NavigationCancel
} from '@angular/router'
import { AuthService } from './user/auth.service';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent {
  pageTitle = 'Acme Product Management';
  loading: boolean = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  get isDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }

  constructor(private authService: AuthService,
    private router: Router,
    private messageService: MessageService) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    })
  }

  checkRouterEvent(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  logOut(): void {
    this.authService.logout();
  }

  displayMessages(): void {
    this.router.navigate([{ outlets: { popup: ['messages'] } }])
    this.messageService.isDisplayed = true;
  }

  hideMessages(): void {
    this.router.navigate([{ outlets: { popup: null } }])
    this.messageService.isDisplayed = false;
  }
}
