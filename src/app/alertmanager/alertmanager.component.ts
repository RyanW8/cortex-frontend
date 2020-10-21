import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../alerts/alert.service';
import {AlertManagerService} from "./alertmanager.service";
import {Tenant} from "../objects/Tenants";
import {ConfigService} from "../apidatatable/configuration.service";
import {ApidatatableComponent} from "../apidatatable/apidatatable.component";
import {API, Columns} from "ngx-easy-table";
import {first, switchMap} from 'rxjs/operators';
import {Observable} from "rxjs";
import {EditConfigComponent} from "./editConfig/editConfig.component";


@Component({
    selector: 'app-cortexalertmanager',
    templateUrl: './alertmanager.component.html',
})
export class AlertManagerComponent extends ApidatatableComponent implements OnInit {

    @ViewChild('actionsTemplate', {static: true}) actionTpl: TemplateRef<any>;
    public tenants: [] = [];
    private tenantObservable: Observable<any> = this.alertManagerService.getTenants();
    public tenantConfiguration: {} = {};
    public columns: Columns[] = [
        {key: 'tenant', title: 'Tenant Name'},
    ]


    constructor(private alertManagerService: AlertManagerService, protected modalService: NgbModal, protected  alertService: AlertService) {
        super(alertManagerService, modalService, alertService);
    }

    ngOnInit() {
        this.configuration = ConfigService.config;
        this.configuration.isLoading = true;
        this.columns.push({key: 'actions', title: 'Actions', cellTemplate: this.actionTpl});
        this.getData();
    }

    getData(): void {
        this.data.push({'tenant': 'someone'});
        this.alertManagerService.getTenants().subscribe(tenants => {
            this.data = [];
            // @ts-ignore
            this.tenants = tenants;
            this.tenants.forEach(tenant => {
                // @ts-ignore
                this.data.push({'tenant': tenant.userID});
            });
            this.configuration.isLoading = false;
            console.log(JSON.stringify(this.data));
            this.table.apiEvent({
                type: API.setTableClass,
                value: 'table table-bordered table-striped table-sm'
            });
        })


    }


    deleteTenantConfig(object: any) {
        const confirmed = confirm('This will delete the ENTIRE config, are you sure?');
        if (confirmed) {
            this.alertManagerService.deleteTenantAlertManagerConfig(object.tenant).subscribe(
                apiResponse => console.log(apiResponse)
            );
        }
    }

    openEditConfigComponent(object: any) {
        const modalRef = this.modalService.open(EditConfigComponent, {size: 'lg'});
        modalRef.componentInstance.existingTenants = this.tenants;
        modalRef.componentInstance.tenant = object.tenant;
        this.alertManagerService.getTenantAlertManagerConfig(object.tenant).subscribe(apiResponse => {
            modalRef.componentInstance.configYAML = apiResponse;
        })

        modalRef.result.then(result => {
            this.getData()
        }).catch(reason => null);

    }

    isJSONString(inputString: string): boolean {
        try {
            JSON.parse(inputString);
            return true;
        } catch (e) {
            this.alertService.error('Invalid JSON! Please validate and try again');
            return false;
        }
    }


}
