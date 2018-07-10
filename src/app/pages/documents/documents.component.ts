import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/internal/operators'

@Component({
    templateUrl: 'documents.component.html',
    styleUrls: ['documents.component.less']
})

export class DocumentsComponent implements OnInit {
    paths: string[]
    constructor(
        private location: Location,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.createPaths()
        this.router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe(() => {
                this.createPaths()
            })
    }

    private createPaths() {
        this.paths = this.location.path()
            .split('/')
            .map(item => item.replace(
                /^\w/,
                (str) => str.toLocaleUpperCase())
            )
    }
}
