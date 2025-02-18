import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.header("authorization");
        if (token === undefined) {
            return false;
        }
        return true;
        // return authService.validate(token);
    }
}
