import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionarioPortal } from './funcionario-portal';

const routes: Routes = [
  {
    path: '',
    component: FuncionarioPortal,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./funcionario-home').then((m) => m.FuncionarioHome),
      },
      {
        path: 'meus-epis',
        loadComponent: () =>
          import('./meus-epis/meus-epis').then((m) => m.MeusEpis),
      },
      {
        path: 'meus-treinamentos',
        loadComponent: () =>
          import('./meus-treinamentos/meus-treinamentos').then((m) => m.MeusTreinamentos),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FuncionarioModule {}
