import { Injectable, NgZone } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { BehaviorSubject, Observable } from 'rxjs/index'
import { filter, take } from 'rxjs/internal/operators'
import { AMapPolylineComponent } from '../components/amap-polyline/amap-polyline.component'

@Injectable()
export class AMapPolylineService {
    private polylines: Map<AMapPolylineComponent, Observable<AMap.Polyline>> = new Map()
    constructor(
        private apiWarpper: AMapApiWrapperService,
        private ngZone: NgZone,
    ) {}

    createPolyline$(polylineComponent: AMapPolylineComponent) {
        const subject: BehaviorSubject<AMap.Polyline> = new BehaviorSubject(null)
        const option = AMapPolylineService.polylineOption(polylineComponent)
        this.apiWarpper.createPolyline$(option).subscribe((aPolyline) => {
            subject.next(aPolyline)
        })
        const polyline$ = subject.pipe(filter(item => !!item), take(1))
        this.polylines.set(polylineComponent, polyline$)

        return polyline$
    }

    setOptions(polylineComponent: AMapPolylineComponent) {
        const polyline$ = this.polylines.get(polylineComponent)
        const option = AMapPolylineService.polylineOption(polylineComponent)
        if (polyline$) {
            polyline$.subscribe((aPolyline: AMap.Polyline) => {
                this.ngZone.runOutsideAngular(() => {
                    aPolyline.setOptions(option)
                })
            })
        }
    }

    destroy(polylineComponent: AMapPolylineComponent) {
        const polyline$ = this.polylines.get(polylineComponent)
        if (polyline$) {
            polyline$.subscribe((aPolyline) => {
                this.ngZone.runOutsideAngular(() => {
                    aPolyline.setMap(null)
                })
            })
            this.polylines.delete(polylineComponent)
        }
    }

    getPolyline$(polylineComponent: AMapPolylineComponent) {
        return this.polylines.get(polylineComponent)
    }

    static polylineOption(polylineComponent: AMapPolylineComponent): AMap.PolylineOptions {
        return {
            path: polylineComponent.path,
            zIndex: polylineComponent.zIndex,
            strokeColor: polylineComponent.strokeColor,
            strokeOpacity: polylineComponent.strokeOpacity,
            strokeWeight: polylineComponent.strokeWeight,
            strokeStyle: polylineComponent.strokeStyle,
            isOutline: polylineComponent.isOutline,
            borderWeight: polylineComponent.borderWeight,
            outlineColor: polylineComponent.outlineColor,
            lineJoin: polylineComponent.lineJoin,
            lineCap: polylineComponent.lineCap,
        }
    }
}
