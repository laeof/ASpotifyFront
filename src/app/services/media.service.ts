import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ITrack } from "../dtos/track";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { firstValueFrom, map, Observable, ObservedValueOf } from "rxjs";
import { IImage } from "../dtos/image";

@Injectable({
    providedIn: 'root'
})

export class MediaService {

    constructor(private http: HttpClient,
        private apiService: ApiService
    ) {

    }
    uploadFiles(files: File[]): Observable<ITrack[]> {
        const formData = new FormData();

        // Добавляем каждый файл в FormData
        files.forEach(file => {
            formData.append('files', file, file.name);
        });

        // Отправляем запрос POST с файлом
        return this.http.post<ITrack[]>(this.apiService.getMusicApi() + 'Audio/Upload', formData);
    }

    uploadImage(file: File): Observable<IImage> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        // Отправляем запрос POST с файлом
        return this.http.post<IImage>(this.apiService.getMusicApi() + 'Image/Upload', formData);
    }
}