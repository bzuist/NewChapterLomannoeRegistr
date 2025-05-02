import { NgModule, OnInit, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { FanficEditorComponent } from './components/fanfic-editor/fanfic-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogEditWrapperComponent } from './components/fanfic-editor/dialog-edit-wrapper/dialog-edit-wrapper.component';
import { HttpClientModule }   from '@angular/common/http';
import { DialogChangeWrapperComponent } from './components/fanfic-editor/dialog-change-wrapper/dialog-change-wrapper.component';
import { DialogDeleteWrapperComponent } from './components/fanfic-editor/dialog-delete-wrapper/dialog-delete-wrapper.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BaseServiceService } from './service/base-service.service';
import { SessionStorageService } from 'angular-web-storage';
import { ROLE } from './auth/auth role';
import { LoginComponent } from './components/home/login/login.component';
import { AuthService } from './auth/auth.service';
import { Authority } from './models/auth/auth';
import { Credential } from './models/auth/Credential';
import { CredentialResponse } from './models/auth/CredentialResponse';
import { HomeComponent } from './components/home/home/home.component';
import { AdminComponent } from './components/home/admin/admin.component';
import { AuthorComponent } from './components/home/author/author.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReadComponentComponent } from './components/read.component/read.component.component';
import { UserpageComponent } from './components/userpage/userpage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HttpClient } from '@angular/common/http';
import { BlogPageComponent } from './components/blog.page/blog.page.component';
import { UserpageSettingsComponent } from './components/dialog-edit-profile-wrapper.component/userpage.settings.component';
import { MenuComponent } from './components/menu/menu.component';
import { SearchComponent } from './components/search/search.component';
import { DialogChangePostWrapperComponent } from './components/post-editor/dialog-change-post-wrapper/dialog-change-post-wrapper.component';
import { DialogAddPostWrapperComponent } from './components/post-editor/dialog-add-post-wrapper/dialog-add-post-wrapper/dialog-add-post-wrapper.component';
import { DialogDeletePostWrapperComponent } from './components/post-editor/dialog-delete-post-wrapper/dialog-delete-post-wrapper/dialog-delete-post-wrapper.component';
import { WorksComponent } from './components/works/works.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    FanficEditorComponent,
    DialogEditWrapperComponent,
    DialogChangeWrapperComponent,
    DialogDeleteWrapperComponent,
    CardComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    AuthorComponent,
    ReadComponentComponent,
    UserpageComponent,
    RegistrationComponent,
    BlogPageComponent,
    UserpageSettingsComponent,
    MenuComponent,
    SearchComponent,
    DialogChangePostWrapperComponent,
    DialogAddPostWrapperComponent,
    DialogDeletePostWrapperComponent,
    WorksComponent,
    BlogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularEditorModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, {dataEncapsulation: false}
    // ),
    MatCardModule, MatButtonModule,

  ],
  providers: [
    BaseServiceService,
    SessionStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogEditWrapperComponent,
    DialogChangeWrapperComponent,
    DialogDeleteWrapperComponent,
  ],
})
export class AppModule { }
