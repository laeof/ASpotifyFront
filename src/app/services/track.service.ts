import { TRACKS } from "../data/data";
import { ITrack } from "../dtos/track";

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

    getTracks() {
        return this.tracks;
    }

    getTrackById(id: string): ITrack {
        return this.tracks.find(track => track.Id == id) || this.track;
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
}