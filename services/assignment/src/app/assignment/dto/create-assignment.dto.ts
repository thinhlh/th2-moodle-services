import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateAssignmentDTO {
    @IsString()
    content: string;

    @IsNumber()
    dueDate: number;

    @IsString({ each: true })
    receivers: string[];
}