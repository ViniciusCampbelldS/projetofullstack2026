import { Routes } from '@angular/router';
import { EpiSeletor } from './components/epi/epi-seletor';
import { Login } from './components/geral/login/login';
import { Unauthorized } from './auth/unauthorized/unauthorized';
import { Homepage } from './components/geral/homepage/homepage';
import { authGuard, tstGuard } from './auth/auth.guard';

export const routes: Routes = [

  // login que e a unica pagina liberada sem autenticação
  {
    path: 'login',
    component: Login
  },

  // home do site
  {
    path: '',
    component: Homepage,
    canActivate: [authGuard]
  },

  // epi
  {
    path: 'epi',
    pathMatch: 'full',
    redirectTo: 'epi/busca'
  },
  {
    path: 'epi/busca',
    component: EpiSeletor,
    data: { view: 'busca' },
    canActivate: [tstGuard]
  },
  {
    path: 'epi/entrega',
    component: EpiSeletor,
    data: { view: 'entrega' },
    canActivate: [tstGuard]
  },
  {
    path: 'epi/historico',
    component: EpiSeletor,
    data: { view: 'historico' },
    canActivate: [tstGuard]
  },

  // treinamento
  {
    path: 'treinamento',
    loadComponent: () =>
      import('./components/treinamento/gerenciar-treinamento')
        .then((m) => m.GerenciarTreinamento),
    canActivate: [tstGuard]
  },

  // treinamento - editar
  {
    path: 'treinamento/editar',
    loadComponent: () =>
      import('./components/treinamento/gerenciar-treinamento')
        .then((m) => m.GerenciarTreinamento),
    data: { view: 'presenca' },
    canActivate: [tstGuard]
  },

  // treinamento - presenca
  {
    path: 'treinamento/presenca',
    loadComponent: () =>
      import('./components/treinamento/gerenciar-treinamento')
        .then((m) => m.GerenciarTreinamento),
    data: { view: 'abrir-turma' },
    canActivate: [tstGuard]
  },

  // treinamento - historico
  {
    path: 'treinamento/historico',
    loadComponent: () =>
      import('./components/treinamento/historico-treinamento/historico-treinamento')
        .then((m) => m.HistoricoTreinamento),
    canActivate: [tstGuard]
  },

  // funcionario
  {
    path: 'funcionario',
    loadChildren: () =>
      import('./components/funcionario/funcionario.module')
        .then((m) => m.FuncionarioModule),
    canActivate: [authGuard]
  },

  // gerenciar funcionarios
  {
    path: 'gerenciar-funcionarios',
    loadComponent: () =>
      import('./components/geral/gerenciar-funcionarios/gerenciar-funcionarios')
        .then((m) => m.GerenciarFuncionarios),
    canActivate: [tstGuard]
  },

  // acesso nao autorizado
  {
    path: 'unauthorized',
    component: Unauthorized,
    canActivate: [tstGuard]
  },

  // rota invalida
  {
    path: '**',
    redirectTo: ''
  }
];
