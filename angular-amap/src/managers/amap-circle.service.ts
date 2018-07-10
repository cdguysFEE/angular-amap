import { Injectable, NgZone } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { AMapCircleComponent } from '../components/amap-circle/amap-circle.component'
import { BehaviorSubject, forkJoin, Observable } from 'rxjs/index'
import { filter, take } from 'rxjs/internal/operators'
import { AMapCircleEditorService } from './amap-circle-editor.service'

@Injectable()
export class AMapCircleService {
    private circles: Map<AMapCircleComponent, Observable<AMap.Circle>> = new Map()
    constructor(
        private apiWarpper: AMapApiWrapperService,
        private ngZone: NgZone,
        private circleEditorService: AMapCircleEditorService,
    ) {}

    createCircle$(circleComponent: AMapCircleComponent) {
        const subject: BehaviorSubject<AMap.Circle> = new BehaviorSubject(null)
        const option: AMap.CircleOptions = {
            center: [circleComponent.longitude, circleComponent.latitude],
            zIndex: circleComponent.zIndex,
            cursor: circleComponent.cursor,
            radius: circleComponent.radius,
            strokeColor: circleComponent.strokeColor,
            strokeOpacity: circleComponent.strokeOpacity,
            fillColor: circleComponent.fillColor,
            fillOpacity: circleComponent.fillOpacity
        }

        this.apiWarpper.createCircle$(option).subscribe((aCircle) => {
            subject.next(aCircle)
        })
        const circle$ = subject.pipe(filter(item => !!item), take(1))
        this.circles.set(circleComponent, circle$)

        return circle$
    }

    setCenter(circleComponent: AMapCircleComponent) {
        const circle$ = this.circles.get(circleComponent)
        if (circle$) {
            circle$.subscribe((aCircle: AMap.Circle) => {
                this.ngZone.runOutsideAngular(() => {
                    aCircle.setCenter([circleComponent.longitude, circleComponent.latitude])
                })
            })
        }
    }

    setZIndex(circleComponent: AMapCircleComponent) {
        const circle$ = this.circles.get(circleComponent)
        if (circle$) {
            circle$.subscribe((aCircle: AMap.Circle) => {
                this.ngZone.runOutsideAngular(() => {
                    aCircle.setzIndex(circleComponent.zIndex)
                })
            })
        }
    }

    setRadius(circleComponent: AMapCircleComponent) {
        const circle$ = this.circles.get(circleComponent)
        if (circle$) {
            circle$.subscribe((aCircle: AMap.Circle) => {
                this.ngZone.runOutsideAngular(() => {
                    aCircle.setRadius(circleComponent.radius)
                })
            })
        }
    }

    editAbleCircle(circleComponent: AMapCircleComponent) {
        this.circleEditorService.createCircleEditor(circleComponent).subscribe()
    }

    closeCircleEditor(circleComponent: AMapCircleComponent) {
        this.circleEditorService.closeCircleEditor(circleComponent)
    }

    createEditorEvent$(eventName: string, circleComponent: AMapCircleComponent) {
        return this.circleEditorService.createEvent$(eventName, circleComponent)
    }

    showCircle(circleComponent: AMapCircleComponent) {
        const circle$ = this.circles.get(circleComponent)
        forkJoin<AMap.Map, AMap.Circle>([this.apiWarpper.getMap(), circle$])
            .subscribe(([aMap, aCircle]) => {
                this.ngZone.runOutsideAngular(() => {
                    aCircle.show()
                })
            })
    }

    hideCircle(circleComponent: AMapCircleComponent) {
        const circle$ = this.circles.get(circleComponent)
        forkJoin<AMap.Map, AMap.Circle>([this.apiWarpper.getMap(), circle$])
            .subscribe(([aMap, aCircle]) => {
                this.ngZone.runOutsideAngular(() => {
                    aCircle.hide()
                })
            })
    }

    destroy(circleComponent: AMapCircleComponent) {
        const circle$ = this.circles.get(circleComponent)
        if (circle$) {
            circle$.subscribe((aCircle) => {
                this.ngZone.runOutsideAngular(() => {
                    aCircle.setMap(null)
                })
            })
            this.circles.delete(circleComponent)

            this.circleEditorService.destroy(circleComponent)
        }
    }

    getCircle$(circleComponent: AMapCircleComponent) {
        return this.circles.get(circleComponent)
    }
}
