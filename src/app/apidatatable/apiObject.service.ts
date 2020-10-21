import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {AlertService} from '../alerts/alert.service';
import {environment} from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export abstract class ApiObjectService {
  protected url;
  protected distributorUrl = environment.distributor_url;


  getUrl() {
    return this.url;
  }

  constructor(protected alertService: AlertService, protected http: HttpClient) {
  }

  getAll() {
    return this.http.get(this.url).pipe(catchError(this.handleError('getAll', [])));
  }

  getOneFromUrl(url: string) {
    return this.http.get(url).pipe(
      catchError(this.handleError('getOneFromUrl', []))
    );
  }

  update(object: any) {
    return this.http.patch(object.url, object).pipe(
      catchError(this.handleError('update', []))
    );
  }

  put(object: any) {
    return this.http.put(object.url, object).pipe(
      catchError(this.handleError('update', []))
    );
  }

  create(object: any) {
    return this.http.post(this.url, object).pipe(
      catchError(this.handleError('create', []))
    );
  }

  delete(url: string, options: {}) {
    return this.http.delete(url, options).pipe(
      catchError(this.handleError('delete', []))
    );
  }

  post(url: string, object: any, options: {}){
      return this.http.post(url, object, options)
  }

  get(url: string, options: {}){
      return this.http.get(url, options)
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 404){
        return of (result as T);
      }
      if (error.status === 400) {
        this.alertService.error(JSON.stringify(error.error, null, 2));
      } else {
        this.alertService.error(`${operation} failed: ${error.message}`);
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  getTenants(){
    return this.http.get(this.distributorUrl + '/distributor/all_user_stats')
  }

  YAMLToJSON(yamlString: unknown){
      const yaml = require('js-yaml')
      try {
          return yaml.safeLoad(yamlString, 'utf8')
      } catch (e) {
          console.log(e)
      }
  }

  JSONToYAML(jsonObject: {}){
    const yaml = require('yaml');
    const doc = new yaml.Document()
    doc.contents = jsonObject;
    return doc.toString();
  }

  isJSONString(inputString: string): boolean{
    try {
      JSON.parse(inputString);
      return true;
    } catch (e) {
      this.alertService.error('Invalid JSON! Please validate and try again');
      return false;
    }
  }

}
