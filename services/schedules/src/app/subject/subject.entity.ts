import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Faculty } from "../faculty/faculty.entity";

@Entity()
export class Subject {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    code: string;

    @Column()
    name: string;

    @ManyToOne(() => Faculty)
    faculty: Faculty;
}