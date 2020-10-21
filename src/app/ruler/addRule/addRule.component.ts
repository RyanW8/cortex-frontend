import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RulerService} from "../ruler.service";
import {AlertService} from "../../alerts/alert.service";


@Component({
    selector: 'app-edit-rule',
    templateUrl: './addRule.component.html',
})
export class AddRuleComponent implements OnInit {


    public ruleGroupYAML: string;
    public nameSpace: string;
    public tenantName: string;
    public existingTenantRuleGroups: {} = {};
    public ruleGroupJson: {} = {};

    constructor(
        public activeModal: NgbActiveModal,
        protected rulerService: RulerService,
        protected alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.setupEmptyTenant()
    }


    setupEmptyTenant(){
        if (this.existingTenantRuleGroups[this.nameSpace] === undefined){
            this.existingTenantRuleGroups = {};
            this.existingTenantRuleGroups[this.nameSpace] = [];
        }
    }

    doesNameSpaceExist() {
        return this.nameSpace in this.existingTenantRuleGroups;
    }

    doesRuleGroupExist() {
        // @ts-ignore
        return this.existingTenantRuleGroups[this.nameSpace].filter(ruleGroup => ruleGroup.name === this.ruleGroupJson.name).length !== 0;
    }

    save() {
        this.ruleGroupJson = this.rulerService.YAMLToJSON(this.ruleGroupYAML);
        const formattedYAML = this.rulerService.JSONToYAML(this.ruleGroupJson);
        if (!this.doesNameSpaceExist()) {
            this.existingTenantRuleGroups[this.nameSpace] = [];
        }
        if (this.doesRuleGroupExist()) {
            const confirmed = confirm('There is already a Rule Group with this name in this namespace, saving will overwrite it. Are you sure?');
            if (confirmed) {
                this.rulerService.createRuleGroup(
                    this.tenantName,
                    this.nameSpace,
                    formattedYAML
                ).subscribe(apiResponse => {
                    if (apiResponse['status'] === 'success') {
                        this.alertService.success('Successfully updated RuleGroup "' + this.ruleGroupJson['name'] + '"');
                    } else {
                        this.alertService.error('Failed to update RuleGroup "' + this.ruleGroupJson['name'] + '"');
                    }
                });
                this.activeModal.close();
                return;
            }
        }
        this.rulerService.createRuleGroup(
            this.tenantName,
            this.nameSpace,
            formattedYAML,
        ).subscribe(apiResponse => {
            if (apiResponse['status'] === 'success') {
                this.alertService.success('Successfully created Rule Group "' + this.ruleGroupJson['name'] + '"');
            } else {
                this.alertService.error('Failed to create Rule Group "' + this.ruleGroupJson['name'] + '"');
            }
        });
        this.activeModal.close();
    }

}
