import {
	Column,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonStudentsEntity } from './LessonStudents.entity';
import { TeachersEntity } from './Teachers.entity';

@Index('lessons_id_idx', ['id'], {})
@Index('lesson_pkey', ['id'], { unique: true })
@Entity('lessons')
export class LessonsEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;
	constructor(args: Required<LessonsEntity>) {
		Object.assign(this, args);
	}

	@Column('timestamp without time zone', {
		name: 'date',
		default: () => 'now()',
	})
	date: Date;

	@Column('boolean', { name: 'status', default: () => 'false' })
	status: boolean;

	@Column('character varying', { name: 'title', length: 100, nullable: false })
	title: string;

	@OneToMany(
		() => LessonStudentsEntity,
		(lessonStudents) => lessonStudents.studentsEntity,
		{ onDelete: 'CASCADE' },
	)
	lessonStudents: LessonStudentsEntity[];

	@ManyToMany(() => TeachersEntity, (teachers) => teachers.lessons, {
		onDelete: 'CASCADE',
	})
	@JoinTable({
		name: 'lesson_teachers',
		joinColumns: [{ name: 'lesson_id', referencedColumnName: 'id' }],
		inverseJoinColumns: [{ name: 'teacher_id', referencedColumnName: 'id' }],
		schema: 'class',
	})
	teachers: TeachersEntity[];
}
