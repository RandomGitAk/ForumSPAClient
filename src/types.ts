import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options{
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}

export interface Post {
  id?: number;
  title: string;
  content: string;
  postedDate: string;
  countLikes: number;
  countComments: number;
  categoryName: string; 
  user?: User;
  userReaction: string;
  views: number;
}

export interface PostComment {
  id: number;
  content: string;
  postId: number;
  parentCommentId: number | null; 
}
export interface UserComment extends Comment{
}

export interface Comment {
  id: number;
  content: string;
  commentDate: string;
  user: User;
  replies: Comment[];
  countLikes: number;
  likedByUser: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  registrationDate: string;
  file: File | null;
  image: string;
}

export interface Role{
  id: number;
  name: string;
}

export interface Users extends PaginationProperties{
  items: User[];
}
  export interface Category {
    id?: number;
    name: string;
    description: string;
  }

  export interface Categories extends PaginationProperties{
    items: Category[];
  }

  export interface Posts extends PaginationProperties {
    items: Post[];
  }

  export interface TokenResponse{
    accesToken: string
    refreshToken: string
  }

  export interface RegisterResponse {
    message: string;
  }
  
  export interface PaginationParams {
    [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
    page: number;
    perPage: number;
    searchPropertyName: string;
    searchTerm: string;
  }
  
  export  interface MyJwtPayload {
    email?: string;
  }

interface PaginationProperties{
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}