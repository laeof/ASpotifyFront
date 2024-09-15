import { Observable } from "rxjs";
import { USERS } from "../data/data";
import { IUser } from "../dtos/user";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IArtist } from "../dtos/artist";

@Injectable( {
    providedIn: 'root'
})

export class ArtistService {
    Artists: IUser[] = USERS;
    // getArtistById(id: string): string {
    // }

    constructor(private apiService: ApiService,
        private http: HttpClient
    ) {
        
    }

    getArtistNameById(id: string) {
        const artist = this.Artists.find(item => item.Id === id);
        if (artist == undefined)
            return "";
        return artist.UserName;
    }

    getArtistById(id: string): Observable<IArtist> {
        return this.http.get<IArtist>(this.apiService.getPlaylistApi() + 'Artist/' + id);
    }
}