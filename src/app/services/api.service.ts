export class ApiService {
    private authApi: string = "";
    private playlistsApi: string = "";
    private mediaApi: string = "";
    constructor() {
        this.authApi = "";
        this.playlistsApi = "";
        this.mediaApi = "http://localhost:5283/Audio/";
    }

    getAuthApi() {
        return this.authApi;
    }

    getPlaylistApi() {
        return this.playlistsApi;
    }

    getMusicApi() {
        return this.mediaApi;
    }
}