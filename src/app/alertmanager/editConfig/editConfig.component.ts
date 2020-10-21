import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertManagerService} from "../alertmanager.service";
import {AlertService} from "../../alerts/alert.service";


@Component({
    selector: 'app-edit-config',
    templateUrl: './editConfig.component.html',
})
export class EditConfigComponent implements OnInit {


    public configYAML: string;
    public tenant: string;
    public existingTenants: [] = [];

    constructor(
        public activeModal: NgbActiveModal,
        protected alertManagerService: AlertManagerService,
        protected alertService: AlertService
    ) {
    }

    ngOnInit(): void {
    }


    save() {
        this.alertManagerService.setTenantAlertManagerConfig(
            this.tenant,
            this.configYAML
        ).subscribe(
            apiResponse => {
            }
        );
        this.activeModal.close();
    }

}
