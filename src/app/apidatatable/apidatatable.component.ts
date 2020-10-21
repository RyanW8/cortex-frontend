import { Component, OnInit, ViewChild, Optional, TemplateRef, Directive } from '@angular/core';
import {API, APIDefinition, Columns, Config, DefaultConfig} from 'ngx-easy-table';
import {ApiObjectService} from './apiObject.service';
import {ConfigService} from './configuration.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../alerts/alert.service';

@Directive()
export abstract class ApidatatableComponent implements OnInit {
  @ViewChild('table', {static: true}) table: APIDefinition;
  @ViewChild('actionTpl', {static: true}) actionTpl: TemplateRef<any>;
  public configuration: Config;
  public columns: Columns[] = [];
  public data = [];
  public deleteable = true;
  public editable = false;
  public configurable = false;
  public editComponent: any = null  ;
  public displayConfig = '';
  public syncing = false;
  public snowData = false;

  constructor(
    protected apiObjectService: ApiObjectService,
    @Optional() protected modalService: NgbModal,
    @Optional() protected alertService: AlertService) {
  }

  configure(index): void {
    // placeholder
  }

  getData(): void {
    this.configuration.isLoading = true;
    this.apiObjectService.getAll()
      .subscribe(apiResponse => {
        // @ts-ignore
        this.data = apiResponse;
        this.configuration.isLoading = false;
        this.table.apiEvent({
          type: API.setTableClass,
          value: 'table table-bordered table-striped table-sm'
        });
      });
  }

  ngOnInit() {
    this.configuration = ConfigService.config;
    this.getData();
    if (this.editable || this.deleteable ) {
      this.columns.push({key: 'delete', title: 'Actions', cellTemplate: this.actionTpl});
    }
  }

  openEditComponent(object: any) {
    if (this.editComponent != null){
      const modalRef = this.modalService.open(this.editComponent);
      modalRef.result.then(result => this.getData()).catch(reason => null);
    }


  }

  onSearchChange(name: string): void {
    this.table.apiEvent({
      type: API.onGlobalSearch, value: name,
    });
  }

  remove(object: any): void {
    const confirmed = confirm('Are you sure you wish to delete this item?');
    const rowIndex = this.data.findIndex(test => object === test);
    if (confirmed) {
      const removed = this.data.splice(rowIndex, 1);
      this.apiObjectService.delete(removed[0].url, {}).subscribe(apiResponse => {
        this.data = [...this.data];
        this.table.apiEvent({
          type: API.setTableClass,
          value: 'table table-bordered table-striped table-sm'
        });
      });
    }
  }

}
