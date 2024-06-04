import {
	Column,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonStudentsEntity } from './LessonStudents.entity';

@Index('student_pkey', ['id'], { unique: true })
@Entity('students')
export class StudentsEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('character varying', { name: 'name', length: 100 })
	name: string;

	@OneToMany(
		() => LessonStudentsEntity,
		(lessonStudents) => lessonStudents.studentsEntity,
	)
	lessonStudents: LessonStudentsEntity[];
}
