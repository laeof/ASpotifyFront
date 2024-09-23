import { HttpClient } from "@angular/common/http";
import { ILogin } from "../dtos/login";
import { IRegister } from "../dtos/register";
import { IUser } from "../dtos/user";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ITokens } from "../dtos/tokens";
import { SpotifyCookieService } from "./spotifycookie.service";

@Injectable({
    providedIn: 'root'
})

export class AccountService {
    accessToken: string = '';
    refreshToken: string = '';

    constructor(private http: HttpClient,
        private apiService: ApiService,
        private cookieService: SpotifyCookieService
    ) {

    }
    
    ValidEmail(dto: string) {
        return this.http.get<boolean>(this.apiService.getAuthApi() + 'Auth/email/' + dto);
    }

    ValidUsername(dto: string): Observable<boolean> {
        return this.http.get<boolean>(this.apiService.getAuthApi() + 'Auth/username/' + dto);
    }

    Login(dto: ILogin): Observable<ITokens> {
        return this.http.post<ITokens>(this.apiService.getAuthApi() + 'Auth/login', dto);
    }

    Register(dto: IRegister): Observable<IUser> {
        return this.http.post<IUser>(this.apiService.getAuthApi() + 'Auth/register', dto);
    }

    RegenerateAccessToken(tokens: ITokens): Observable<ITokens> {
        return this.http.post<ITokens>(this.apiService.getAuthApi() + 'Auth/refresh-token', tokens);
    }

    Logout(): void {
        this.cookieService.deleteTokens();
    }

}