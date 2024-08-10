import { PLAYLISTS } from "../data/data";
import { IPlaylist } from "../dtos/playlist";
import { ITrack } from "../dtos/track";

export class PlaylistService {

    private tracks: ITrack[] = [];
    private trackSet: Set<ITrack> | undefined;
    private playlist: IPlaylist[] = PLAYLISTS;

    setRandomTrack(tracks: ITrack[]) {
        this.tracks = tracks;
        this.trackSet = new Set(tracks);
    }

    getRandomTrack(): ITrack | null {
        if (this.trackSet == undefined)
            return null

        if (this.trackSet.size === 0) {
            this.trackSet = new Set(this.tracks);
        }

        const randomIndex = Math.floor(Math.random() * this.trackSet.size);
        const trackArray = Array.from(this.trackSet);
        const randomTrack = trackArray[randomIndex];
        this.trackSet.delete(randomTrack); // set delete
        //console.log(this.trackSet)

        return randomTrack;
    }

    resetPlaylist(): void {
        this.trackSet = new Set(this.tracks); // Сбрасываем HashSet
    }

    getPlaylistById(id: string): IPlaylist {
        return this.playlist[Number(id) - 1];
    }

    getAllPlaylists(id: string): IPlaylist[] {
        return this.playlist.filter(playlist => playlist.UserId === id);
    }

    createNewPlaylist(playlist: IPlaylist) {
        this.playlist.push(playlist);
    }
}