import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Faculty {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()

    name: string

}