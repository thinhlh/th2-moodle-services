import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, firstValueFrom, lastValueFrom } from "rxjs";
// import { Role } from "src/app/role/role";
import { ROLES_KEY } from "./role.decorator";
import { Request } from "express";
import { HttpService } from "@nestjs/axios";
import { Role } from "src/app/role/role";

export const USER_KEY = 'user'

@Injectable()
export abstract class AppGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        protected readonly httpService: HttpService,
    ) {

    }

    abstract auth(request: any, requiredRoles: Role[]): Promise<boolean>;

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];

        const request = context.switchToHttp().getRequest() as Request;
        const ignoreRole = requiredRoles.length == 0

        try {
            if (request.headers.authorization) {
                return await this.auth(request, requiredRoles);
            } else {
                return ignoreRole
            }

        } catch (e) {
            return ignoreRole;
        }
    }

    private extractToken(token: string, prefix: string = 'Bearer'): string {
        if (!token || token.length == 0) {
            return null
        } else {
            token = token.replace(prefix, '').trim()

            if (!token || token.length == 0) return null
            return token
        }
    }
}