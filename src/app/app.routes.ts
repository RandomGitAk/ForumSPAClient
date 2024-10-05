import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { PostDetailComponent } from './pages/post-detail/post-detail/post-detail.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { canActivateAuth } from './services/auth/acces.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { PostsComponent } from './shared/admin-components/posts/posts.component';
import { CategoriesComponent } from './shared/admin-components/categories/categories.component';
import { UsersComponent } from './shared/admin-components/users/users.component';
import { RoleGuard } from './services/auth/role.guard';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home/:categoryId', component: HomeComponent },
    {path: 'post/:id', component: PostDetailComponent },
    {path: 'login', component: LoginPageComponent },
    {path: 'register', component: RegisterPageComponent },
    {path: 'profile', component:  ProfilePageComponent},
    {path: 'createPost', component: CreatePostPageComponent, canActivate: [canActivateAuth]},
    {
        path: 'admin',
        component: AdminPageComponent,
        children: [
          { path: 'users', component: UsersComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
          { path: 'categories', component: CategoriesComponent, canActivate: [RoleGuard], data: { roles: ['Admin', 'Moderator'] }  },
          { path: 'posts', component: PostsComponent, canActivate: [RoleGuard], data: { roles: ['Admin', 'Moderator'] }  },
          { path: '', redirectTo: 'defaultRedirect', pathMatch: 'full' }
        ], canActivate: [canActivateAuth]
      }
];

