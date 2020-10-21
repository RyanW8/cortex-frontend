import {Routes, RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {RulerComponent} from "./ruler/ruler.component";
import {AlertManagerComponent} from "./alertmanager/alertmanager.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'cortex/ruler', component: RulerComponent},
    {path: 'cortex/alertmanager', component: AlertManagerComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}