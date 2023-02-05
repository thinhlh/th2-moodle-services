import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import * as path from "path"
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { AuthLocalGuard } from "src/config/guard/auth-local.guard";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, ClientsModuleOptions, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "./schedule/schedule.module";

@Module({
    controllers: [AppController],

    imports: [
        ConfigModule.forRoot({
            envFilePath:
                `../../env/${process.env.ENV}.env`,
            isGlobal: true,
        }),
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
        ScheduleModule
    ],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthLocalGuard,
    }],

})
export class AppModule {

}