import { environment } from '../../../environments/environment';

export class EndPoints {
    /**
     * @description: Url base
     */
    static uriBase(url: string): string {
        return environment.baseUrl + url;
    }

}
