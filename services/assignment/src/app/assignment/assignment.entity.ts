import { Type } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("timestamp")
    @Type(() => Number)
    dueDate: Date

    @Column()
    content: string
}