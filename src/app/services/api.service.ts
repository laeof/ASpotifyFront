export class ApiService {
    private authApi: string = "";
    private playlistsApi: string = "";
    private mediaApi: string = "";
    constructor() {
        this.authApi = "http://localhost:5206/";
        this.playlistsApi = "http://localhost:5059/";
        this.mediaApi = "http://localhost:5283/";
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