import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { LessonsEntity } from './Lessons.entity';
import { StudentsEntity } from './Students.entity';

@Index('student_id_lesson_id_pkey', ['lessonId', 'studentId'], { unique: true })
@Entity('lesson_students')
export class LessonStudentsEntity {
	@PrimaryColumn({ type: 'int', name: 'lesson_id' })
	lessonId: number;

	@PrimaryColumn({ type: 'int', name: 'student_id' })
	studentId: number;

	@Column('boolean', { name: 'visit', default: () => 'false' })
	visit: boolean;

	@ManyToOne(() => LessonsEntity, (lessons) => lessons.lessonStudents, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'lesson_id', referencedColumnName: 'id' }])
	lessonsEntity: LessonsEntity;

	@ManyToOne(() => StudentsEntity, (students) => students.lessonStudents, {
		onDelete: 'CASCADE',
	})
	@JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
	studentsEntity: StudentsEntity;
}
