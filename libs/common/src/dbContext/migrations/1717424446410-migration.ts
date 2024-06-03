import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717424446410 implements MigrationInterface {
    name = 'Migration1717424446410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class"."teachers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "teacher_pkey" ON "class"."teachers" ("id") `);
        await queryRunner.query(`CREATE INDEX "teachers_id_idx" ON "class"."teachers" ("id") `);
        await queryRunner.query(`CREATE TABLE "class"."lessons" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL DEFAULT false, "title" character varying(100) NOT NULL, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "lesson_pkey" ON "class"."lessons" ("id") `);
        await queryRunner.query(`CREATE INDEX "lessons_id_idx" ON "class"."lessons" ("id") `);
        await queryRunner.query(`CREATE TABLE "class"."lesson_students" ("lesson_id" integer NOT NULL, "student_id" integer NOT NULL, "visit" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fe11a4c8a2751a6244bb76d3b01" PRIMARY KEY ("lesson_id", "student_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "student_id_lesson_id_pkey" ON "class"."lesson_students" ("lesson_id", "student_id") `);
        await queryRunner.query(`CREATE TABLE "class"."students" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "student_pkey" ON "class"."students" ("id") `);
        await queryRunner.query(`CREATE TABLE "class"."lesson_teachers" ("lesson_id" integer NOT NULL, "teacher_id" integer NOT NULL, CONSTRAINT "PK_0608352f4a8735dea710251b62e" PRIMARY KEY ("lesson_id", "teacher_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5725c7621d72874d7880838d64" ON "class"."lesson_teachers" ("lesson_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_11a9050d3c3d6c0fd896a06ede" ON "class"."lesson_teachers" ("teacher_id") `);
        await queryRunner.query(`ALTER TABLE "class"."lesson_students" ADD CONSTRAINT "FK_8bb87d71655705d0cc95c09ec1b" FOREIGN KEY ("lesson_id") REFERENCES "class"."lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class"."lesson_students" ADD CONSTRAINT "FK_f04ed80369f1f0b0b8a4fb7e896" FOREIGN KEY ("student_id") REFERENCES "class"."students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class"."lesson_teachers" ADD CONSTRAINT "FK_5725c7621d72874d7880838d64d" FOREIGN KEY ("lesson_id") REFERENCES "class"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "class"."lesson_teachers" ADD CONSTRAINT "FK_11a9050d3c3d6c0fd896a06ede2" FOREIGN KEY ("teacher_id") REFERENCES "class"."teachers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class"."lesson_teachers" DROP CONSTRAINT "FK_11a9050d3c3d6c0fd896a06ede2"`);
        await queryRunner.query(`ALTER TABLE "class"."lesson_teachers" DROP CONSTRAINT "FK_5725c7621d72874d7880838d64d"`);
        await queryRunner.query(`ALTER TABLE "class"."lesson_students" DROP CONSTRAINT "FK_f04ed80369f1f0b0b8a4fb7e896"`);
        await queryRunner.query(`ALTER TABLE "class"."lesson_students" DROP CONSTRAINT "FK_8bb87d71655705d0cc95c09ec1b"`);
        await queryRunner.query(`DROP INDEX "class"."IDX_11a9050d3c3d6c0fd896a06ede"`);
        await queryRunner.query(`DROP INDEX "class"."IDX_5725c7621d72874d7880838d64"`);
        await queryRunner.query(`DROP TABLE "class"."lesson_teachers"`);
        await queryRunner.query(`DROP INDEX "class"."student_pkey"`);
        await queryRunner.query(`DROP TABLE "class"."students"`);
        await queryRunner.query(`DROP INDEX "class"."student_id_lesson_id_pkey"`);
        await queryRunner.query(`DROP TABLE "class"."lesson_students"`);
        await queryRunner.query(`DROP INDEX "class"."lessons_id_idx"`);
        await queryRunner.query(`DROP INDEX "class"."lesson_pkey"`);
        await queryRunner.query(`DROP TABLE "class"."lessons"`);
        await queryRunner.query(`DROP INDEX "class"."teachers_id_idx"`);
        await queryRunner.query(`DROP INDEX "class"."teacher_pkey"`);
        await queryRunner.query(`DROP TABLE "class"."teachers"`);
    }

}
