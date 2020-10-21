import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {AlertService} from '../alerts/alert.service';
import {ApiUtils} from "../utils/api-utils";
import {ApiObjectService} from "../apidatatable/apiObject.service";

@Injectable({providedIn: 'root'})
export class RulerService extends ApiObjectService {
    protected url = environment.ruler_url + '/api/v1/rules';

    constructor(protected alertService: AlertService, protected httpClient: HttpClient) {
        super(alertService, httpClient);
    }

    getTenantRuleGroups(tenantName: string) {
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName).set('Content-Type', 'application/yaml');
        return this.get(this.url, {
            headers: headers,
            responseType: 'text'
        }).pipe(catchError(this.handleError('getTenantRuleGroups')));
    }

    deleteTenantRuleGroup(tenantName: string, nameSpace: string, ruleGroupName: string) {
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName);
        return this.delete(this.url + '/' + nameSpace + '/' + ruleGroupName, {
            headers: headers,
            responseType: 'json'
        }).pipe(catchError(this.handleError('deleteTenantRuleGroup')));
    }


    createRuleGroup(tenantName: string, nameSpace: string, ruleGroupYaml: string) {
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName);
        return this.post(this.url + '/' + nameSpace, ruleGroupYaml, {headers: headers, responseType: 'json'});
    }

    deleteRuleGroup(tenantName: string, nameSpace: string, ruleGroupName: string) {
        const headers = new HttpHeaders().set('X-Scope-OrgID', tenantName);
        return this.delete(this.url + '/' + nameSpace + '/' + ruleGroupName, {headers: headers, responseType: 'json'})
    }

}
