import {APP_INITIALIZER, NgModule} from '@angular/core';
import {TableModule} from 'ngx-easy-table';
import {RulerComponent} from "./ruler/ruler.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing-module";
import {HttpClientModule} from '@angular/common/http';
import {AlertService} from "./alerts/alert.service";
import {AppComponent} from "./app.component";
import {NavComponent} from "./nav/nav.component";
import {AlertComponent} from "./alerts/alert.component";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from "@ng-select/ng-select";
import {AlertManagerComponent} from "./alertmanager/alertmanager.component";
import {AddRuleComponent} from "./ruler/addRule/addRule.component";
import {HomeComponent} from "./home/home.component";
import {EditConfigComponent} from "./alertmanager/editConfig/editConfig.component";

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        RulerComponent,
        NavComponent,
        AlertManagerComponent,
        AddRuleComponent,
        HomeComponent,
        EditConfigComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgbModule,
        HttpClientModule,
        NgSelectModule,
        TableModule,
        ReactiveFormsModule
    ],
    providers: [
        AlertService,
        NgbActiveModal
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AddRuleComponent,
        EditConfigComponent
    ]
})
export class AppModule{}