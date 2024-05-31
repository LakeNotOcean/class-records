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
@Entity('lessons', { schema: 'class' })
export class LessonsEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('timestamp without time zone', {
		name: 'date',
		default: () => 'now()',
	})
	date: Date;

	@Column('boolean', { name: 'status', default: () => 'false' })
	status: boolean;

	@OneToMany(
		() => LessonStudentsEntity,
		(lessonStudents) => lessonStudents.idLesson2,
	)
	lessonStudents: LessonStudentsEntity[];

	@ManyToMany(() => TeachersEntity, (teachers) => teachers.lessons)
	@JoinTable({
		name: 'lesson_teachers',
		joinColumns: [{ name: 'id_lesson', referencedColumnName: 'id' }],
		inverseJoinColumns: [{ name: 'id_teacher', referencedColumnName: 'id' }],
		schema: 'class',
	})
	teachers: TeachersEntity[];
}
