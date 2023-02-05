import { TypeOrmModule } from "@nestjs/typeorm";
import { Assignment } from "./assignment.entity";
import { AssignmentController } from "./assignment.controller";
import { AssignmentService } from "./assignment.service";
import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Services } from "../services";

@Module({
    controllers: [AssignmentController],
    providers: [AssignmentService],
    imports: [ClientsModule.registerAsync([
        {
            name: Services.SCHEDULE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            `amqp://${configService.get('RABBITMQ_DEFAULT_USER')}:${configService.get('RABBITMQ_DEFAULT_PASS')}@${configService.get('RABBITMQ_HOST')}:${configService.get(
                                'RABBITMQ_PORT')}`
                        ],
                        queue: 'schedule_queue',
                        queueOptions: {
                            durable: false
                        },
                    },
                }
            }
        }
    ]), TypeOrmModule.forFeature([Assignment])]
})
export class AssignmentModule {

}