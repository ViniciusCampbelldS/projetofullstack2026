import { HttpInterceptorFn } from '@angular/common/http';
import {catchError,throwError} from 'rxjs';
import { environment } from '../../environments/environment';
export const authInterceptor:HttpInterceptorFn=(req,next)=>{
 const token=sessionStorage.getItem('token');
 return next(token && req.url.startsWith(environment.apiUrl+'/')?req.clone({setHeaders:{Authorization:`Bearer ${token}`}}):req).pipe(catchError(error=>{if(error.status===401 && req.url.startsWith(environment.apiUrl+'/') && !req.url.endsWith('/auth/login')){sessionStorage.removeItem('token');sessionStorage.removeItem('userRole');if(!location.pathname.startsWith('/login'))location.assign('/login');}return throwError(()=>error);}));
};
