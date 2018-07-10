import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LAZY_MAPS_API_CONFIG } from '../../angular-amap/src/loaders/lazy-map.loader'
import { PageNotFoundComponent } from './404/page-not-found.component'
import { RouterModule, Routes } from '@angular/router'
import { PagesModule } from './pages/pages.module'

const routes: Routes = [
    {
        path: '404',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    },
]

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        PagesModule,
    ],
    providers: [
        { provide: LAZY_MAPS_API_CONFIG, useValue: { v: '1.4.6'}}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
