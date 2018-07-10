import { Component, OnInit } from '@angular/core'

@Component({
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.less']
})

export class OverviewComponent implements OnInit {
    markers = []
    content = '<div class="marker-icon"></div>'
    constructor() {
    }

    ngOnInit() {
        this.markers = Array(1000).fill(1).map(() => this.createLocation())
    }

    private createLocation() {
        return {
            lat: 38 + Math.random() * 2,
            lng: 115 + Math.random() * 2
        }
    }
}
