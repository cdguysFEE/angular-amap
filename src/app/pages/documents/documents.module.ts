import { NgModule } from '@angular/core'

import { DocumentsComponent } from './documents.component'
import { RouterModule, Routes } from '@angular/router'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { AngularAMapModule } from '../../../../angular-amap/src/angular-amap.module'
import { OverviewComponent } from './overview/overview.component'
import { DocMapComponent } from './amap-map/doc-map.component'
import { DocMarkerComponent } from './amap-marker/doc-marker.component'
import { CommonModule } from '@angular/common'

export const routes: Routes = [
    {
        path: '',
        component: DocumentsComponent,
        children: [
            {
                path: '',
                component: OverviewComponent
            },
            {
                path: 'map',
                component: DocMapComponent
            },
            {
                path: 'marker',
                component: DocMarkerComponent
            }
        ]
    },
]

const COMPONENTS = [
    DocumentsComponent,
    OverviewComponent,
    DocMapComponent,
    DocMarkerComponent,
]

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        AngularAMapModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    exports: [],
    declarations: [
        ...COMPONENTS
    ],
    providers: [],
})
export class DocumentsModule {
}
