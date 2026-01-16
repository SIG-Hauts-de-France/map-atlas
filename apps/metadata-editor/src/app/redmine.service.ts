import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environements/environement'

@Injectable({
  providedIn: 'root',
})
export class RedmineService {
  private apiUrl = '/redmine-api/issues/7084.json'
  // private apiUrlByCardNumber = '/redmine-api/issues.json?status_id=7&cf_1=';
  // status_id=7 => statut validé
  // cf_17 => champ Alimentation Cartothèque (Oui-Interne, Oui-Externe)
  private apiUrlByCardNumber = `${environment.redmineUrl}/issues.json?status_id=7&f[]=cf_17&op[cf_17]==&v[cf_17][]=Oui-Interne&v[cf_17][]=Oui-Externe&cf_1=`
  private username = environment.redmineUsername
  private password = environment.redminePassword

  constructor(private http: HttpClient) {}

  getIssueData() {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
      'Content-Type': 'application/json',
    })

    return this.http.get(this.apiUrl, { headers })
  }

  getIssueByCardNumber(cardNumber: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
      'Content-Type': 'application/json',
    })
    // const apiUrl = `https://redmine.hautsdefrance.fr/issues.json?cf_1=${this.cardNumber}`;
    return this.http.get(`${this.apiUrlByCardNumber}${cardNumber}`, { headers })
  }
}
