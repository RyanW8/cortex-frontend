import {Injectable} from '@angular/core';
import {config, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {AlertService} from '../alerts/alert.service';
import {ApiUtils} from "../utils/api-utils";
import {ApiObjectService} from "../apidatatable/apiObject.service";

@Injectable({providedIn: 'root'})
export class AlertManagerService extends ApiObjectService {
    protected url = environment.alertmanager_url + '/api/v1/alerts';

    constructor(protected http: HttpClient, protected alertService: AlertService) {
        super(alertService, http);
    }

    getTenantAlertManagerConfig(tenantName: string) {
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName).set('Content-Type', 'application/yaml');
        return this.get(this.url, {
            headers: headers,
            responseType: 'text'
        }).pipe(catchError(this.handleError('getTenantAlertingConfig')));
    }

    setTenantAlertManagerConfig(tenantName: string, configYAML: string) {
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName).set('Content-Type', 'application/yaml');
        return this.post(this.url, configYAML, {headers: headers}).pipe(
            catchError(this.handleError('setTenantAlertManagerConfig'))
        );
    }

    deleteTenantAlertManagerConfig(tenantName: string){
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName);
        return this.delete(this.url, {headers: headers}).pipe(
            catchError(this.handleError('deleteTenantAlertManagerConfig'))
        );

    }

}
