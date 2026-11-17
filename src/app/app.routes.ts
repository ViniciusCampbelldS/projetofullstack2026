import { Routes } from '@angular/router';
import { EpiSeletor } from './components/epi/epi-seletor';
import { Login } from './components/geral/login/login';
import { Unauthorized } from './auth/unauthorized/unauthorized';
import { Homepage } from './components/geral/homepage/homepage';
import { authGuard, tstGuard } from './auth/auth.guard';

export const routes: Routes = [
 {path:'redefinir-senha',loadComponent:()=>import('./components/geral/login/redefinir-senha').then(m=>m.RedefinirSenha)},

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

  { path: 'epi/cadastro', component: EpiSeletor, data: { view: 'cadastro' }, canActivate: [tstGuard] },

  // treinamento
  {
    path: 'treinamento',
    loadComponent: () =>
      import('./components/treinamento/gerenciar-treinamento')
        .then((m) => m.GerenciarTreinamento),
    canActivate: [tstGuard]
  },

  // Endereços antigos permanecem apenas para não quebrar favoritos.
  { path: 'treinamento/editar', pathMatch: 'full', redirectTo: 'treinamento' },
  { path: 'treinamento/presenca', pathMatch: 'full', redirectTo: 'treinamento' },

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
