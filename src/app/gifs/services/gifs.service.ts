import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchRespones } from '../interfaces/gifs.interfaces';


@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey: string = "I3PnZHlfa4vRumWsMy4XITaL1d4BZn1b";
  private serviceUrl: string = "https://api.giphy.com/v1/gifs"

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldtag => oldtag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;
   this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

   this.searchTag(this._tagsHistory[0])
  }

   searchTag(tag: string): void{
    if(tag.length == 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set("api_key", this.apiKey)
    .set("limit", '10')
    .set("q",tag)


    this.http.get<SearchRespones>(`${this.serviceUrl}/search`, {params})
    .subscribe(resp => {
      this.gifList = resp.data

    })

  }
}
