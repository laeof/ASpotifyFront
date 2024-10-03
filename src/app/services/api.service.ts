export class ApiService {
    private authApi: string = "";
    private playlistsApi: string = "";
    private mediaApi: string = "";
    constructor() {
        this.authApi = "http://hope1ess.local:5206/";
        this.playlistsApi = "http://hope1ess.local:5059/";
        this.mediaApi = "http://hope1ess.local:5283/";
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