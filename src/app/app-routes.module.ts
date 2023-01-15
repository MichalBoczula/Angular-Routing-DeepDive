import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PreloadStrategy } from './preload-strategy.service';
import { AuthGuard } from './user/auth.guard';

const ROUTES: any = [
    { path: "welcome", component: WelcomeComponent },
    {
        path: 'products',
        canLoad: [AuthGuard], // imposible eager loading
        // canActivate: [AuthGuard], // eager loading
        data: { preload: true }, // added to custom LoadingStrategy
        loadChildren: () => import('./products/product.module')
            .then(m => m.ProductModule)
    },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES,
            { preloadingStrategy: PreloadStrategy }),
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
