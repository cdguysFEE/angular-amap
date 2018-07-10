import { Injectable, NgZone } from '@angular/core'
import { AMapMarkerComponent } from '../components/amap-marker/amap-marker.component'
import { AMapApiWrapperService } from './api-wrapper.service'
import { BehaviorSubject, Observable, Observer } from 'rxjs/index'
import { filter, take } from 'rxjs/internal/operators'


@Injectable()
export class AMapMarkerService {
    private markers: Map<AMapMarkerComponent, Observable<AMap.Marker>> = new Map()

    constructor(
        private apiWrapper: AMapApiWrapperService,
        private ngZone: NgZone
    ) {}

    createMarker(markerComponent: AMapMarkerComponent): Observable<AMap.Marker> {
        const subject: BehaviorSubject<AMap.Marker> = new BehaviorSubject(null)
        const option: AMap.MarkerOptions = {
            position: [markerComponent.longitude, markerComponent.latitude],
            content: markerComponent.content,
            offset: { x: markerComponent.offsetX, y: markerComponent.offsetY }
        }

        this.apiWrapper.createMarker(option)
            .subscribe((aMarker) => {
                subject.next(aMarker)
            })

        const marker$ = subject.pipe(filter(item => !!item), take(1))

        this.markers.set(markerComponent, marker$)

        return marker$
    }

    setPosition(markerComponent: AMapMarkerComponent) {
        const marker$ = this.markers.get(markerComponent)
        if (marker$) {
            marker$.subscribe((aMarker) => {
                this.ngZone.runOutsideAngular(() => {
                    aMarker.setPosition([markerComponent.longitude, markerComponent.latitude])
                })
            })
        }
    }

    setContent(markerComponent: AMapMarkerComponent) {
        const marker$ = this.markers.get(markerComponent)
        if (marker$) {
            marker$.subscribe((aMarker) => {
                this.ngZone.runOutsideAngular(() => {
                    aMarker.setContent(markerComponent.content)
                })
            })
        }
    }

    setZIndex(markerComponent: AMapMarkerComponent) {
        const marker$ = this.markers.get(markerComponent)
        if (marker$) {
            marker$.subscribe((aMarker) => {
                this.ngZone.runOutsideAngular(() => {
                    aMarker.setzIndex(markerComponent.zIndex)
                })
            })
        }
    }

    setIcon(markerComponent: AMapMarkerComponent) {
        const marker$ = this.markers.get(markerComponent)
        if (marker$) {
            marker$.subscribe((aMarker) => {
                this.ngZone.runOutsideAngular(() => {
                    aMarker.setIcon(markerComponent.icon)
                })
            })
        }
    }

    setOffset(markerComponent: AMapMarkerComponent) {
        const marker$ = this.markers.get(markerComponent)
        if (marker$) {
            marker$.subscribe((aMarker) => {
                this.ngZone.runOutsideAngular(() => {
                    aMarker.setOffset(
                        new AMap.Pixel(
                            markerComponent.offsetX,
                            markerComponent.offsetY
                        )
                    )
                })
            })
        }
    }

    createEvent$<T>(eventName: string, markerComponent: AMapMarkerComponent): Observable<T> {
        return Observable.create((observer: Observer<T>) => {
            const handler = (e) => {
                observer.next(e)
            }
            let cachedMarker: AMap.Marker = null
            this.markers.get(markerComponent)
                .subscribe((marker) => {
                    cachedMarker = marker
                    marker.on(eventName, handler)
                })

            return () => {
                observer.complete()
                if (cachedMarker) {
                    cachedMarker.off(eventName, handler)
                }
            }
        })
    }

    destroy(markerComponent: AMapMarkerComponent) {
        const marker$ = this.markers.get(markerComponent)
        if (marker$) {
            marker$.subscribe((aMarker) => {
                this.ngZone.runOutsideAngular(() => {
                    aMarker.setMap(null)
                })
            })
            this.markers.delete(markerComponent)
        }
    }
}
