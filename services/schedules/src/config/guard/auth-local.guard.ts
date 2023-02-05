import { Role } from "src/app/role/role";
import { AppGuard, USER_KEY } from "./auth.guard";
import { lastValueFrom } from "rxjs";

export class AuthLocalGuard extends AppGuard {

    async auth(request: any, requiredRoles: Role[]): Promise<boolean> {
        const token = request.headers.authorization.trim();

        const result = await lastValueFrom(
            super.httpService.get(`${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/user_info`, {
                headers: {
                    "Authorization": token
                },
            })
        )

        if (result.status >= 200 && result.status < 300) {
            request.headers[USER_KEY] = result.data.data.id
            return true
        } else {
            const ignoreRole = requiredRoles.length == 0
            return ignoreRole;
        }
    }

}