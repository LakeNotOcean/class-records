-- DROP SCHEMA "class";

CREATE SCHEMA "class" AUTHORIZATION class_db_user;

-- DROP SEQUENCE "class".lessons_id_seq;

CREATE SEQUENCE "class".lessons_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "class".migrations_id_seq;

CREATE SEQUENCE "class".migrations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "class".students_id_seq;

CREATE SEQUENCE "class".students_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "class".teachers_id_seq;

CREATE SEQUENCE "class".teachers_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- "class".lessons definition

-- Drop table

-- DROP TABLE "class".lessons;

CREATE TABLE "class".lessons (
	id serial4 NOT NULL,
	"date" timestamp NOT NULL DEFAULT now(),
	status bool NOT NULL DEFAULT false,
	title varchar(100) NOT NULL,
	CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX lesson_pkey ON class.lessons USING btree (id);
CREATE INDEX lessons_id_idx ON class.lessons USING btree (id);


-- "class".migrations definition

-- Drop table

-- DROP TABLE "class".migrations;

CREATE TABLE "class".migrations (
	id serial4 NOT NULL,
	"timestamp" int8 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id)
);


-- "class".students definition

-- Drop table

-- DROP TABLE "class".students;

CREATE TABLE "class".students (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX student_pkey ON class.students USING btree (id);


-- "class".teachers definition

-- Drop table

-- DROP TABLE "class".teachers;

CREATE TABLE "class".teachers (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX teacher_pkey ON class.teachers USING btree (id);
CREATE INDEX teachers_id_idx ON class.teachers USING btree (id);


-- "class".typeorm_metadata definition

-- Drop table

-- DROP TABLE "class".typeorm_metadata;

CREATE TABLE "class".typeorm_metadata (
	"type" varchar NOT NULL,
	"database" varchar NULL,
	"schema" varchar NULL,
	"table" varchar NULL,
	"name" varchar NULL,
	value text NULL
);


-- "class".lesson_students definition

-- Drop table

-- DROP TABLE "class".lesson_students;

CREATE TABLE "class".lesson_students (
	lesson_id int4 NOT NULL,
	student_id int4 NOT NULL,
	visit bool NOT NULL DEFAULT false,
	CONSTRAINT "PK_fe11a4c8a2751a6244bb76d3b01" PRIMARY KEY (lesson_id, student_id),
	CONSTRAINT "FK_8bb87d71655705d0cc95c09ec1b" FOREIGN KEY (lesson_id) REFERENCES "class".lessons(id) ON DELETE CASCADE,
	CONSTRAINT "FK_f04ed80369f1f0b0b8a4fb7e896" FOREIGN KEY (student_id) REFERENCES "class".students(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX student_id_lesson_id_pkey ON class.lesson_students USING btree (lesson_id, student_id);


-- "class".lesson_teachers definition

-- Drop table

-- DROP TABLE "class".lesson_teachers;

CREATE TABLE "class".lesson_teachers (
	lesson_id int4 NOT NULL,
	teacher_id int4 NOT NULL,
	CONSTRAINT "PK_0608352f4a8735dea710251b62e" PRIMARY KEY (lesson_id, teacher_id),
	CONSTRAINT "FK_11a9050d3c3d6c0fd896a06ede2" FOREIGN KEY (teacher_id) REFERENCES "class".teachers(id) ON DELETE CASCADE,
	CONSTRAINT "FK_5725c7621d72874d7880838d64d" FOREIGN KEY (lesson_id) REFERENCES "class".lessons(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IDX_11a9050d3c3d6c0fd896a06ede" ON class.lesson_teachers USING btree (teacher_id);
CREATE INDEX "IDX_5725c7621d72874d7880838d64" ON class.lesson_teachers USING btree (lesson_id);


-- "class".lessons_view source

CREATE OR REPLACE VIEW "class".lessons_view
AS SELECT l.id AS lessonid,
    l.date AS lessondate,
    l.status AS lessonstatus,
    l.title AS lessontitle,
    ls.visit AS studentvisit,
    s.id AS studentid,
    s.name AS studentname,
    t.id AS teacherid,
    t.name AS teachername,
    ls2.studentcount::integer AS studentcount
   FROM class.lessons l
     LEFT JOIN class.lesson_students ls ON l.id = ls.lesson_id
     LEFT JOIN ( SELECT ls2_1.lesson_id,
            count(ls2_1.student_id) AS studentcount
           FROM class.lesson_students ls2_1
          GROUP BY ls2_1.lesson_id) ls2 ON ls2.lesson_id = l.id
     LEFT JOIN class.students s ON s.id = ls.student_id
     LEFT JOIN class.lesson_teachers lt ON l.id = lt.lesson_id
     LEFT JOIN class.teachers t ON t.id = lt.teacher_id;
