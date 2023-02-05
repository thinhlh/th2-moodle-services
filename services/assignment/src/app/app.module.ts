import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import * as path from "path"
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { AuthLocalGuard } from "src/config/guard/auth-local.guard";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Services } from "./services";
import { AssignmentModule } from "./assignment/assignment.module";

@Module({
    controllers: [AppController],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthLocalGuard,
    }],
    imports: [
        ConfigModule.forRoot({
            envFilePath:
                `../../env/${process.env.ENV}.env`,
            isGlobal: true,
        }),
        ClientsModule.registerAsync([
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
        ]),
        HttpModule.register({}),
        I18nModule.forRoot({
            fallbackLanguage: "en",
            loaderOptions: {
                path: path.join(__dirname, "../i18n/"),
                watch: true,
            },
            resolvers: [AcceptLanguageResolver, QueryResolver],
            logging: true,
        }),
        TypeOrmModule.forRoot({
            host: process.env.POSTGRES_HOST,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            port: +process.env.POSTGRES_PORT,
            type: 'mysql',
            logger: "advanced-console",
            // logging: process.env.ENV === 'dev' ? true : false,
            autoLoadEntities: true,
            synchronize: true,
        }),
        AssignmentModule
    ],

})
export class AppModule {

}