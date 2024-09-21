import { HttpClient } from "@angular/common/http";
import { ILogin } from "../dtos/login";
import { IRegister } from "../dtos/register";
import { IUser } from "../dtos/user";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AccountService {
    constructor(private http: HttpClient,
        private apiService: ApiService
    ) {

    }
    
    Login(dto: ILogin) {
        this.http.post<IUser>(this.apiService.getAuthApi() + 'Auth/login', dto);
    }

    Register(dto: IRegister) {
        this.http.post<IUser>(this.apiService.getAuthApi() + 'Auth/register', dto);
    }
}