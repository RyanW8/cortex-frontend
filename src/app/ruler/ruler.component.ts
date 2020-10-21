import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RulerService} from "./ruler.service";
import {API, Columns} from 'ngx-easy-table';
import {ApidatatableComponent} from '../apidatatable/apidatatable.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../alerts/alert.service';
import {Tenant} from "../objects/Tenants";
import {ConfigService} from "../apidatatable/configuration.service";
import {AddRuleComponent} from "./addRule/addRule.component";

@Component({
    selector: 'app-ruler-component',
    templateUrl: './ruler.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulerComponent extends ApidatatableComponent implements OnInit {


    @ViewChild('actionsTemplate', {static: true}) actionTpl: TemplateRef<any>;
    public columns: Columns[] = [
        {key: 'namespace', title: 'Namespace'},
        {key: 'rulegroup_name', title: 'RuleGroup'},
        {key: 'rule_name', title: 'Rule Name'}
    ]
    public tenants: Tenant[] = []
    public selectedTenant: Tenant;
    private selectedTenantRuleGroups: {};

    constructor(private rulerService: RulerService, protected modalService: NgbModal, protected alertService: AlertService) {
        super(rulerService, modalService, alertService);
    }

    getTenants() {
        this.rulerService.getTenants().subscribe(apiResponse => {
            // @ts-ignore
            this.tenants = apiResponse;
        })
    }

    getData(): void {
        this.rulerService.getTenantRuleGroups(this.selectedTenant.userID).subscribe(
            apiResponse => {
                this.data = [];
                this.selectedTenantRuleGroups = this.rulerService.YAMLToJSON(apiResponse);
                for (var nameSpace of Object.keys(this.selectedTenantRuleGroups)) {
                    this.selectedTenantRuleGroups[nameSpace].forEach(ruleGroup => {
                        ruleGroup.rules.forEach(rule => {
                            this.data.push({
                                'namespace': nameSpace,
                                'rulegroup_name': ruleGroup.name,
                                'rule_name': rule.alert,
                                'rule_object': rule
                            });
                        })
                    })
                }
                this.configuration.isLoading = false;
            }
        );
    }

    removeRuleGroup(object: any): void {
        const confirmed = confirm('This will delete the ENTIRE rule group, are you sure?');
        if (confirmed) {
            this.rulerService.deleteTenantRuleGroup(this.selectedTenant.userID, object.namespace, object.rulegroup_name).subscribe(
                apiResponse => {
                } // TODO Refresh Table with updated
            )
        }
    }

    removeRule(object: any): void {
        let ruleGroupRules = this.getRuleGroupFromTenant(object.rulegroup_name).rules.filter(function (obj) {
            return obj.alert !== object.rule;
        });
        if (ruleGroupRules.length !== 0) {
            const structuredRuleGroupContent = {
                'name': object.rulegroup_name,
                'rules': ruleGroupRules
            }
            const yamlRuleGroup = this.rulerService.JSONToYAML(structuredRuleGroupContent);
            this.rulerService.createRuleGroup(this.selectedTenant.userID, object.namespace, yamlRuleGroup).subscribe(
                apiResponse => {
                    if (apiResponse['status'] === 'success') {
                        this.alertService.success('Successfully deleted Rule "' + object.rule + '"');
                    } else {
                        this.alertService.error('Failed to delete Rule "' + object.rule + '"');
                    }
                }
            )
        } else {
            this.rulerService.deleteRuleGroup(this.selectedTenant.userID, object.namespace, object.rulegroup_name).subscribe(
                apiResponse => {
                    if (apiResponse['status'] === 'success') {
                        this.alertService.success('Successfully deleted RuleGroup "' + object.rulegroup_name + '"');
                    } else {
                        this.alertService.error('Failed to delete RuleGroup "' + object.rulegroup_name + '"');
                    }
                }
            )
        }
    }

    openEditRuleComponent(object: any) {
        if (object === undefined) {
            const modalRef = this.modalService.open(AddRuleComponent, {size: 'lg'});
            modalRef.componentInstance.existingTenantRuleGroups = this.selectedTenantRuleGroups;
            modalRef.componentInstance.tenantName = this.selectedTenant.userID;
            modalRef.result.then(result => {
                this.getData()
            }).catch(reason => null);

        } else {
            const modalRef = this.modalService.open(AddRuleComponent, {size: 'lg'});
            modalRef.componentInstance.existingTenantRuleGroups = this.selectedTenantRuleGroups;
            modalRef.componentInstance.tenantName = this.selectedTenant.userID;
            modalRef.componentInstance.nameSpace = object.namespace;
            modalRef.componentInstance.ruleGroupYAML = this.rulerService.JSONToYAML(
                this.selectedTenantRuleGroups[object.namespace].filter(ruleGroup => ruleGroup.name === object.rulegroup_name)[0]
            );
            modalRef.result.then(result => {
                this.getData()
            }).catch(reason => null);
        }
    }

    getRuleGroupFromTenant(ruleGroupname: string) {
        return this.selectedTenantRuleGroups[this.selectedTenant.userID].filter(function (obj) {
            if (obj.name === ruleGroupname) {
                return obj;
            }
        })[0]
    }


    ngOnInit() {
        this.configuration = ConfigService.config;
        this.configuration.isLoading = false;
        this.getTenants();
        this.columns.push({key: 'actions', title: 'Actions', cellTemplate: this.actionTpl});
    }

}
