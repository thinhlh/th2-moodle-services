import { Controller, Get, Inject, Param } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices"
import { Services } from "./services";
import { lastValueFrom } from "rxjs";

@Controller()
export class AppController {
    constructor(@Inject(Services.SCHEDULE) private readonly scheduleService: ClientProxy) {

    }
    @Get('/assignment/create/:value')
    async assignementCreated(@Param('value') value: boolean) {
        const result = await lastValueFrom(this.scheduleService.send('create.assignment', value));
        return result.data
    }
}