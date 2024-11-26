--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entries (
    id integer NOT NULL,
    firebase_id character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    food_name character varying(255) NOT NULL,
    calories integer NOT NULL,
    protein integer NOT NULL,
    carbs integer NOT NULL,
    fats integer NOT NULL,
    serving_type character varying(100) NOT NULL,
    servings double precision NOT NULL,
    created_at date DEFAULT date_trunc('day'::text, CURRENT_TIMESTAMP),
    updated_at date DEFAULT date_trunc('day'::text, CURRENT_TIMESTAMP)
);


ALTER TABLE public.entries OWNER TO postgres;

--
-- Name: entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.entries_id_seq OWNER TO postgres;

--
-- Name: entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entries_id_seq OWNED BY public.entries.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    firebase_id character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    calorie_goal integer NOT NULL,
    protein_goal integer NOT NULL,
    carb_goal integer NOT NULL,
    fat_goal integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entries ALTER COLUMN id SET DEFAULT nextval('public.entries_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Data for Name: entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entries (id, firebase_id, email, food_name, calories, protein, carbs, fats, serving_type, servings, created_at, updated_at) FROM stdin;
2	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	118	2	26	0	1g	32	2024-11-10	2024-11-11
1	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	29	1	6	0	1g	8	2024-11-10	2024-11-11
4	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Chicken	121	11	0	8	1oz	5	2024-11-09	2024-11-11
10	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Steak	760	67	0	53	1oz	10	2024-11-11	2024-11-11
11	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Toast	348	14	62	4	1oz	1	2024-11-11	2024-11-11
12	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Chick-Fil-a Deluxe Sandwich	423	25	35	20	1oz	16	2024-11-11	2024-11-11
13	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Pop Tart	412	5	68	13	1oz	3.7	2024-11-11	2024-11-11
15	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Bacon Burger	336	18	17	22	1oz	12	2024-11-12	2024-11-12
16	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	514	10	113	1	1oz	5	2024-11-12	2024-11-12
17	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Fries	452	7	53	25	1oz	30	2024-11-12	2024-11-12
18	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Pop Tart	412	5	68	13	1oz	3.7	2024-11-12	2024-11-12
20	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Beef	180	30	0	7	1g	235	2024-11-21	2024-11-21
21	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	514	10	113	1	1oz	5	2024-11-21	2024-11-21
23	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Beef	75	13	0	3	1oz	3.5	2024-11-22	2024-11-22
24	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Cheeseburger	787	39	84	36	1g	356	2024-11-22	2024-11-22
25	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Egg	239	233	30	180	1oz	32	2024-11-23	2024-11-23
36	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	411	8	90	1	1oz	4	2024-11-23	2024-11-23
37	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	3291	64	722	9	1oz	32	2024-11-24	2024-11-24
38	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Rice	1029	20	226	3	1oz	10	2024-11-25	2024-11-25
39	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Beef and rice	342	32	1	34	custom	1	2024-11-25	2024-11-25
40	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Beef	639	108	0	25	1oz	30	2024-11-25	2024-11-25
41	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Beef	922	4	12	5	1g	32	2024-11-26	2024-11-26
42	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	Beef	2343	1	0	0	1g	4	2024-11-26	2024-11-26
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, firebase_id, email, calorie_goal, protein_goal, carb_goal, fat_goal, created_at, updated_at) FROM stdin;
1	q29L8GoOskWyN7J6YKde6nHhLTn1	eatong13@gmail.com	2700	236	270	75	2024-11-11 00:11:58.183445	2024-11-11 00:11:58.183445
\.


--
-- Name: entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entries_id_seq', 42, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: entries entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entries
    ADD CONSTRAINT entries_pkey PRIMARY KEY (id);


--
-- Name: settings settings_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_email_key UNIQUE (email);


--
-- Name: settings settings_firebase_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_firebase_id_key UNIQUE (firebase_id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: entries entries_firebase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entries
    ADD CONSTRAINT entries_firebase_id_fkey FOREIGN KEY (firebase_id) REFERENCES public.settings(firebase_id);


--
-- PostgreSQL database dump complete
--

