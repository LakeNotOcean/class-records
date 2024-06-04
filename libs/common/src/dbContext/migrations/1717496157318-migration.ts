import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1717496157318 implements MigrationInterface {
	name = 'Migration1717496157318';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "class"."typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
			['VIEW', 'lessons_view', 'class'],
		);
		await queryRunner.query(`DROP VIEW "class"."lessons_view"`);
		await queryRunner.query(`CREATE VIEW "class"."lessons_view" AS select l.id as lessonId, l."date" as lessonDate, l.status as lessonStatus, l.title as lessonTitle, 
    ls.visit as studentVisit, s.id as studentId, s."name" as studentName,
    t.id as teacherId, t."name" as teacherName,
    ls2.studentCount::int as studentCount
    from "class".lessons l 
    left join "class".lesson_students ls on l.id =ls.lesson_id
    left join (
        select ls2_1.lesson_id,
            count(ls2_1.student_id) as studentCount
           from "class".lesson_students ls2_1
           group by ls2_1.lesson_id
    ) ls2 on ls2.lesson_id = l.id  
    left join "class".students s on s.id = ls.student_id 
    left join "class".lesson_teachers lt ON l.id = lt.lesson_id 
    left join "class".teachers t on t.id = lt.teacher_id`);
		await queryRunner.query(
			`INSERT INTO "class"."typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
			[
				'class',
				'VIEW',
				'lessons_view',
				'select l.id as lessonId, l."date" as lessonDate, l.status as lessonStatus, l.title as lessonTitle, \n    ls.visit as studentVisit, s.id as studentId, s."name" as studentName,\n    t.id as teacherId, t."name" as teacherName,\n    ls2.studentCount::int as studentCount\n    from lessons l \n    left join lesson_students ls on l.id =ls.lesson_id\n    left join (\n        select ls2_1.lesson_id,\n            count(ls2_1.student_id) as studentCount\n           from lesson_students ls2_1\n           group by ls2_1.lesson_id\n    ) ls2 on ls2.lesson_id = l.id  \n    left join students s on s.id = ls.student_id \n    left join lesson_teachers lt ON l.id = lt.lesson_id \n    left join teachers t on t.id = lt.teacher_id',
			],
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "class"."typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
			['VIEW', 'lessons_view', 'class'],
		);
		await queryRunner.query(`DROP VIEW "class"."lessons_view"`);
		await queryRunner.query(`CREATE VIEW "class"."lessons_view" AS select l.id as lessonId, l."date" as lessonDate, l.status as lessonStatus, l.title as lessonTitle, 
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
    left join teachers t on t.id = lt.teacher_id`);
		await queryRunner.query(
			`INSERT INTO "class"."typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
			[
				'class',
				'VIEW',
				'lessons_view',
				'select l.id as lessonId, l."date" as lessonDate, l.status as lessonStatus, l.title as lessonTitle, \n    ls.visit as studentVisit, s.id as studentId, s."name" as studentName,\n    t.id as teacherId, t."name" as teacherName,\n    ls2.studentCount::int as studentCount\n    from lessons l \n    left join lesson_students ls on l.id =ls.lesson_id\n    left join (\n        select  lesson_id, count(student_id) over (partition by lesson_id) as studentCount\n        from lesson_students ls2 \n    ) ls2 on ls2.lesson_id = l.id  \n    left join students s on s.id = ls.student_id \n    left join lesson_teachers lt ON l.id = lt.lesson_id \n    left join teachers t on t.id = lt.teacher_id',
			],
		);
	}
}
