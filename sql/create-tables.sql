CREATE TABLE users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    first_name character varying(50) COLLATE pg_catalog."default",
    last_name character varying(50) COLLATE pg_catalog."default",
    date_created date,
    color character varying(20) COLLATE pg_catalog."default",
    password character varying(100) COLLATE pg_catalog."default",
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(200) COLLATE pg_catalog."default",
    google_id character varying(256) COLLATE pg_catalog."default",
    tier smallint,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE room
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(50) COLLATE pg_catalog."default",
    public boolean,
    CONSTRAINT room_pkey PRIMARY KEY (id)
);

CREATE TABLE room_requests
(
    room integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT room_requests_pkey PRIMARY KEY (room, user_id)
)

CREATE TABLE room_users
(
    room integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT room_users_pkey PRIMARY KEY (room, user_id),
    CONSTRAINT room_users_room_fkey FOREIGN KEY (room)
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_users_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE deep_work_hour_tracker
(
    user_id integer NOT NULL,
    hours integer,
    date date,
    was_notable boolean,
    accomplishment text COLLATE pg_catalog."default",
    room integer NOT NULL,
    CONSTRAINT deep_work_hour_tracker_pkey PRIMARY KEY (user_id, room, date),
    CONSTRAINT deep_work_hour_tracker_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE streak_tracker
(
    user_id integer NOT NULL,
    start_date date,
    room integer NOT NULL,
    end_date date,
    CONSTRAINT streak_tracker_pkey PRIMARY KEY (user_id, room),
    CONSTRAINT streak_tracker_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE streak_highscore
(
    user_id integer NOT NULL,
    start_date date,
    end_date date,
    room integer NOT NULL,
    CONSTRAINT streak_highscore_pkey PRIMARY KEY (user_id, room),
    CONSTRAINT streak_highscore_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE goals
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    start_date date,
    end_date date,
    status character varying(200) COLLATE pg_catalog."default",
    title character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    room integer,
    "order" integer,
    archived boolean,
    CONSTRAINT goals_pkey PRIMARY KEY (id),
    CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE tasks
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    goal_id integer,
    user_id integer,
    title character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    date_created date,
    date_completed date,
    "order" integer,
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_goal_id_fkey FOREIGN KEY (goal_id)
        REFERENCES public.goals (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE journal
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    date date,
    entry text COLLATE pg_catalog."default",
    room integer,
    CONSTRAINT journal_pkey PRIMARY KEY (id),
    CONSTRAINT journal_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE tags
(
    tag character varying(50) COLLATE pg_catalog."default",
    user_id integer NOT NULL,
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    room integer NOT NULL,
    CONSTRAINT tags_pkey PRIMARY KEY (user_id, id, room),
    CONSTRAINT tags_room_fkey FOREIGN KEY (room)
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE journal_tags
(
    journal_entry integer NOT NULL,
    tag integer NOT NULL,
    CONSTRAINT journal_tags_pkey PRIMARY KEY (journal_entry, tag)
);

CREATE TABLE task_tags
(
    task_id integer NOT NULL,
    tag integer NOT NULL,
    CONSTRAINT task_tags_pkey PRIMARY KEY (task_id, tag),
    CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id)
        REFERENCES public.tasks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE updates
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    date date NOT NULL,
    info text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT updates_pkey PRIMARY KEY (id)
);

CREATE TABLE feedback
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    post text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    parent integer,
    deleted boolean,
    CONSTRAINT feedback_pkey PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    FOREIGN KEY (room_id) REFERENCES room(id)
);

CREATE TABLE notebook_pages (
    id SERIAL PRIMARY KEY,
    notebook_id INTEGER NOT NULL,
    parent_id INTEGER,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    "order" INTEGER NOT NULL,
    last_edited_by INTEGER,
    last_edited_at TIMESTAMP,
    FOREIGN KEY (notebook_id) REFERENCES notebooks(id),
    FOREIGN KEY (parent_id) REFERENCES notebook_pages(id),
    FOREIGN KEY (last_edited_by) REFERENCES users(id)
);