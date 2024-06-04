import {
	Column,
	Entity,
	Index,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonsEntity } from './Lessons.entity';

@Index('teachers_id_idx', ['id'], {})
@Index('teacher_pkey', ['id'], { unique: true })
@Entity('teachers')
export class TeachersEntity {
	constructor(args: Required<TeachersEntity>) {
		Object.assign(this, args);
	}
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('character varying', { name: 'name', length: 100 })
	name: string;

	@ManyToMany(() => LessonsEntity, (lessons) => lessons.teachers, {
		onDelete: 'CASCADE',
	})
	lessons: LessonsEntity[];
}
