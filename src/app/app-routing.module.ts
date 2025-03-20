import { HomeComponent } from './components/home/home/home.component';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { Credential } from 'src/app/models/auth/Credential';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './components/home/login/login.component';
import { AdminComponent } from './components/home/admin/admin.component';
import { AuthorComponent } from './components/home/author/author.component';
import { ROLE, ROLE_MAPPER } from './auth/auth role';
import { AuthGuard } from './auth/auth.guard';
import { DialogEditWrapperComponent } from './components/fanfic-editor/dialog-edit-wrapper/dialog-edit-wrapper.component';
import { CardComponent } from './components/card/card.component';
import { ReadComponentComponent } from './components/read.component/read.component.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserpageSettingsComponent } from './components/userpage.settings/userpage.settings.component';
import { UserpageComponent } from './components/userpage/userpage.component';
import { MenuComponent } from './components/menu/menu.component';
import { BlogPageComponent } from './components/blog.page/blog.page.component';

const routes: Routes = [
    {
    path: 'login', component: LoginComponent,
    },

    {
    path: 'fanfic/:id',
    component: ReadComponentComponent,
    },

    {
      path: 'registration', component: RegistrationComponent
    },

    {
      path: 'main', component:HomeComponent
    },

    {
      path: 'usepagesettings', component:UserpageSettingsComponent
    },

    {
      path: 'userpage/:id', component:UserpageComponent
    },

    {
      path: 'menu', component:MenuComponent
    },

    {
      path: 'blogs', component: BlogPageComponent
    },

    {
      path: 'home', component: HomeComponent
    },

    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full',
    },
    {
      path: '**',
      redirectTo: '/login',
    },
    {
    path: 'cardComponent', component: CardComponent,
    },

    {
    path: 'admin', component: CardComponent, canActivate: [AuthGuard]
    },

    {
    path: 'author', component: CardComponent, canActivate: [AuthGuard]
    },
  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



