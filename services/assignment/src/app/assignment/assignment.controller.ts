import { Body, Controller, Post } from "@nestjs/common";
import { AssignmentService } from "./assignment.service";
import { CreateAssignmentDTO } from "./dto/create-assignment.dto";

@Controller()
export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) {

    }

    @Post('/assignment')
    createAssignment(@Body() createAssignmentDTO: CreateAssignmentDTO) {
        return this.assignmentService.createAssignment(createAssignmentDTO)
    }
}