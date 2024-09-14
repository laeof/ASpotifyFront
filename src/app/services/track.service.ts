import { HttpClient } from "@angular/common/http";
import { TRACKS } from "../data/data";
import { ITrack } from "../dtos/track";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TrackService {
    private tracks: ITrack[] = TRACKS;
    private track: ITrack = {
        Id: "",
        Name: "",
        ArtistId: "",
        Date: new Date,
        AlbumId: "",
        Duration: 0,
        Image: "",
        Path: ""
    }

    constructor(private http: HttpClient,
        private apiService: ApiService
    ) {


    }

    getTracks() {
        return this.tracks;
    }

    getTrackByIdDev(id: string): Observable<ITrack> {
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

            const data = {
                'Id': track.Id,
                'ArtistId': track.ArtistId,
                'Name': track.Name,
                'AlbumId': track.AlbumId,
                'ImagePath': track.Image,
                'UrlPath': track.Path,
                'Duration': track.Duration,
            }

            this.http.post<ITrack>(this.apiService.getPlaylistApi() + 'Track', data)
                .subscribe(
                    (response: any) => {
                        const track: ITrack = {
                            Id: response.id,
                            ArtistId: response.artistId,
                            Image: response.imagePath,
                            Name: response.name,
                            AlbumId: response.albumId,
                            Path: response.urlPath,
                            Duration: response.duration,
                            Date: response.createdDate
                        }

                    },
                    (error: any) => {
                        console.log(error)
                    }
                );
        });

    }
}