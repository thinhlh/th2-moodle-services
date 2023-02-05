import { Controller, Get, Inject } from "@nestjs/common";
import { Roles } from "src/config/guard/role.decorator";
import { Role } from "./role/role";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Controller()
export class AppController {
    @Get("/")
    ping() {
        return "Hello"
    }

    @Get("/ping/student")
    @Roles(Role.STUDENT)
    pingStudent() {
        return "Hello Student!"
    }
}