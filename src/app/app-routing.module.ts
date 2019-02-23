import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabataComponent } from './tabata/tabata.component';

const routes: Routes = [
  {path: '', component: TabataComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
