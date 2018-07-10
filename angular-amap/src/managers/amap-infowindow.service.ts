import { Injectable, NgZone } from '@angular/core'
import { AMapInfoWindowComponent } from '../components/amap-window/amap-window.component'
import { AMapApiWrapperService } from './api-wrapper.service'
import { filter, take } from 'rxjs/internal/operators'
import { BehaviorSubject, forkJoin, Observable, Observer } from 'rxjs/index'

@Injectable()
export class AMapInfoWindowService {
    private infoWindows: Map<AMapInfoWindowComponent, Observable<AMap.InfoWindow>> = new Map()

    constructor(
        private apiWarpperService: AMapApiWrapperService,
        private ngZone: NgZone
    ) {}

    createInfoWindow(windowComponent: AMapInfoWindowComponent): Observable<AMap.InfoWindow> {
        const subject: BehaviorSubject<AMap.InfoWindow> = new BehaviorSubject(null)
        const option: AMap.InfoWindowOptions = {
            content: windowComponent.content,
        }

        if (windowComponent.offsetX !== undefined && windowComponent.offsetY !== undefined) {
            option.offset = {
                x: windowComponent.offsetX,
                y: windowComponent.offsetY
            }
        }

        this.apiWarpperService.createInfoWindow(option).subscribe((infoWindow) => {
            subject.next(infoWindow)
        })

        const infoWindow$ = subject.pipe(filter((item) => !!item), take(1))

        this.infoWindows.set(windowComponent, infoWindow$)

        if (windowComponent.isOpen) {
            this.openInfoWindow(windowComponent)
        }

        return infoWindow$
    }

    changePosition(windowComponent: AMapInfoWindowComponent) {
        const infoWindow$ = this.infoWindows.get(windowComponent)

        forkJoin<AMap.Map, AMap.InfoWindow>([this.apiWarpperService.getMap(), infoWindow$])
            .subscribe(([aMap, infoWindow]) => {
                this.ngZone.runOutsideAngular(() => {
                    infoWindow.setPosition([
                        windowComponent.longitude,
                        windowComponent.latitude
                    ])
                })
            })

    }

    openInfoWindow(windowComponent: AMapInfoWindowComponent) {
        const infoWindow$ = this.infoWindows.get(windowComponent)

        forkJoin<AMap.Map, AMap.InfoWindow>([this.apiWarpperService.getMap(), infoWindow$])
            .subscribe(([aMap, infoWindow]) => {
                this.ngZone.runOutsideAngular(() => {
                    infoWindow.open(aMap, [
                        windowComponent.longitude,
                        windowComponent.latitude
                    ])
                })
            })
    }

    setOffset(windowComponent: AMapInfoWindowComponent) {
        const infoWindow$ = this.infoWindows.get(windowComponent)

        forkJoin<AMap.Map, AMap.InfoWindow>([this.apiWarpperService.getMap(), infoWindow$])
            .subscribe(([aMap, infoWindow]) => {
                this.ngZone.runOutsideAngular(() => {
                    infoWindow.setOffset(new AMap.Pixel(
                        windowComponent.offsetX,
                        windowComponent.offsetY
                    ))
                })
            })
    }

    closeInfoWindow(windowComponent: AMapInfoWindowComponent) {
        const infoWindow$ = this.infoWindows.get(windowComponent)

        forkJoin<AMap.Map, AMap.InfoWindow>([this.apiWarpperService.getMap(), infoWindow$])
            .subscribe(([aMap, infoWindow]) => {
                this.ngZone.runOutsideAngular(() => {
                    infoWindow.close()
                })
            })
    }

    destroy(windowComponent: AMapInfoWindowComponent) {
        const infoWindow$ = this.infoWindows.get(windowComponent)

        forkJoin<AMap.Map, AMap.InfoWindow>([this.apiWarpperService.getMap(), infoWindow$])
            .subscribe(([aMap, infoWindow]) => {
                this.ngZone.runOutsideAngular(() => {
                    infoWindow.close()
                })
            })
        this.infoWindows.delete(windowComponent)
    }

    createEvent$<T>(eventName: string, windowComponent: AMapInfoWindowComponent) {
        return Observable.create((observer: Observer<T>) => {
            const handler = (e) => {
                observer.next(e)
            }
            let cachedInfoWindow: AMap.InfoWindow = null
            this.infoWindows.get(windowComponent)
                .subscribe((aInfoWindow) => {
                    cachedInfoWindow = aInfoWindow
                    aInfoWindow.on(eventName, handler)
                })

            return () => {
                if (cachedInfoWindow) {
                    cachedInfoWindow.off(eventName, handler)
                }
            }
        })
    }
}
