import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  

  const userJson = localStorage.getItem('user');
  
  if (userJson) {
    const user = JSON.parse(userJson);
    

    if (user && user.authdata) {

      const authReq = req.clone({
        setHeaders: { 
          Authorization: `Basic ${user.authdata}`
        }
      });
      

      return next(authReq);
    }
  }


  return next(req);
};