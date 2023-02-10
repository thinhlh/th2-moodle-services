import { CloneReceiptRuleSetCommand, SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ScheduleController {

    constructor(private readonly configService: ConfigService) {

    }
    @MessagePattern('assignment.created')
    async assignementCreated(@Payload() assignment: any) {
        console.log(assignment.receivers)

        const client = new SESClient({
            region: 'ap-southeast-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS,
                secretAccessKey: process.env.AWS_SECRET
            }
        });

        const sendEmailCommand = new SendEmailCommand({
            Message: {
                Subject: {
                    Data: `[IMPORTANT] Submit deadline before ${new Date(assignment.dueDate).toDateString()}`,
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        "Data": `
                        <h1>Deadline submit requirement</h1>
                        </hr>
                        <p>Good morning my students, I have just created a deadline on ${new Date(assignment.dueDate).toDateString()}</p>
                        <p>Below are the detail:</p>
                        <p>${assignment.content}</p>

                        <h4 style="color:red" >Notice: No delay allowance!</h4>

                        <br>
                        <p><b>Regards,</b></p>

                        <br>
                        <h6>Le Hoang Thinh</h6>
                        <h6>Student at UIT, Software Engineer Faculty</h6>
                        <h6>Email: work.jamiele@gmail.com</h6>
                        </hr>
                        `
                    }
                }
            },
            Destination: {
                ToAddresses: assignment.receivers,
            },
            Source: "thinhlh0812@gmail.com"
        });

        console.log('Sending email')
        const result = await client.send(sendEmailCommand);
        console.log('Send Finished')

        return assignment
    }


}