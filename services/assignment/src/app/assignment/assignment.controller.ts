import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AssignmentService } from "./assignment.service";
import { CreateAssignmentDTO } from "./dto/create-assignment.dto";
import { AssignmentStatus } from "./assignment-status";
import { Assignment } from "./assignment.entity";

@Controller()
export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) {

    }

    @Post('/assignment')
    createAssignment(@Body() createAssignmentDTO: CreateAssignmentDTO) {
        return this.assignmentService.createAssignment(createAssignmentDTO)
    }

    @Get('/assignments')
    async getAssignments(@Query('status') status: AssignmentStatus): Promise<Assignment[]> {
        return this.assignmentService.getAssignments(status);
    }
}