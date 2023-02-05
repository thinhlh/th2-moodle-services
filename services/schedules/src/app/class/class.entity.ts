import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../subject/subject.entity";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

@Entity()
export class Class {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    code: string

    @ManyToOne(() => Subject)
    subject: Subject;
}