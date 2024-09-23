import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ITrack } from '../../dtos/track';
import { IArtist } from '../../dtos/artist';
import { UserService } from '../../services/user.service';
import { PlaylistService } from '../../services/playlist.service';
import { MediaService } from '../../services/media.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPlaylist } from '../../dtos/playlist';
import { TrackService } from '../../services/track.service';
import { IImage } from '../../dtos/image';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatIcon,
        ReactiveFormsModule,
        CommonModule],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateComponent {
    artist: IArtist = {
        id: '',
        userName: '',
        firstName: '',
        lastName: '',
        albums: []
    };

    iimage: IImage = {
        filePath: '',
        color: ''
    }

    albumId: string = '';
    image: string = '';

    files: File[] = [];
    tracks: ITrack[] = [];

    drag: boolean = false;

    file: File | undefined = undefined;
    dragImg: boolean = false;

    playlistForm = new FormGroup({
        name: new FormControl('YourPlaylistName'),
        types: new FormControl<number>(0),
        file: new FormControl()
    });

    trackForm = new FormGroup({
        album: new FormControl(),
        files: new FormControl()
    });

    albums: IPlaylist[] = []

    constructor(
        private userService: UserService,
        private playlistService: PlaylistService,
        private mediaService: MediaService,
        private trackService: TrackService
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.artist.id = user.id;
            this.artist.firstName = user.firstName || ''
            this.artist.lastName = user.lastName || ''
            this.artist.userName = user.userName
            user.playlists.map(playlist => {
                if (playlist)
                    this.artist.albums.push(playlist)
            })
        });
        this.playlistService.getAllMyPlaylists().subscribe(
            (playlists: IPlaylist[]) => {
                this.albums = playlists.filter(playlist => playlist.types === 1);
            }
        )
    }

    chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    async processChunksWithLimit(chunks: File[][], limit: number) {
        const results: any[] = [];
        const promises: Promise<any>[] = [];

        const processChunk = async (chunk: File[]) => {
            try {
                let tracks = await this.mediaService.uploadFiles(chunk).toPromise();
                tracks?.map((track: any) => {
                    let newtrack: ITrack = {
                        id: track.id,
                        name: track.name,
                        urlPath: track.path,
                        duration: track.duration,
                        artistId: this.artist.id,
                        createdDate: 0,
                        albumId: this.albumId,
                        imagePath: this.image
                    }
                    newtrack.name = newtrack.name.charAt(0).toUpperCase() + newtrack.name.slice(1)
                    this.tracks.push(newtrack)
                });
                results.push(tracks);
            } catch (error) {
                console.error('Error loading file:', error);
            }
        };

        while (chunks.length > 0) {
            while (promises.length < limit && chunks.length > 0) {
                const chunk = chunks.shift()!;
                promises.push(processChunk(chunk));
            }

            await Promise.all(promises);

            promises.length = 0;
        }

        await Promise.all(promises);

        return results;
    }

    getfiles(event: any) {
        this.files = Array.from(event.target.files);

        const fileChunks = this.chunkArray(this.files, 2);

        const parallelLimit = 3;

        this.processChunksWithLimit.call(this, fileChunks, parallelLimit).then(() => {
            console.log('All chunks are completed!');
        });
    }

    dragFile() {
        this.drag = true;
    }

    noDragFile() {
        this.drag = false;
    }

    spliceFile(file: File | undefined, index: number) {
        //splice file from array
        this.files.splice(index, 1);
        this.tracks.splice(index, 1);
        //free memory
        file = undefined;
    }

    async getfile(event: any) {
        console.log('1')
        this.file = event.target.files[0];
        this.iimage = await this.mediaService.uploadImage(this.file!).toPromise() || this.iimage;
        console.log(this.iimage)
    }

    dragFileImage() {
        this.dragImg = true;
    }
    noDragFileImage() {
        this.dragImg = false;
    }
    imageClearFile() {
        this.file = undefined;
        this.image = '';
    }

    onSubmitPlaylist() {
        console.log(this.playlistForm.value.name ?? '')
        console.log(this.playlistForm.value.types ?? '')
        console.log(this.image ?? '')
        console.log(this.artist.id ?? '')

        let img = this.image as any

        const playlist: IPlaylist = {
            id: "00000000-0000-0000-0000-000000000000",
            authorId: this.artist.id ?? '',
            imagePath: img.filePath,
            name: this.playlistForm.value.name ?? '',
            types: this.playlistForm.value.types ?? 0,
            tracks: [],
            color: ''
        }

        this.playlistService.createNewPlaylist(playlist);
    }

    onSubmitTrack() {
        this.tracks.forEach((element: ITrack) => {
            element.albumId = this.trackForm.value.album.id
            element.imagePath = this.trackForm.value.album.imagePath         
        });

        
        this.trackService.createNewTrack(this.tracks);
    }
}