import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "./assignment.entity";
import { FindOperator, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { CreateAssignmentDTO } from "./dto/create-assignment.dto";
import { I18n, I18nService } from "nestjs-i18n";
import { Client, ClientProxy } from "@nestjs/microservices";
import { Services } from "../services";
import { AssignmentStatus } from "./assignment-status";

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Assignment) private readonly assignmentRepository: Repository<Assignment>,
        @I18n() private readonly i18nService: I18nService,
        @Inject(Services.SCHEDULE) private readonly scheduleService: ClientProxy
    ) {

    }

    async createAssignment(createAssignmentDTO: CreateAssignmentDTO): Promise<Assignment> {
        if (createAssignmentDTO.dueDate <= Date.now()) {
            throw new BadRequestException(this.i18nService.translate('validation.invalid.due-date-invalid'))
        }

        const assignment = this.assignmentRepository.create({ ...createAssignmentDTO, dueDate: new Date(createAssignmentDTO.dueDate) });


        const result = await this.assignmentRepository.save(assignment)

        this.scheduleService.emit('assignment.created', { ...assignment, receivers: createAssignmentDTO.receivers });
        return result;
    }

    async getAssignments(status: AssignmentStatus): Promise<Assignment[]> {
        switch (status) {
            case AssignmentStatus.PENDING:
                return this.assignmentRepository.find({
                    where: {
                        dueDate: MoreThanOrEqual(new Date())
                    }
                })
            case AssignmentStatus.SUBMITTED:
                return this.assignmentRepository.find({

                })
            case AssignmentStatus.OVERDUE:
                return this.assignmentRepository.find({
                    where: {
                        dueDate: LessThanOrEqual(new Date())
                    }
                })
        }
    }
}