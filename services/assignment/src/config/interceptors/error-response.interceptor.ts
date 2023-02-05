import { BadGatewayException, BadRequestException, CallHandler, ExecutionContext, HttpCode, HttpException, HttpStatus, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { classToPlain, plainToInstance, serialize } from "class-transformer";
import { isObject, ValidationError } from "class-validator";
import { catchError, map, Observable, throwError } from "rxjs";
import { BaseResponse } from "../dto/base.response";

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                catchError(
                    err => throwError(
                        () => {

                            if (err instanceof BadRequestException) {

                                const errorResponse = err.getResponse();
                                const message = isObject(errorResponse) ? (err.getResponse() as any).message.join('\n') : errorResponse

                                throw new HttpException(({
                                    success: false,
                                    message: message,
                                    data: null,
                                }),
                                    +err.getStatus() ? err.getStatus() : HttpStatus.BAD_REQUEST,
                                );
                            } else {
                                throw new HttpException(({
                                    success: false,
                                    message: err,
                                    data: null,
                                }),
                                    +err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
                                );
                            }
                        }
                    )
                ),
            );
    }
}
