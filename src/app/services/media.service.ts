import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ITrack } from "../dtos/track";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { firstValueFrom, map, Observable, ObservedValueOf } from "rxjs";

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
        return this.http.post<ITrack[]>(this.apiService.getMusicApi() + 'Upload', formData);
    }
}