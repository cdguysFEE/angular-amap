import { NgModule } from '@angular/core'

import { PagesComponent } from './pages.component'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                redirectTo: 'documents',
                pathMatch: 'full',
            },
            {
                path: 'documents',
                loadChildren: 'src/app/pages/documents/documents.module#DocumentsModule',
            },
        ]
    },
]

@NgModule({
    imports: [
        NgZorroAntdModule,
        RouterModule.forChild(routes)
    ],
    exports: [],
    declarations: [PagesComponent],
    providers: [],
})
export class PagesModule {
}
