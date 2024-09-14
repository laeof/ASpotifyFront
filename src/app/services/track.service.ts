import { HttpClient } from "@angular/common/http";
import { ITrack } from "../dtos/track";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TrackService {
    constructor(private http: HttpClient,
        private apiService: ApiService
    ) { }

    getTrackById(id: string): Observable<ITrack> {
        if(id === undefined)
            return throwError(() => new Error('Track ID is undefined'));
        return this.http.get<ITrack>(this.apiService.getPlaylistApi() + 'Track/' + id)
    }

    getDuration(duration: number): string {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const secs = duration % 60;

        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = secs.toString().padStart(2, '0');

        if (hours > 0) {
            const hoursStr = hours.toString().padStart(2, '0');
            return `${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutesStr}:${secondsStr}`;
        }
    }

    createNewTrack(dto: ITrack[]) {
        dto.forEach(track => {
            
            this.http.post<ITrack>(this.apiService.getPlaylistApi() + 'Track', track)
                .subscribe(
                    (response: any) => {
                        const track: ITrack = {
                            id: response.id,
                            artistId: response.artistId,
                            imagePath: response.imagePath,
                            name: response.name,
                            albumId: response.albumId,
                            urlPath: response.urlPath,
                            duration: response.duration,
                            createdDate: response.createdDate
                        }

                    },
                    (error: any) => {
                        console.log(error)
                    }
                );
        });

    }
}