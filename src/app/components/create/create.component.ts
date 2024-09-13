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
        Id: '',
        UserName: '',
        FirstName: '',
        LastName: '',
        albums: []
    };

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

    constructor(
        private userService: UserService,
        private playlistService: PlaylistService,
        private mediaService: MediaService,
    ) {
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.artist.Id = user.Id;
            this.artist.FirstName = user.FirstName || ''
            this.artist.LastName = user.LastName || ''
            this.artist.UserName = user.UserName
            user.Playlists.map(playlist => {
                let tmp = this.playlistService.getPlaylistById(playlist);
                console.log('create get playlist')
                if ((tmp).Type === 1 && (tmp).AuthorId == user.Id)
                    this.artist.albums.push((tmp).Id);
            })
        });
    }

    getPlaylistById(id: string) {
        return (this.playlistService.getPlaylistById(id)).Name;
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
                        Id: track.id,
                        Name: track.name,
                        Path: track.path,
                        Duration: track.duration,
                        ArtistId: this.artist.Id,
                        Date: new Date(),
                        AlbumId: this.albumId,
                        Image: this.image
                    }
                    newtrack.Name = newtrack.Name.charAt(0).toUpperCase() + newtrack.Name.slice(1)
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
        this.image = await this.mediaService.uploadImage(this.file!).toPromise() || '';
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
        console.log(this.artist.Id ?? '')
        
        let img = this.image as any

        const playlist: IPlaylist = {
            Id: "00000000-0000-0000-0000-000000000000",
            AuthorId: this.artist.Id ?? '',
            Image: img.filePath,
            Name: this.playlistForm.value.name ?? '',
            Type: this.playlistForm.value.types ?? 0,
            TrackIds: []
        }

        this.playlistService.createNewPlaylist(playlist);
    }
}