import {
	getKey,
	LessonsEntity,
	LessonStudentsEntity,
	StudentsEntity,
	TeachersEntity,
} from '@common';
import { LessonsView } from 'libs/common/src/dbContext/views/lessons.view';

// Mapping из view в объекты entity-классов
export function lessonsViewToLessonsEntity(
	lessonsViews: LessonsView[],
): LessonsEntity[] {
	const lessonsMap = new Map<number, LessonsEntity>();
	const lessonsTeachersMap = new Map<string, TeachersEntity>();
	const lessonsStudentsMap = new Map<string, LessonStudentsEntity>();

	for (const view of lessonsViews) {
		let lesson = lessonsMap.get(view.lessonId);
		if (!lesson) {
			lesson = new LessonsEntity({
				id: view.lessonId,
				title: view.lessonTitle,
				date: view.lessonDate,
				status: view.lessonStatus,
				lessonStudents: [],
				teachers: [],
			});
			lessonsMap.set(lesson.id, lesson);
		}
		if (view.teacherId) {
			const key = getKey(lesson.id, view.teacherId);
			let lessonTeacher = lessonsTeachersMap.get(key);
			if (!lessonTeacher) {
				lessonTeacher = new TeachersEntity({
					id: view.teacherId,
					name: view.teacherName,
					lessons: null,
				});
				lesson.teachers.push(lessonTeacher);
				lessonsTeachersMap.set(key, lessonTeacher);
			}
		}
		if (view.studentId) {
			const key = getKey(lesson.id, view.studentId);
			let lessonStudent = lessonsStudentsMap.get(key);
			if (!lessonStudent) {
				lessonStudent = new LessonStudentsEntity({
					studentId: view.studentId,
					visit: view.studentVisit,
					studentsEntity: new StudentsEntity({
						id: view.studentId,
						name: view.studentName,
						lessonStudents: null,
					}),
					lessonId: view.lessonId,
					lessonsEntity: null,
				});
				lesson.lessonStudents.push(lessonStudent);
				lessonsStudentsMap.set(key, lessonStudent);
			}
		}
	}

	return [...lessonsMap.values()];
}
