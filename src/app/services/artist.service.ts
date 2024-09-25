import { BehaviorSubject, Observable } from "rxjs";
import { IUser } from "../dtos/user";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IArtist } from "../dtos/artist";

@Injectable( {
    providedIn: 'root'
})

export class ArtistService {
    // getArtistById(id: string): string {
    // }

    private emptyArtist = new BehaviorSubject<IArtist>({
        id: "",
        userName: "",
        firstName: "",
        lastName: "",
        albums: []
    })

    constructor(private apiService: ApiService,
        private http: HttpClient
    ) {
        
    }

    getArtistById(id: string): Observable<IArtist> {
        if(id === undefined || id === '')
            return this.emptyArtist
        return this.http.get<IArtist>(this.apiService.getPlaylistApi() + 'Artist/' + id);
    }
}