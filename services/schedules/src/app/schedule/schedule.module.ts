import { Module } from "@nestjs/common";
import { ScheduleController } from "./schedule.controller";
import { SES } from "@aws-sdk/client-ses";

@Module({
    imports: [
        // SesModule.forRoot({
        //     SECRET: process.env.AWS_SECRET,
        //     AKI_KEY: process.env.AWS_ACCESS,
        //     REGION: 'ap-southeast-1',
        // }),
    ],
    controllers: [ScheduleController]
})
export class ScheduleModule {

}