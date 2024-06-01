import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonsEntity } from './Lessons.entity';
import { StudentsEntity } from './Students.entity';

@Index('id_student_id_lesson_pkey', ['idLesson', 'idStudent'], { unique: true })
@Entity('lesson_students', { schema: 'class' })
export class LessonStudentsEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id_lesson' })
	idLesson: number;

	@PrimaryGeneratedColumn({ type: 'int', name: 'id_student' })
	idStudent: number;

	@Column('boolean', { name: 'visit', default: () => 'false' })
	visit: boolean;

	@ManyToOne(() => LessonsEntity, (lessons) => lessons.lessonStudents, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'id_lesson', referencedColumnName: 'id' }])
	idLesson2: LessonsEntity;

	@ManyToOne(() => StudentsEntity, (students) => students.lessonStudents, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'id_student', referencedColumnName: 'id' }])
	idStudent2: StudentsEntity;
}
