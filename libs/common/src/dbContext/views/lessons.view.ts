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
        select ls2_1.lesson_id,
            count(ls2_1.student_id) as studentCount
           from lesson_students ls2_1
           group by ls2_1.lesson_id
    ) ls2 on ls2.lesson_id = l.id  
    left join students s on s.id = ls.student_id 
    left join lesson_teachers lt ON l.id = lt.lesson_id 
    left join teachers t on t.id = lt.teacher_id`,
})
export class LessonsView {
	@ViewColumn({ name: 'lessonid' })
	lessonId: number;
	@ViewColumn({ name: 'lessondate' })
	lessonDate: Date;
	@ViewColumn({ name: 'lessonstatus' })
	lessonStatus: boolean;
	@ViewColumn({ name: 'lessontitle' })
	lessonTitle: string;
	@ViewColumn({ name: 'studentvisit' })
	studentVisit: boolean;
	@ViewColumn({ name: 'studentid' })
	studentId: number;
	@ViewColumn({ name: 'studentname' })
	studentName: string;
	@ViewColumn({ name: 'teacherid' })
	teacherId: number;
	@ViewColumn({ name: 'teachername' })
	teacherName: string;
	@ViewColumn({ name: 'studentcount' })
	studentCount: number;
}
