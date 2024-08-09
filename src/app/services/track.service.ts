import { TRACKS } from "../data/data";
import { ITrack } from "../dtos/track";

export class TrackService {
    private tracks: ITrack[] = TRACKS;

    getTracks() {
        return this.tracks;
    }
}