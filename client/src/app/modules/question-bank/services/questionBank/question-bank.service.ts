import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  _apis = {
    addQuestion: '/api/questions/add'
  };

  constructor(
    private http: HttpClient
  ) { }

  addQuestion(quesObj) {
    let that = this;
    return that.http.post(that._apis['addQuestion'], quesObj, {observe: 'response'})
      .pipe(
        map((res) => {
          console.log(res);
          if(res.status === 200) {
            alert("Added  Successfully!");
          }
          return res.body;
        }),
        catchError(that.handleError)
      );
  }

  /**
   * Error Handling for API's
   *
   * @private
   * @param {HttpErrorResponse} error
   * @returns
   * @memberof QuestionBankService
   */
  private handleError(error: HttpErrorResponse) {
    // return an observable with the error to change the view accordingly.
    return of(error);
  }
}
