import { Injectable, NgZone } from '@angular/core'
import { LazyMapLoaderService } from '../loaders/lazy-map.loader'
import { filter, map, switchMap, take } from 'rxjs/internal/operators'
import { BehaviorSubject, Observable, Observer } from 'rxjs/index'

@Injectable()
export class AMapApiWrapperService {
    private map$: BehaviorSubject<AMap.Map> = new BehaviorSubject<AMap.Map>(null)
    constructor(
        private maploader: LazyMapLoaderService,
        private ngZone: NgZone
    ) {
    }

    createMap(elem: string | HTMLDivElement, options: AMap.MapOptions): Observable<AMap.Map> {
        this.maploader.load().pipe(take(1)).subscribe(() => {
            return this.ngZone.runOutsideAngular(() => {
                const aMap = new AMap.Map(elem, options)
                this.map$.next(aMap)
            })
        })

        return this.getMap()
    }

    createMarker(option: AMap.MarkerOptions) {
        return this.getMap().pipe(map(aMap => {
            option.map = aMap

            return this.ngZone.runOutsideAngular(() => {
                return new AMap.Marker(option)
            })
        }))
    }

    createTrafficLayer(option: AMap.TrafficOptions) {
        return this.getMap().pipe(map(aMap => {
            option.map = aMap

            return this.ngZone.runOutsideAngular(() => {
                return new AMap.TileLayer.Traffic(option)
            })
        }))
    }

    createInfoWindow(option: AMap.InfoWindowOptions) {
        return this.getMap().pipe(map(() => {
            return this.ngZone.runOutsideAngular(() => {
                return new AMap.InfoWindow(option)
            })
        }))
    }

    createCircle$(option: AMap.CircleOptions) {
        return this.getMap().pipe(map((amap) => {
            return this.ngZone.runOutsideAngular(() => {
                option.map = amap

                return new AMap.Circle(option)
            })
        }))
    }

    createPolyline$(option: AMap.PolylineOptions) {
        return this.getMap().pipe(map((amap) => {
            return this.ngZone.runOutsideAngular(() => {
                option.map = amap

                return new AMap.Polyline(option)
            })
        }))
    }

    createCircleEditor$(circle: AMap.Circle) {
        if (!AMap.CircleEditor) {
            return this.loadPlugin(['AMap.CircleEditor'])
                .pipe(map((amap) => {
                    return this.ngZone.runOutsideAngular(() => {
                        return new AMap.CircleEditor(amap, circle)
                    })
                }))
        }

        return this.getMap().pipe(map((amap) => {
            return this.ngZone.runOutsideAngular(() => {
                return new AMap.CircleEditor(amap, circle)
            })
        }))
    }

    createMouseTool$(): Observable<AMap.MouseTool> {
        if (!window['AMap'] || !window['AMap'].MouseTool) {
            return this.loadPlugin(['AMap.MouseTool'])
                .pipe(map((amap) => {
                    return this.ngZone.runOutsideAngular(() => {
                        return new AMap.MouseTool(amap)
                    })
                }))
        }

        return this.getMap().pipe(map((amap) => {
            return this.ngZone.runOutsideAngular(() => {
                return new AMap.MouseTool(amap)
            })
        }))
    }

    createClusterer$(locations, options: AMap.MarkerClustererOptions) {
        if (!window['AMap'] || !window['AMap'].MarkerClusterer) {
            return this.loadPlugin(['AMap.MarkerClusterer'])
                .pipe(map((amap) => {
                    return this.ngZone.runOutsideAngular(() => {
                        return new AMap.MarkerClusterer(amap, locations, options)
                    })
                }))
        }

        return this.getMap().pipe(map(amap => {
            return this.ngZone.runOutsideAngular(() => {
                return new AMap.MarkerClusterer(amap, locations, options)
            })
        }))
    }

    createText$(option: AMap.TextOptions) {
        return this.getMap().pipe(map(() => {
            return this.ngZone.runOutsideAngular(() => {
                return new AMap.Text(option)
            })
        }))
    }

    setCenter(aMap: AMap.Map, positoin) {
        this.ngZone.runOutsideAngular(() => {
            aMap.setCenter(positoin)
        })
    }

    setZoom(aMap: AMap.Map, zoom: number) {
        this.ngZone.runOutsideAngular(() => {
            aMap.setZoom(zoom)
        })
    }

    getMap(): Observable<AMap.Map> {
        return this.map$.pipe(filter(item => !!item), take(1))
    }

    destroy() {
        this.map$ = new BehaviorSubject<AMap.Map>(null)
    }

    private loadPlugin(plugins: string[]): Observable<AMap.Map> {
        return this.getMap().pipe(switchMap((amap) => {
            return new Observable((observer: Observer<AMap.Map>) => {
                return this.ngZone.runOutsideAngular(() => {
                    amap.plugin(plugins, () => {
                        observer.next(amap)
                        observer.complete()
                    })
                })
            })
        }))
    }
}
