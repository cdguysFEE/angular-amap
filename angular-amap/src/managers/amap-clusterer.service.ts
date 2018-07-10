import { Injectable, NgZone } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { AMapClustererComponent } from '../components/amap-clusterer/amap-clusterer.component'
import { BehaviorSubject, Observable } from 'rxjs/index'
import { filter, map, switchMap, take } from 'rxjs/internal/operators'

@Injectable()
export class AMapClustererService {
    private clusterers: Map<AMapClustererComponent, Observable<AMap.MarkerClusterer>> = new Map()
    constructor(
        private apiWrapper: AMapApiWrapperService,
        private ngZone: NgZone,
    ) {
    }

    createClusterer(clusererComponent: AMapClustererComponent) {
        const locations = clusererComponent.locations
        const subject$ = new BehaviorSubject(null)
        this.ngZone.runOutsideAngular(() => {
            this.locationsToMarkers(locations).pipe(switchMap(aMarkers => {
                return this.apiWrapper.createClusterer$(aMarkers, {})
            })).subscribe((clusterer) => {
                subject$.next(clusterer)
            })
        })
        const clusterer$ = subject$.pipe(filter(item => !!item), take(1))
        this.clusterers.set(clusererComponent, clusterer$)

        return clusterer$
    }

    setMarkers(clusererComponent: AMapClustererComponent) {
        const clusterer$ = this.clusterers.get(clusererComponent)
        if (clusterer$) {
            clusterer$.subscribe((aClusterer) => {
                this.ngZone.runOutsideAngular(() => {
                    const locations = clusererComponent.locations
                    const markers = locations.map(item => new AMap.Marker({
                        position: item
                    }))

                    aClusterer.setMarkers(markers)
                })
            })
        }
    }

    destroy(clusererComponent: AMapClustererComponent) {
        const clusterer$ = this.clusterers.get(clusererComponent)
        if (clusterer$) {
            clusterer$.subscribe((aCluster) => {
                this.ngZone.runOutsideAngular(() => {
                    aCluster.clearMarkers()
                    aCluster.setMap(null)
                })
            })
        }
    }

    private locationsToMarkers(locations: AMap.LngLatLiteral[]) {
        return this.apiWrapper.getMap().pipe(map(() => {
            return locations.map(item => new AMap.Marker({
                position: item
            }))
        }))
    }
}
