import { Injectable, NgZone } from '@angular/core'
import { AMapMapComponent } from '../components/amap-map/amap-map.component'
import { AMapApiWrapperService } from './api-wrapper.service'
import { Observable, Observer } from 'rxjs'


@Injectable()
export class AMapMapService {

    constructor(
        private mapApiWrapper: AMapApiWrapperService,
        private ngZone: NgZone
    ) {
    }

    createMap(elememt, aMapComponent: AMapMapComponent) {
        const options: AMap.MapOptions = {
            resizeEnable: aMapComponent.resizeEnable,
            zoom: aMapComponent.zoom,
            center: [aMapComponent.longitude, aMapComponent.latitude]
        }

        return this.mapApiWrapper.createMap(elememt, options)
    }

    setCenter(mapComponent: AMapMapComponent) {
        this.getMap().subscribe((amap) => {
            this.mapApiWrapper.setCenter(
                amap,
                [mapComponent.longitude, mapComponent.latitude]
            )
        })
    }

    setFitView(overlays) {
        this.getMap().subscribe((amap) => {
            this.ngZone.runOutsideAngular(() => {
                amap.setFitView(overlays)
            })
        })
    }

    setZoom(mapComponent: AMapMapComponent) {
        this.getMap().subscribe((amap) => {
            this.mapApiWrapper.setZoom(
                amap,
                mapComponent.zoom
            )
        })
    }

    createEvent$<T>(eventName: string) {
        return Observable.create((observer: Observer<T>) => {
            const handler = (e) => {
                observer.next(e)
            }
            this.getMap().subscribe((aMap) => {
                aMap.on(eventName, handler)
            })

            return () => {
                this.getMap().subscribe((aMap) => {
                    aMap.off(eventName, handler)
                })
            }
        })
    }

    distance(p1, p2) {
        return AMap.GeometryUtil.distance(p1, p2)
    }

    getMap() {
        return this.mapApiWrapper.getMap()
    }

    destroy() {
        this.mapApiWrapper.destroy()
    }

}
