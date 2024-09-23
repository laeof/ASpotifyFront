import { Observable } from "rxjs";
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

    constructor(private apiService: ApiService,
        private http: HttpClient
    ) {
        
    }

    getArtistNameById(id: string) {
        return ""
    }

    getArtistById(id: string): Observable<IArtist> {
        return this.http.get<IArtist>(this.apiService.getPlaylistApi() + 'Artist/' + id);
    }
}