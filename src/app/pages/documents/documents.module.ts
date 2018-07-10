import { NgModule } from '@angular/core'

import { DocumentsComponent } from './documents.component'
import { RouterModule, Routes } from '@angular/router'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { AngularAMapModule } from '../../../../angular-amap/src/angular-amap.module'
import { OverviewComponent } from './overview/overview.component'

export const routes: Routes = [
    {
        path: '',
        component: DocumentsComponent,
        children: [
            {
                path: '',
                component: OverviewComponent
            }
        ]
    },
]

@NgModule({
    imports: [
        NgZorroAntdModule,
        AngularAMapModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    exports: [],
    declarations: [DocumentsComponent, OverviewComponent],
    providers: [],
})
export class DocumentsModule {
}
