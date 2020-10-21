import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
    selector: 'app-nav',
    templateUrl: 'nav.component.html'
})
export class NavComponent implements OnInit {
    menu = [];
    fullmenu = [
        {
            name: 'Ruler',
            routes: [
                {name: 'Tenant Alerting Rules', path: '/cortex/ruler'},
            ]
        },
        {
            name: 'AlertManager',
            routes: [
                {name: 'Tenant Configs', path: '/cortex/alertmanager'},
            ]
            
        }
    ];


    ngOnInit() {
        this.getMenuItems();
    }

    getMenuItems() {
        this.menu = [];
        for (let menuitem of this.fullmenu) {
            const allowedRoutes = [];
            for (let route of menuitem.routes) {
                allowedRoutes.push(route);

            }
            if (allowedRoutes.length > 0) {
                this.menu.push({name: menuitem.name, routes: allowedRoutes});
            }
        }
    }

}
