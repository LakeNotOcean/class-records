import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
	name: 'lessons_view',
	expression: `select l.id as lessonId, l."date" as lessonDate, l.status as lessonStatus, l.title as lessonTitle, 
    ls.visit as studentVisit, s.id as studentId, s."name" as studentName,
    t.id as teacherId, t."name" as teacherName,
    ls2.studentCount::int as studentCount
    from lessons l 
    left join lesson_students ls on l.id =ls.lesson_id
    left join (
        select  lesson_id, count(student_id) over (partition by lesson_id) as studentCount
        from lesson_students ls2 
    ) ls2 on ls2.lesson_id = l.id  
    left join students s on s.id = ls.student_id 
    left join lesson_teachers lt ON l.id = lt.lesson_id 
    left join teachers t on t.id = lt.teacher_id`,
})
export class LessonsView {
	@ViewColumn()
	lessonsId: number;
	@ViewColumn()
	lessonDate: Date;
	@ViewColumn()
	lessonStatus: string;
	@ViewColumn()
	lessonsTitle: string;
	@ViewColumn()
	studentVisit: string;
	@ViewColumn()
	studentId: number;
	@ViewColumn()
	studentName: string;
	@ViewColumn()
	teacherId: number;
	@ViewColumn()
	teacherName: string;
	@ViewColumn()
	studentCount: number;
}
