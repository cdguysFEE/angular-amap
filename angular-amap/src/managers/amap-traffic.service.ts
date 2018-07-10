import { Injectable } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { AMapTrafficComponent } from '../components/amap-traffic/amap-traffic.component'
import { BehaviorSubject } from 'rxjs/index'

@Injectable()
export class AMapTrafficService {
    private trafficLayer$: BehaviorSubject<AMap.TileLayer.Traffic>

    constructor(private apiWarpper: AMapApiWrapperService) {
    }

    createTrafficLayer(trafficComponent: AMapTrafficComponent) {
        const subject: BehaviorSubject<AMap.TileLayer.Traffic> = new BehaviorSubject(null)
        const option: AMap.TrafficOptions = {
            zIndex: trafficComponent.zIndex
        }

        const layer$ = this.apiWarpper.createTrafficLayer(option)
        layer$.subscribe((layer) => {
            subject.next(layer)
        })
        this.trafficLayer$ = subject
    }

    destroy() {
        this.trafficLayer$.subscribe((layer) => {
            layer.hide()
            layer.setMap(null)
            this.trafficLayer$.complete()
        })
    }
}
