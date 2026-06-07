--
-- PostgreSQL database dump
--

\restrict 7VcoyZhEsqy8VvzgDmAibM6W7MXNlB5RDXHucu6QVLowPrvitxClGUBO7OydNAF

-- Dumped from database version 17.7 (Debian 17.7-3.pgdg12+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS fkqnq71xsohugpqwf3c9gxmsuy;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_items DROP CONSTRAINT IF EXISTS fkot6hm3v41sabtmfrbf6eitfj2;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS fkosqitn4s405cynmhb87lkvuau;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS fkog2rp4qthbtt2lfyhfo32lsw9;
ALTER TABLE IF EXISTS ONLY public.product_option_values DROP CONSTRAINT IF EXISTS fkmre6ippw97evhwrbl15ushuw;
ALTER TABLE IF EXISTS ONLY public.flash_sale_items DROP CONSTRAINT IF EXISTS fkmr5agn0eu29xqqog30yspa3e3;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_categories DROP CONSTRAINT IF EXISTS fkj3m6nb980xhaiedm22l4k0hsn;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_categories DROP CONSTRAINT IF EXISTS fkh19ybnjas1kvt0i3uc6hafkm5;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_discount_tiers DROP CONSTRAINT IF EXISTS fkdcwf0ovselkmvwnbjaflhv3is;
ALTER TABLE IF EXISTS ONLY public.variant_option_values DROP CONSTRAINT IF EXISTS fkc9eay2np5s77aow2qo9k36drc;
ALTER TABLE IF EXISTS ONLY public.variant_option_values DROP CONSTRAINT IF EXISTS fk9b9ufkyxmc7sh370irn5b3hx6;
ALTER TABLE IF EXISTS ONLY public.product_options DROP CONSTRAINT IF EXISTS fk8vv4f8fru80wxocwgxwsrow61;
ALTER TABLE IF EXISTS ONLY public.flash_sale_items DROP CONSTRAINT IF EXISTS fk86yyoqeiisx1rsodorhrao4bt;
ALTER TABLE IF EXISTS ONLY public.description_images DROP CONSTRAINT IF EXISTS fk7g796lyqg0nsf37f4p90vrl1r;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_items DROP CONSTRAINT IF EXISTS fk2rmlbtla2f1tnwmhk1vd8slta;
DROP INDEX IF EXISTS public.idx_sale_campaign_tier_campaign;
DROP INDEX IF EXISTS public.idx_sale_campaign_status;
DROP INDEX IF EXISTS public.idx_sale_campaign_start_time;
DROP INDEX IF EXISTS public.idx_sale_campaign_slug;
DROP INDEX IF EXISTS public.idx_sale_campaign_item_variant;
DROP INDEX IF EXISTS public.idx_sale_campaign_item_campaign;
DROP INDEX IF EXISTS public.idx_sale_campaign_end_time;
DROP INDEX IF EXISTS public.idx_sale_campaign_deleted;
DROP INDEX IF EXISTS public.idx_sale_campaign_category_category;
DROP INDEX IF EXISTS public.idx_sale_campaign_category_campaign;
DROP INDEX IF EXISTS public.idx_product_user_id;
DROP INDEX IF EXISTS public.idx_product_status_user;
DROP INDEX IF EXISTS public.idx_product_status;
DROP INDEX IF EXISTS public.idx_product_slug;
DROP INDEX IF EXISTS public.idx_product_deleted;
DROP INDEX IF EXISTS public.idx_product_category_id;
DROP INDEX IF EXISTS public.idx_flash_sale_status;
DROP INDEX IF EXISTS public.idx_flash_sale_start_time;
DROP INDEX IF EXISTS public.idx_flash_sale_slug;
DROP INDEX IF EXISTS public.idx_flash_sale_item_variant;
DROP INDEX IF EXISTS public.idx_flash_sale_item_flash_sale;
DROP INDEX IF EXISTS public.idx_flash_sale_end_time;
DROP INDEX IF EXISTS public.idx_flash_sale_deleted;
DROP INDEX IF EXISTS public.flyway_schema_history_s_idx;
ALTER TABLE IF EXISTS ONLY public.variant_option_values DROP CONSTRAINT IF EXISTS variant_option_values_pkey;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS ukq935p2d1pbjm39n0063ghnfgn;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS ukoul14ho7bctbefv8jywp5v3i2;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS ukostq1ec3toafnjok09y9l7dox;
ALTER TABLE IF EXISTS ONLY public.sale_campaigns DROP CONSTRAINT IF EXISTS ukngkcpm5d7agj1q4m9f0j61dcl;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_items DROP CONSTRAINT IF EXISTS uk_sale_campaign_variant;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_categories DROP CONSTRAINT IF EXISTS uk_sale_campaign_category;
ALTER TABLE IF EXISTS ONLY public.flash_sale_items DROP CONSTRAINT IF EXISTS uk_flash_sale_variant;
ALTER TABLE IF EXISTS ONLY public.flash_sales DROP CONSTRAINT IF EXISTS uk5vmdq5jtlly1uxe1mtdn270hx;
ALTER TABLE IF EXISTS ONLY public.sale_campaigns DROP CONSTRAINT IF EXISTS sale_campaigns_pkey;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_items DROP CONSTRAINT IF EXISTS sale_campaign_items_pkey;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_discount_tiers DROP CONSTRAINT IF EXISTS sale_campaign_discount_tiers_pkey;
ALTER TABLE IF EXISTS ONLY public.sale_campaign_categories DROP CONSTRAINT IF EXISTS sale_campaign_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS product_variants_pkey;
ALTER TABLE IF EXISTS ONLY public.product_options DROP CONSTRAINT IF EXISTS product_options_pkey;
ALTER TABLE IF EXISTS ONLY public.product_option_values DROP CONSTRAINT IF EXISTS product_option_values_pkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_pkey;
ALTER TABLE IF EXISTS ONLY public.flyway_schema_history DROP CONSTRAINT IF EXISTS flyway_schema_history_pk;
ALTER TABLE IF EXISTS ONLY public.flash_sales DROP CONSTRAINT IF EXISTS flash_sales_pkey;
ALTER TABLE IF EXISTS ONLY public.flash_sale_items DROP CONSTRAINT IF EXISTS flash_sale_items_pkey;
ALTER TABLE IF EXISTS ONLY public.description_images DROP CONSTRAINT IF EXISTS description_images_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
DROP TABLE IF EXISTS public.variant_option_values;
DROP TABLE IF EXISTS public.sale_campaigns;
DROP TABLE IF EXISTS public.sale_campaign_items;
DROP TABLE IF EXISTS public.sale_campaign_discount_tiers;
DROP TABLE IF EXISTS public.sale_campaign_categories;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.product_variants;
DROP TABLE IF EXISTS public.product_options;
DROP TABLE IF EXISTS public.product_option_values;
DROP TABLE IF EXISTS public.product_images;
DROP TABLE IF EXISTS public.flyway_schema_history;
DROP TABLE IF EXISTS public.flash_sales;
DROP TABLE IF EXISTS public.flash_sale_items;
DROP TABLE IF EXISTS public.description_images;
DROP TABLE IF EXISTS public.categories;
DROP EXTENSION IF EXISTS vector;
DROP EXTENSION IF EXISTS pg_trgm;
--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean,
    image_url character varying(255),
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: description_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.description_images (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean NOT NULL,
    deleted_at timestamp(6) without time zone,
    image_url character varying(500) NOT NULL,
    product_id bigint NOT NULL
);


--
-- Name: description_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.description_images ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.description_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: flash_sale_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flash_sale_items (
    id bigint NOT NULL,
    flash_sale_price numeric(10,2) NOT NULL,
    sold_count integer,
    sort_order integer,
    stock_limit integer NOT NULL,
    flash_sale_id bigint NOT NULL,
    variant_id bigint NOT NULL
);


--
-- Name: flash_sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.flash_sale_items ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.flash_sale_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: flash_sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flash_sales (
    id bigint NOT NULL,
    banner_url character varying(500),
    created_at timestamp(6) without time zone,
    deleted boolean,
    description text,
    end_time timestamp(6) without time zone NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    start_time timestamp(6) without time zone NOT NULL,
    status character varying(20) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT flash_sales_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'SCHEDULED'::character varying, 'ACTIVE'::character varying, 'ENDED'::character varying, 'CANCELLED'::character varying])::text[])))
);


--
-- Name: flash_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.flash_sales ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.flash_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    image_url character varying(500) NOT NULL,
    product_id bigint NOT NULL
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_images ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_option_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_option_values (
    id bigint NOT NULL,
    display_value character varying(100) NOT NULL,
    sort_order integer,
    value character varying(100) NOT NULL,
    option_id bigint NOT NULL
);


--
-- Name: product_option_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_option_values ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_option_values_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_options (
    id bigint NOT NULL,
    display_name character varying(100) NOT NULL,
    is_required boolean,
    name character varying(100) NOT NULL,
    sort_order integer,
    product_id bigint NOT NULL
);


--
-- Name: product_options_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_options ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    hidden boolean,
    image_url character varying(255),
    is_active boolean,
    price numeric(38,2) NOT NULL,
    sku character varying(100) NOT NULL,
    stock integer NOT NULL,
    total_sold integer,
    updated_at timestamp(6) without time zone,
    product_id bigint NOT NULL
);


--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_variants ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_variants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    average_rating double precision,
    created_at timestamp(6) without time zone,
    deleted boolean,
    description text,
    max_price numeric(38,2),
    metadata jsonb,
    min_price numeric(38,2),
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    specifications jsonb,
    status character varying(20),
    total_reviews bigint,
    total_sold bigint,
    updated_at timestamp(6) without time zone,
    user_id bigint,
    category_id bigint,
    embedding public.vector(768)
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.products ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sale_campaign_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_campaign_categories (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    category_id bigint NOT NULL,
    sale_campaign_id bigint NOT NULL
);


--
-- Name: sale_campaign_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.sale_campaign_categories ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sale_campaign_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sale_campaign_discount_tiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_campaign_discount_tiers (
    id bigint NOT NULL,
    discount_percent integer NOT NULL,
    max_price numeric(12,2) NOT NULL,
    min_price numeric(12,2) NOT NULL,
    sort_order integer,
    sale_campaign_id bigint NOT NULL
);


--
-- Name: sale_campaign_discount_tiers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.sale_campaign_discount_tiers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sale_campaign_discount_tiers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sale_campaign_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_campaign_items (
    id bigint NOT NULL,
    discount_percent integer NOT NULL,
    sale_price numeric(10,2) NOT NULL,
    sold_count integer,
    sort_order integer,
    stock_limit integer NOT NULL,
    sale_campaign_id bigint NOT NULL,
    variant_id bigint NOT NULL
);


--
-- Name: sale_campaign_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.sale_campaign_items ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sale_campaign_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sale_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_campaigns (
    id bigint NOT NULL,
    banner_url character varying(500),
    created_at timestamp(6) without time zone,
    deleted boolean,
    description text,
    end_time timestamp(6) without time zone NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    start_time timestamp(6) without time zone NOT NULL,
    status character varying(20) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT sale_campaigns_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'SCHEDULED'::character varying, 'ACTIVE'::character varying, 'ENDED'::character varying, 'CANCELLED'::character varying])::text[])))
);


--
-- Name: sale_campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.sale_campaigns ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sale_campaigns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: variant_option_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_option_values (
    id bigint NOT NULL,
    price_modifier numeric(38,2),
    option_value_id bigint NOT NULL,
    variant_id bigint NOT NULL
);


--
-- Name: variant_option_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.variant_option_values ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.variant_option_values_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, created_at, deleted, image_url, name, slug, updated_at) FROM stdin;
1	2026-02-04 20:14:51.56619	f	6ce5b23b-c8c1-43f8-8784-d8cd3c425489_31234a27876fb89cd522d7e3db1ba5ca.png	─Éiß╗çn thoß║íi	in-thoi	2026-02-04 20:15:29.133266
2	2026-03-10 12:30:58.237382	f	78ddabdb-569a-4a43-9afe-dc5697d5eef9_b08e7d4243e9112294782a6120bfc09f&quot.jpg	Giß║╖t Gi┼⌐ & Ch─âm S├│c Nh├á Cß╗¡a	git-gi-chm-sc-nh-ca	2026-03-10 12:31:53.215102
3	2026-03-23 06:58:27.97302	f	03b8fa52-d4db-43c1-a8cd-1f7d127e7872_c3f3edfaa9f6dafc4825b77d8449999d@resize_w320_nl.webp	Latop	latop	2026-03-23 07:08:51.057087
5	2026-03-23 07:01:54.827783	f	821d81f6-0132-4679-b5d7-da8ad4751d83_687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp	├üo	├ío	2026-03-23 07:09:00.120004
4	2026-03-23 07:01:44.127566	f	8b6708bd-1d25-4a11-bc5e-accc374017e8_687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp	Gi├áy	gi├áy	2026-03-23 07:09:44.700169
6	2026-03-23 07:02:04.455346	f	67a1bb99-2936-477a-bcc8-7b8f17790355_687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp	─Éß╗ông Hß╗ô	─æß╗ông-hß╗ô	2026-03-23 07:10:17.071856
7	2026-03-23 07:02:12.803429	f	e20007d7-d09e-4cc6-aa9b-b749d35f7d21_687f3967b7c2fe6a134a2c11894eea4b@resize_w320_nl.webp	Tai Nghe	tai-nghe	2026-03-23 07:11:56.981348
8	2026-05-12 15:44:08.914088	t	4d154e82-aa54-4fdd-99cf-2670f2c005f8_OIP.webp	testing	testing	2026-05-12 15:45:08.375261
9	2026-06-07 13:13:12.050563	f	f87601f6-9097-4c8b-ad05-324399f46944_Screenshot_7-6-2026_13631_www.bing.com.jpeg	S├ích	s├ích	2026-06-07 13:13:21.762051
10	2026-06-07 13:42:12.495827	f	804cf8a2-b37c-4d3c-b907-3dc39c61ca66_OIP.webp	S├ích gi├ío khoa	s├ích-gi├ío-khoa	2026-06-07 13:42:19.638828
\.


--
-- Data for Name: description_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.description_images (id, created_at, deleted, deleted_at, image_url, product_id) FROM stdin;
1	2026-02-04 20:28:59.715869	f	\N	d1eff76c-6eca-4e13-9ff9-29cd7c1e6107_vn-11134208-820l4-mejvkvag3oqpe4.png	1
2	2026-02-04 20:29:04.078152	f	\N	59a69870-d747-4d4d-bb04-00be7434d5f9_vn-11134208-820l4-mejvkvag53b587.png	1
3	2026-02-04 20:38:51.917524	f	\N	68a3caa6-203c-45ce-b539-bf721073acad_vn-11134208-820l4-mejvkvag3oqpe4.png	1
4	2026-02-04 20:38:56.239959	f	\N	b6ab0fe2-9577-491b-9802-9da9f3c92c32_vn-11134208-820l4-mejvkvag53b587.png	1
5	2026-02-04 20:56:04.19166	f	\N	a34588b8-e646-4e8c-a14f-31b6efd1e120_vn-11134208-820l4-mejvkvag3oqpe4.png	1
6	2026-02-04 20:56:30.101293	f	\N	19b2c11f-d9da-4a85-aa43-f6c08ba27907_vn-11134208-820l4-mejvkvag3oqpe4.png	1
7	2026-03-23 07:51:28.891787	f	\N	712dda1f-5f22-4c13-b62e-5faeedb61691_vn-11134207-7r98o-lv187gjlqj2185.webp	14
9	2026-03-23 08:08:52.114359	f	\N	08c85787-5da9-4b38-a675-7e951de284db_vn-11134207-820l4-mifexpg9li4i45.webp	18
8	2026-03-23 08:08:49.479321	t	2026-03-23 08:08:52.214478	54a9a6d5-f7a5-49a4-8dab-0c4965301a4e_vn-11134207-820l4-mifexpj3sbggfd.webp	18
10	2026-05-12 15:24:14.48143	f	\N	b58cab7e-7def-4869-b5ea-e6f18e0a2daf_OIP (1).webp	30
11	2026-06-07 13:07:43.495245	f	\N	bda6a275-891f-49a1-b6cd-af281179ea8e_Screenshot_7-6-2026_13631_www.bing.com.jpeg	31
12	2026-06-07 13:38:35.033716	f	\N	d6f1a5a4-9c67-4db5-b098-b13d853fe4c3_Screenshot_7-6-2026_13631_www.bing.com.jpeg	32
\.


--
-- Data for Name: flash_sale_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flash_sale_items (id, flash_sale_price, sold_count, sort_order, stock_limit, flash_sale_id, variant_id) FROM stdin;
2	9500000.00	0	1	100	1	5
\.


--
-- Data for Name: flash_sales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flash_sales (id, banner_url, created_at, deleted, description, end_time, name, slug, start_time, status, updated_at) FROM stdin;
1	\N	2026-03-20 22:45:28.274621	t	New description	2026-03-25 22:00:00	Summer Flash Sale 2026 - Updated	summer-flash-sale-2026	2026-03-21 10:00:00	CANCELLED	2026-03-20 22:46:05.128104
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	create product embeddings table	SQL	V1__create_product_embeddings_table.sql	81202814	fragile	2026-03-20 21:46:05.481435	15	t
2	2	add pg trgm extension	SQL	V2__add_pg_trgm_extension.sql	1704763490	fragile	2026-03-23 09:04:46.952022	43	t
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, created_at, image_url, product_id) FROM stdin;
1	2026-02-04 20:26:09.996237	f54bc398-0538-422d-9b66-9c71cf571046_xanh.webp	1
4	2026-02-04 20:26:20.706024	e3515d24-c330-431b-8cda-cd1a84b0d3cf_bac.webp	1
5	2026-02-04 20:53:30.023957	ab8f45fd-b892-4871-bb3e-a10233ddb264_456.webp	2
6	2026-02-04 20:53:32.791743	6997b28f-ffc0-4163-acf7-3607db617e12_123.webp	2
7	2026-02-04 20:53:35.206403	926f4b4f-9de4-4992-bde5-78c1bbe1640d_red.webp	2
8	2026-02-04 20:53:38.242214	551613b6-6c81-4a4b-9a88-9d44d6c66332_blue.webp	2
9	2026-02-04 20:53:41.546934	79f60760-c38e-48ce-ab46-cdab1904ec10_pink.webp	2
10	2026-02-04 20:58:48.033207	bc7134d1-b165-46cf-8c2d-678152690c2e_vangnhac.webp	3
11	2026-02-04 20:58:50.340548	eb613465-d15e-4074-b509-de7d3f16f7fd_xanh.webp	3
12	2026-03-10 12:36:28.549788	902a93ab-2d1a-492d-8d89-fb16a0840157_vn-11134207-7r98o-llirfiupxzgo18.jpg	4
13	2026-03-10 12:36:32.80577	efb93bfa-ea07-4f2b-ad89-99551f53a71c_vn-11134207-7r98o-llirfiupwkw868.jpg	4
14	2026-03-10 12:36:35.538199	6128b10a-1508-4f84-8042-ff0372f2433d_vn-11134207-7r98o-llirfiupv6bs9c.jpg	4
15	2026-03-23 07:34:02.776229	95a9564d-5895-4f1d-9006-894f42b2491d_vn-11134207-7r98o-lv187gjlmbcpe5.webp	14
16	2026-03-23 07:34:04.968252	98fdd789-3591-451a-b5aa-8a0a4c61a1ff_vn-11134207-7r98o-lv187gjlkws9b3.webp	14
17	2026-03-23 07:34:07.289766	4b1c7fa3-7423-4932-98a8-8bc0e171e1c5_vn-11134207-7r98o-lv187gjlqj2185.webp	14
18	2026-03-23 07:34:09.716418	8ff96055-e27b-435b-862f-e8f64da913ff_vn-11134207-7r98o-lv187gjli3nd5e@resize_w450_nl.webp	14
19	2026-03-23 07:50:13.620107	e558c530-6f07-4c79-8f05-5cd380447b7e_c06b51be293d745091d27f471c36ebbc.webp	15
20	2026-03-23 07:54:16.46112	ef0d7492-9a97-4b11-992c-656ed6215956_bec1d7ce0af4fbbc5356dee81491a660.webp	16
21	2026-03-23 07:57:44.426561	0712e71a-9ece-422c-ab15-2ca6008c0e4d_sg-11134201-7rdvs-mdmq0b9dfz9x04.webp	17
22	2026-03-23 07:57:46.40658	b09b9697-975a-42b1-a5f5-fff7dad8455e_sg-11134201-7rdyq-mdmq0aznu6qsdb.webp	17
23	2026-03-23 07:57:48.653191	0e9a3c07-db12-474d-a073-6088494cb1b0_sg-11134201-7rdvq-mdmq0ap49mc522.webp	17
24	2026-03-23 07:57:51.264049	0bde67e7-2e4b-48dc-abb8-dafed9671f69_sg-11134201-7rdxh-mdmq0agsn7t629.webp	17
25	2026-03-23 08:06:05.615759	66edd73d-36f4-4944-9e18-cf7f0f879b23_vn-11134207-820l4-mifexpba18n7cd.webp	18
26	2026-03-23 08:06:10.144409	38da3edd-d179-41e7-97b4-1af903d7f8e7_vn-11134207-820l4-mifexpbe4q9tac.webp	18
27	2026-03-23 08:06:12.637651	499cb139-25a1-4096-91a1-1eb1bfedea37_vn-11134207-820l4-mifexpbv9dkwc4.webp	18
28	2026-03-23 08:06:15.212161	59d759d5-6548-43f0-af0c-06e78dc196dd_vn-11134207-820l4-mifexpk5mubo9d.webp	18
29	2026-03-23 08:06:20.553392	94f6b8f2-6899-4e9a-b92e-02f9b310ad45_vn-11134207-820l4-mifexpg9li4i45.webp	18
30	2026-03-23 08:06:22.921563	72b2586c-99db-4758-a517-8aa44eebff29_vn-11134207-820l4-mifexpj3sbggfd.webp	18
31	2026-03-23 08:12:14.199957	a5f8756d-82a0-4921-8592-f28ca2eeaa4a_vn-11134207-81ztc-mkjble9m38jmdd.webp	19
32	2026-03-23 08:12:16.301039	dbec7bc6-88c5-4a05-8fe3-c22f4aee3bc3_vn-11134207-81ztc-mkjble9lqlfq26.webp	19
33	2026-03-23 08:12:18.642002	11834809-b194-455c-9cfd-7e088c02c2d2_vn-11134207-81ztc-mkjble9o02dg27.webp	19
34	2026-03-23 08:12:20.578137	2a06c62e-f114-495b-a955-0ab59fa476d6_vn-11134207-81ztc-mkjble9ljklh68.webp	19
35	2026-03-23 08:16:57.057876	20baf529-38a5-4e06-98be-88342e794389_vn-11134207-820l4-mgy1tctapgy3ed.webp	20
36	2026-03-23 08:16:59.408817	1c7e4acc-bf8a-4175-a856-056c0f74e9f8_vn-11134207-820l4-mgy1tctc2mtl6f.webp	20
37	2026-03-23 08:17:01.576345	898e38a0-7b33-41e8-8e7d-9f78f081d67a_vn-11134207-820l4-me33k55t7ev9d8.webp	20
38	2026-03-23 08:17:05.230921	0a45d530-2879-49ff-8ff5-82597a025ce5_vn-11134207-820l4-me33k55x6osj18.webp	20
39	2026-03-23 08:17:09.930831	69e3e3ee-e8fe-4030-b5aa-b249a5be7852_vn-11134207-820l4-me33kebv3o5c31.webp	20
40	2026-03-23 08:17:12.36765	4588f2f3-77db-4ec0-bb90-3360f5a05ee4_vn-11134207-820l4-me33kbaqvq4hf5.webp	20
41	2026-03-23 08:23:54.86942	aa6a991e-bda2-412c-98c0-9e9272f91c5f_vn-11134207-820l4-mdzrvjciv0uf23.webp	21
42	2026-03-23 08:23:56.70926	a18f9eb4-b175-4419-a05e-9b0e3fbbc74a_vn-11134207-820l4-mdzrvjc2qware9.webp	21
43	2026-03-23 08:23:58.924152	f0d541f7-ca8e-4dff-a08b-0f25ffa7be97_vn-11134207-820l4-mdzrvfursao7de.webp	21
44	2026-03-23 08:27:56.791013	b84732c8-0125-4801-b8fe-9ecb275ce941_vn-11134207-7ras8-m26fph1hejsk28.webp	22
45	2026-03-23 08:27:58.983833	d0bf72a7-57c6-452b-a49f-ae6d756a28ff_vn-11134207-7ras8-m26fph1hbqnoa4.webp	22
46	2026-03-23 08:32:06.493452	c0024f8e-bdc3-4797-b472-f2a450411e5d_vn-11134275-820l4-mipe3b9jyy2v73.webp	23
47	2026-03-23 08:32:08.397425	aea02574-6fd6-4c2f-915a-4fcfde8ebac1_vn-11134275-820l4-mipe3b2zy39fee.webp	23
48	2026-03-23 08:32:10.999192	3f2c4de0-f784-49a1-88f8-18a8ebc97836_br-11134275-81z1k-mipe3afnsw0102.webp	23
49	2026-03-23 08:37:30.410832	4e5e7e91-2a8b-407d-839d-79575fdc260d_vn-11134207-7ras8-mc1tq9sufnfu05.webp	24
50	2026-03-23 08:39:42.754433	cf75338b-d36e-458a-a110-3d2e7d8b0a73_vn-11134207-7ras8-mav3u8y1zy695c.webp	25
51	2026-03-23 08:42:17.42935	22849528-8688-4564-b92f-8730b7376e1d_sg-11134201-23020-s9zoap6m75mve8.webp	26
52	2026-03-23 08:46:58.820942	af18e6e4-4eea-4a39-a79e-559ddb3f4465_64dd5865719e855ca0b9ad5bc5a49f27.webp	27
53	2026-03-23 08:47:00.876504	5aff605c-68c0-496b-ad80-a305c9acc2a4_ffc9a412d20c346635a1508e465b6793.webp	27
54	2026-03-23 08:47:03.169013	e45ef537-d8bf-4929-9e88-e799ffff6971_vn-11134207-820l4-mflbwjdsp5hlb4.webp	27
55	2026-03-23 08:49:47.293876	247f406e-d6e6-42dc-8b9e-6a6c35c8a23e_2214638681d61ae8da9da68833998fca.webp	28
56	2026-03-23 08:49:50.293839	4adf5055-d950-4512-8364-4bfeab3646c6_54b1d64726937c3f85d8a7f8d2ebe14a.webp	28
57	2026-03-23 08:49:52.262648	7e1ca05a-1466-42bf-b83a-03ea829ef196_d37bcce509deea69faa454495ce01b91.webp	28
58	2026-03-23 08:52:34.129125	3ac51155-7d55-4a19-b688-2431d06ac1ca_vn-11134207-7r98o-lnwzok0vsgoq4f.webp	29
59	2026-03-23 08:52:36.202439	9de7fba1-9141-4d03-b1bb-c8b05b81916e_vn-11134207-7r98o-lnwzok0w6igd31.webp	29
60	2026-05-12 15:15:49.336505	a21ad326-cd89-435c-8f44-8ed639126077_OIP (1).webp	30
61	2026-05-12 15:15:51.476653	bccc0538-c084-4943-b1e6-078b84a98ace_OIP.webp	30
62	2026-06-07 13:06:43.465685	52e67833-3b71-44e5-989c-14cf2ae703d2_Screenshot_7-6-2026_13631_www.bing.com.jpeg	31
63	2026-06-07 13:06:46.08264	f3caf2cd-17a9-439f-a26d-fca2df8693ee_OIP.webp	31
64	2026-06-07 13:37:48.277203	bd27629c-4d90-43f9-b51c-69801fd53e09_Screenshot_7-6-2026_13631_www.bing.com.jpeg	32
65	2026-06-07 13:37:50.615709	df808758-d170-4d47-bda3-1cca5110f16c_OIP.webp	32
\.


--
-- Data for Name: product_option_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_option_values (id, display_value, sort_order, value, option_id) FROM stdin;
1	Bß║íc	0	Gray	1
2	Xanh ─Éß║¡m	0	Blue	1
3	Hß╗ông	0	Pink	2
4	Xanh	0	Blue	2
5	─Éß╗Å	0	Red	2
6	Xanh	0	Blue	3
7	V├áng Nhß║ít	0	Yellow	3
8	Cocoa Brown	0	Cocoa Brown	4
9	Dark Brown	1	Dark Brown	4
10	Dark Green	3	Dark Green	4
11	Bß╗Ö Vß╗ç Sinh 7in1 Xanh	0	Xanh	5
12	Bß╗Ö Vß╗ç Sinh 7in1 Hß╗ông	0	Hß╗ông	5
13	Bß╗Ö Vß╗ç Sinh 7in1 Ngß║½u Nhi├¬n	0	Ngß║½u Nhi├¬n	5
14	─Éen	0	─Éen	6
15	5.0	0	5.0	7
16	Bß║íc	0	Bß║íc	8
17	─Éen	0	─Éen	8
18	N├óng Cß║Ñp Bß║íc	0	N├óng Cß║Ñp Bß║íc	8
19	N├óng Cß║Ñp ─Éen	0	N├óng Cß║Ñp ─Éen	8
20	CREAM	0	CREAM	9
21	CR-M	0	CR-M	10
22	CR-L	0	CR-L	10
23	CR-XL	0	CR-XL	10
24	CR-XXL	0	CR-XXL	10
25	Xanh Than T├¡m	0	Xanh Than T├¡m	11
26	38	0	38	12
28	40	0	40	12
27	39	0	39	12
29	Navy	0	Navy	13
30	Xanh N╞░ß╗¢c Biß╗ân	0	Xanh N╞░ß╗¢c Biß╗ân	13
31	S	0	S	14
32	M	0	M	14
33	L	0	L	14
34	37	0	37	15
35	38	0	38	15
36	39	0	39	15
37	40	0	40	15
38	8/42	0	8/42	16
40	8.5/42	0	8.5/42	16
41	US 8.5/9.5	0	US 8.5/9.5	17
42	US 8/9	0	US 8/9	17
43	Classic	0	Classic	18
44	Movado Bold Fusion 3600849 Quartz 42mm	0	Movado Bold Fusion 3600849 Quartz 42mm	19
45	Orient Watch Sun And Moon RA-AS000	0	Orient Watch Sun And Moon RA-AS000	20
46	─Éen	0	─Éen	21
47	Trß║»ng	0	Trß║»ng	21
48	V├áng ─Éß╗ông	0	V├áng ─Éß╗ông	21
49	Trß║»ng	0	Trß║»ng	22
50	Xanh L├í	0	Xanh L├í	22
51	─Éen	0	─Éen	22
52	Trß║»ng	0	Trß║»ng	23
53	─Éen	0	─Éen	23
54	V├áng	0	Yello	24
55	Xanh	0	Blue	24
56	32GB	0	32GB	25
57	64GB	0	64GB	25
58	32GB	0	32GB	26
59	64GB	0	64GB	26
\.


--
-- Data for Name: product_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_options (id, display_name, is_required, name, sort_order, product_id) FROM stdin;
1	M├áu	t	M├áu	0	1
2	M├áu	t	M├áu	0	2
3	M├áu	f	M├áu	0	3
4	M├áu Sß║»c	t	M├áu Sß║»c	0	4
5	Ph├ón Loß║íi	t	Ph├ón Loß║íi	0	14
6	Ph├ón Loß║íi	t	Ph├ón Loß║íi	0	15
7	Ph├ón Loß║íi	t	Ph├ón Loß║íi	0	16
8	Ph├ón Loß║íi	t	Ph├ón Loß║íi	0	17
9	M├áu Sß║»c	t	M├áu Sß║»c	0	18
10	K├¡ch Cß╗í	t	K├¡ch Cß╗í	0	18
11	M├áu Sß║»c	t	M├áu Sß║»c	0	19
12	Size	t	Size	0	19
13	M├áu Sß║»c	t	M├áu Sß║»c	0	20
14	Size	t	Size	0	20
15	Size	t	Size	0	21
16	K├¡ch Th╞░ß╗¢c	t	K├¡ch Th╞░ß╗¢c	0	22
17	Size	t	Size	0	23
18	Loß║íi	f	Loß║íi	0	24
19	Loß║íi	t	Loß║íi	0	25
20	Loß║íi	t	Loß║íi	0	26
21	M├áu Sß║»c	t	M├áu Sß║»c	0	27
22	M├áu Sß║»c	t	M├áu Sß║»c	0	28
23	M├áu Sß║»c	t	M├áu Sß║»c	0	29
24	M├áu Sß║»c	t	M├áu Sß║»c	0	30
25	RAM	t	Ram	0	31
26	Dung l╞░ß╗úng	t	Dung L╞░ß╗úng	0	32
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, created_at, hidden, image_url, is_active, price, sku, stock, total_sold, updated_at, product_id) FROM stdin;
2	2026-02-04 20:28:29.358576	f	e3515d24-c330-431b-8cda-cd1a84b0d3cf_bac.webp	t	35690000.00	SKU-1221	10	0	2026-02-04 20:28:29.358576	1
1	2026-02-04 20:28:06.033758	f	f54bc398-0538-422d-9b66-9c71cf571046_xanh.webp	t	35690000.00	SKU-IPHONE17-XANH	12	0	2026-02-04 20:28:43.872979	1
3	2026-02-04 20:54:55.555639	f	926f4b4f-9de4-4992-bde5-78c1bbe1640d_red.webp	t	12790000.00	SKU-12266	45	0	2026-02-04 20:54:55.555639	2
4	2026-02-04 20:55:15.137881	f	79f60760-c38e-48ce-ab46-cdab1904ec10_pink.webp	t	12790000.00	SKU-12268	46	0	2026-02-04 20:55:15.137881	2
5	2026-02-04 20:55:29.053991	f	551613b6-6c81-4a4b-9a88-9d44d6c66332_blue.webp	t	12790000.00	SKU-12288	12	0	2026-02-04 20:55:29.053991	2
6	2026-02-04 20:59:39.091757	f	eb613465-d15e-4074-b509-de7d3f16f7fd_xanh.webp	t	38499000.00	SKU-122699	12	0	2026-02-04 20:59:39.091757	3
7	2026-02-04 20:59:53.861454	f	bc7134d1-b165-46cf-8c2d-678152690c2e_vangnhac.webp	t	38499000.00	SKU-122600	10	0	2026-02-04 20:59:53.861454	3
9	2026-03-10 12:38:20.918711	f	efb93bfa-ea07-4f2b-ad89-99551f53a71c_vn-11134207-7r98o-llirfiupwkw868.jpg	t	185001.00	SKU-DARKBROWN	9	0	2026-03-10 12:38:20.918711	4
10	2026-03-10 12:38:36.409099	f	902a93ab-2d1a-492d-8d89-fb16a0840157_vn-11134207-7r98o-llirfiupxzgo18.jpg	t	185000.00	SKU-DARKGREEN	12	0	2026-03-10 12:38:36.409099	4
31	2026-03-23 08:18:36.395795	f	898e38a0-7b33-41e8-8e7d-9f78f081d67a_vn-11134207-820l4-me33k55t7ev9d8.webp	t	200000.00	SKU-CCS	12	0	2026-03-23 08:18:36.395795	20
32	2026-03-23 08:18:52.710402	f	4588f2f3-77db-4ec0-bb90-3360f5a05ee4_vn-11134207-820l4-me33kbaqvq4hf5.webp	t	120000.00	SKU-CCD	12	0	2026-03-23 08:18:52.710402	20
33	2026-03-23 08:19:16.237168	f	69e3e3ee-e8fe-4030-b5aa-b249a5be7852_vn-11134207-820l4-me33kebv3o5c31.webp	t	300000.00	SKU-CCF	12	0	2026-03-23 08:19:16.237168	20
37	2026-03-23 08:24:27.851921	f	aa6a991e-bda2-412c-98c0-9e9272f91c5f_vn-11134207-820l4-mdzrvjciv0uf23.webp	t	1200000.00	SKU-CCH	12	0	2026-03-23 08:24:27.851921	21
38	2026-03-23 08:24:49.662168	f	a18f9eb4-b175-4419-a05e-9b0e3fbbc74a_vn-11134207-820l4-mdzrvjc2qware9.webp	t	1200000.00	SKU-CCJ	12	0	2026-03-23 08:24:49.662168	21
39	2026-03-23 08:25:05.011912	f	f0d541f7-ca8e-4dff-a08b-0f25ffa7be97_vn-11134207-820l4-mdzrvfursao7de.webp	t	1200000.00	SKU-CCK	12	0	2026-03-23 08:25:05.011912	21
40	2026-03-23 08:25:20.319647	f	f0d541f7-ca8e-4dff-a08b-0f25ffa7be97_vn-11134207-820l4-mdzrvfursao7de.webp	t	1200000.00	SKU-CCL	12	0	2026-03-23 08:25:20.319647	21
41	2026-03-23 08:28:15.332	f	b84732c8-0125-4801-b8fe-9ecb275ce941_vn-11134207-7ras8-m26fph1hejsk28.webp	t	1000000.00	SKU-CCZ	12	0	2026-03-23 08:28:15.332	22
42	2026-03-23 08:29:34.97814	f	d0bf72a7-57c6-452b-a49f-ae6d756a28ff_vn-11134207-7ras8-m26fph1hbqnoa4.webp	t	1000000.00	SKU-CCX	12	0	2026-03-23 08:29:34.97814	22
8	2026-03-10 12:37:51.423853	f	6128b10a-1508-4f84-8042-ff0372f2433d_vn-11134207-7r98o-llirfiupv6bs9c.jpg	t	185000.00	SKU-COCOABROWN	4	0	2026-03-21 09:22:30.434789	4
12	2026-03-23 07:37:46.38027	f	95a9564d-5895-4f1d-9006-894f42b2491d_vn-11134207-7r98o-lv187gjlmbcpe5.webp	t	20000.00	SKU-QWE	12	0	2026-03-23 07:37:46.38027	14
15	2026-03-23 07:54:33.390259	f	ef0d7492-9a97-4b11-992c-656ed6215956_bec1d7ce0af4fbbc5356dee81491a660.webp	t	37000.00	SKU-CCC	12	0	2026-03-23 07:54:35.651072	16
16	2026-03-23 07:58:21.91369	f	0bde67e7-2e4b-48dc-abb8-dafed9671f69_sg-11134201-7rdxh-mdmq0agsn7t629.webp	t	18000.00	SKU-CAC	12	0	2026-03-23 07:58:21.91369	17
17	2026-03-23 07:58:37.043326	f	0712e71a-9ece-422c-ab15-2ca6008c0e4d_sg-11134201-7rdvs-mdmq0b9dfz9x04.webp	t	20000.00	SKU-CCG	12	0	2026-03-23 07:58:37.043326	17
18	2026-03-23 07:58:54.935224	f	0e9a3c07-db12-474d-a073-6088494cb1b0_sg-11134201-7rdvq-mdmq0ap49mc522.webp	t	50000.00	SKU-CCQ	12	0	2026-03-23 07:58:54.935224	17
19	2026-03-23 07:59:12.688179	f	b09b9697-975a-42b1-a5f5-fff7dad8455e_sg-11134201-7rdyq-mdmq0aznu6qsdb.webp	t	50000.00	SKU-CCN	12	0	2026-03-23 07:59:12.688179	17
21	2026-03-23 08:07:00.333385	f	38da3edd-d179-41e7-97b4-1af903d7f8e7_vn-11134207-820l4-mifexpbe4q9tac.webp	t	120000.00	SKU-CCE	12	0	2026-03-23 08:07:00.333385	18
23	2026-03-23 08:07:25.021526	f	499cb139-25a1-4096-91a1-1eb1bfedea37_vn-11134207-820l4-mifexpbv9dkwc4.webp	t	120000.00	SKU-CCR	12	0	2026-03-23 08:07:25.021526	18
25	2026-03-23 08:08:05.894207	f	59d759d5-6548-43f0-af0c-06e78dc196dd_vn-11134207-820l4-mifexpk5mubo9d.webp	t	100000.00	SKU-CCT	12	0	2026-03-23 08:08:05.894207	18
26	2026-03-23 08:12:41.041512	f	a5f8756d-82a0-4921-8592-f28ca2eeaa4a_vn-11134207-81ztc-mkjble9m38jmdd.webp	t	500000.00	SKU-CCY	12	0	2026-03-23 08:12:41.041512	19
27	2026-03-23 08:12:57.135832	f	dbec7bc6-88c5-4a05-8fe3-c22f4aee3bc3_vn-11134207-81ztc-mkjble9lqlfq26.webp	t	450000.00	SKU-CCU	12	0	2026-03-23 08:12:57.135832	19
28	2026-03-23 08:13:21.943114	f	11834809-b194-455c-9cfd-7e088c02c2d2_vn-11134207-81ztc-mkjble9o02dg27.webp	t	560000.00	SKU-CCI	12	0	2026-03-23 08:13:21.943114	19
29	2026-03-23 08:17:29.565855	f	20baf529-38a5-4e06-98be-88342e794389_vn-11134207-820l4-mgy1tctapgy3ed.webp	t	200000.00	SKU-CCO	12	0	2026-03-23 08:17:52.293608	20
30	2026-03-23 08:18:15.369051	f	1c7e4acc-bf8a-4175-a856-056c0f74e9f8_vn-11134207-820l4-mgy1tctc2mtl6f.webp	t	400000.00	SKU-CCP	12	0	2026-03-23 08:18:15.369051	20
45	2026-03-23 08:32:45.744698	f	aea02574-6fd6-4c2f-915a-4fcfde8ebac1_vn-11134275-820l4-mipe3b2zy39fee.webp	t	100000.00	SKU-CCB	12	0	2026-03-23 08:32:51.61567	23
47	2026-03-23 08:38:15.532354	f	4e5e7e91-2a8b-407d-839d-79575fdc260d_vn-11134207-7ras8-mc1tq9sufnfu05.webp	t	4320000.00	SKU-CCM	12	0	2026-03-23 08:38:15.532354	24
48	2026-03-23 08:40:02.656349	f	cf75338b-d36e-458a-a110-3d2e7d8b0a73_vn-11134207-7ras8-mav3u8y1zy695c.webp	t	4000000.00	SKU-CQW	12	0	2026-03-23 08:40:02.656349	25
49	2026-03-23 08:42:29.928167	f	22849528-8688-4564-b92f-8730b7376e1d_sg-11134201-23020-s9zoap6m75mve8.webp	t	3000000.00	SKU-CQE	12	0	2026-03-23 08:42:45.977177	26
50	2026-03-23 08:47:19.762158	f	af18e6e4-4eea-4a39-a79e-559ddb3f4465_64dd5865719e855ca0b9ad5bc5a49f27.webp	t	200000.00	SKU-CQR	12	0	2026-03-23 08:47:19.762158	27
51	2026-03-23 08:47:35.730953	f	5aff605c-68c0-496b-ad80-a305c9acc2a4_ffc9a412d20c346635a1508e465b6793.webp	t	200000.00	SKU-CQT	12	0	2026-03-23 08:47:35.730953	27
52	2026-03-23 08:47:50.045328	f	e45ef537-d8bf-4929-9e88-e799ffff6971_vn-11134207-820l4-mflbwjdsp5hlb4.webp	t	200000.00	SKU-CQY	12	0	2026-03-23 08:47:50.045328	27
54	2026-03-23 08:50:13.872022	f	247f406e-d6e6-42dc-8b9e-6a6c35c8a23e_2214638681d61ae8da9da68833998fca.webp	t	1000000.00	SKU-CQU	12	0	2026-03-23 08:50:13.872022	28
55	2026-03-23 08:50:30.162639	f	4adf5055-d950-4512-8364-4bfeab3646c6_54b1d64726937c3f85d8a7f8d2ebe14a.webp	t	1000000.00	SKU-CQI	12	0	2026-03-23 08:50:30.162639	28
56	2026-03-23 08:50:48.804045	f	7e1ca05a-1466-42bf-b83a-03ea829ef196_d37bcce509deea69faa454495ce01b91.webp	t	1000000.00	SKU-CQO	12	0	2026-03-23 08:50:48.804045	28
14	2026-03-23 07:50:35.74206	f	e558c530-6f07-4c79-8f05-5cd380447b7e_c06b51be293d745091d27f471c36ebbc.webp	t	11000.00	SKU-VBN	125	0	2026-06-07 10:00:52.598461	15
11	2026-03-23 07:37:26.982489	f	98fdd789-3591-451a-b5aa-8a0a4c61a1ff_vn-11134207-7r98o-lv187gjlkws9b3.webp	t	22222.00	sku-ASDAS	116	0	2026-06-07 12:42:35.641093	14
20	2026-03-23 08:06:42.336678	f	66edd73d-36f4-4944-9e18-cf7f0f879b23_vn-11134207-820l4-mifexpba18n7cd.webp	t	100000.00	SKU-CCW	7	0	2026-05-12 14:17:21.493827	18
13	2026-03-23 07:38:04.81348	f	4b1c7fa3-7423-4932-98a8-8bc0e171e1c5_vn-11134207-7r98o-lv187gjlqj2185.webp	t	12000.00	SKU-GHJ	19	0	2026-06-07 13:35:22.140014	14
59	2026-03-23 08:53:38.228566	f	3ac51155-7d55-4a19-b688-2431d06ac1ca_vn-11134207-7r98o-lnwzok0vsgoq4f.webp	t	2000000.00	SKU-CQP	12	0	2026-03-23 08:53:38.229093	29
44	2026-03-23 08:32:30.22294	f	c0024f8e-bdc3-4797-b472-f2a450411e5d_vn-11134275-820l4-mipe3b9jyy2v73.webp	t	100000.00	SKU-CCV	10	0	2026-03-31 17:54:43.963341	23
60	2026-03-23 08:53:51.203319	f	9de7fba1-9141-4d03-b1bb-c8b05b81916e_vn-11134207-7r98o-lnwzok0w6igd31.webp	t	2000000.00	SKU-CQA	6	0	2026-04-19 19:37:23.799314	29
61	2026-05-12 15:22:53.219216	f	a21ad326-cd89-435c-8f44-8ed639126077_OIP (1).webp	t	1200000.00	SKU-CCMM	12	0	2026-05-12 15:22:53.219216	30
62	2026-06-07 13:07:11.395008	f	f3caf2cd-17a9-439f-a26d-fca2df8693ee_OIP.webp	t	10000000.00	SKU-CCVG	12	0	2026-06-07 13:07:11.395008	31
63	2026-06-07 13:07:26.421353	f	52e67833-3b71-44e5-989c-14cf2ae703d2_Screenshot_7-6-2026_13631_www.bing.com.jpeg	t	10000000.00	SKU-CCOccc	11	0	2026-06-07 13:07:26.421353	31
64	2026-06-07 13:38:09.472682	f	bd27629c-4d90-43f9-b51c-69801fd53e09_Screenshot_7-6-2026_13631_www.bing.com.jpeg	t	10000000.00	SKU-CCOasdasdasd	12	0	2026-06-07 13:38:09.472682	32
65	2026-06-07 13:38:22.62858	f	df808758-d170-4d47-bda3-1cca5110f16c_OIP.webp	t	1111111111.00	SKU-IPHONE17-XANH222222	11	0	2026-06-07 13:38:22.62858	32
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, average_rating, created_at, deleted, description, max_price, metadata, min_price, name, slug, specifications, status, total_reviews, total_sold, updated_at, user_id, category_id, embedding) FROM stdin;
3	0	2026-02-04 20:57:53.132269	f	\N	38499000.00	{"asd": "asd"}	38499000.00	─Éiß╗çn thoß║íi Apple iPhone Air 512GB	dien-thoai-apple-iphone-air-512gb	{"Gß╗¡i tß╗½": "Bß║»c Ninh", "Th╞░╞íng hiß╗çu": "Apple", "Hß║ín bß║úo h├ánh": "12 Th├íng"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	1	1	[0.003282405,0.015660176,0.007985552,-0.04888619,0.03313274,-0.0050912406,-0.01088426,-0.01892308,-0.009874032,0.044953894,-0.008823233,-0.023063892,0.0645858,0.0038685326,0.008627887,-0.045124948,0.015768236,0.003387884,-0.08159569,0.005864226,0.0059252055,0.03151182,0.021674,0.03744137,-0.04169047,-0.006234313,-0.0027613014,0.06499535,0.027072078,-0.049958084,-0.0115198055,0.07787655,-0.055647,-0.010238165,0.003292176,0.0328444,-0.0098800305,0.019718332,0.03860818,-0.07198341,-0.05799091,0.03867278,0.012887052,0.014122636,0.020117424,-0.03332533,-0.018981675,0.045440245,-0.075261936,0.02336643,0.03796827,0.011493421,-0.04986018,-0.03191869,-0.052154083,-0.009051883,-0.011429146,-0.041344948,0.03510796,-0.03490721,0.027787974,-0.0028062954,-0.030758997,-0.009916836,0.025479458,-0.0074365125,0.029453663,0.0014983533,-0.03721252,0.03644132,0.0108789755,-0.06787677,0.0055540595,0.033263583,0.05031501,-0.038426984,-0.026455501,-0.01114337,0.024018977,0.05085546,-0.036663417,-0.026166733,0.118431136,0.040934067,0.033539876,0.00020347611,0.031388044,-0.0697029,-0.08049242,-0.021032093,0.06538183,-0.015922982,0.050398815,0.030028727,0.1000282,-0.004281197,-0.1052903,-0.0964741,0.090182334,0.00798519,0.01594832,0.0055870297,0.018228129,-0.102579884,0.043791287,-0.015099736,-0.034434613,-0.0071707023,-0.015999226,0.037673086,-0.033679638,-0.098963626,0.05354014,0.0013228725,-0.025303347,-0.004182644,0.018965015,0.022392761,-0.04661092,0.012614581,0.009233538,0.0042733317,-0.017286865,0.024432767,-0.011328984,0.03685212,0.012578359,-0.0075048315,-0.011428799,-0.014322288,0.022975488,-0.056388613,-0.027241798,0.01669234,-0.025353491,-0.020099673,0.07268291,0.0031928262,0.016059957,0.020005181,0.010236549,-0.016773522,-0.026412968,0.0011174765,-0.013206838,0.005401735,-0.006630894,0.006353761,-0.055675995,0.041794747,-0.040788434,-0.031631604,0.032057952,-0.0072106253,-0.0046463073,-0.026033517,-0.0077791996,-0.032909777,0.04703631,0.027578844,-0.006214947,-0.011026336,0.08291674,0.004293659,-0.069127046,0.051877026,-0.01098332,-0.061684337,0.016447622,0.038115546,0.0089330105,-0.0513796,0.016934147,-0.11516527,0.00088994903,-0.039609045,-0.040324897,0.0031620904,-0.0039307545,0.037217055,0.07520249,-0.03660317,0.015282915,-0.02621038,0.039144088,-0.03285366,0.0042305505,-0.031914607,0.034818515,0.050734963,0.04562329,-0.012388446,0.012531004,0.02938959,0.002135227,-0.04358128,0.024656171,-0.020075958,0.08770287,-0.0640176,0.013977966,0.0018213363,0.0014239894,-0.058672648,-0.0183646,0.023194522,-0.06916785,-0.0130415065,-0.012698221,0.0153006865,0.015513798,0.019719325,0.0017800708,-0.062411018,-0.010688228,0.020956038,0.07681966,0.025742546,-0.025885686,-0.03747149,0.045872174,0.00020896964,0.052261364,0.047368612,0.022699077,0.004129595,-0.04406872,0.011239116,0.020955188,-0.033166166,0.006223483,0.01052029,-0.041629855,0.027579635,-0.010914875,0.030862834,0.02362352,-0.0033289855,-0.0150869135,0.02788754,0.062673345,0.051755827,0.065698974,0.028657258,0.009290726,0.019677274,0.086107716,0.025538977,-0.020062156,-0.039884984,-0.040033348,-0.050824698,0.04512005,0.0014667641,-0.07083681,-0.006715646,0.0038248524,0.0008789044,0.0057474812,-0.007243594,0.00026065108,0.0074844337,-0.028726777,-0.08228542,-0.02098075,-0.09460961,-0.03505646,-0.007214612,0.033973802,-0.001632798,0.035471197,-0.06640453,-0.024021445,-0.025051236,-0.014807086,0.023187129,-0.05885843,0.0060262694,-0.029009202,-0.045549117,0.06193818,0.02772556,-0.023265436,-0.007733395,0.030241426,-0.05571267,-0.003723706,-0.017838422,-0.0061358036,-0.039801024,0.01501303,0.036450237,0.030808913,-0.017178336,0.04272148,0.025614405,-0.0017701533,0.028742328,-0.024100754,0.0027267342,-0.014384623,0.06272216,-0.007418324,-0.0057231938,0.005036057,-0.015675083,-0.027116768,0.021398613,-0.02395362,-0.009633968,0.006011989,0.06566888,-0.029315738,-0.049495853,0.006620312,-0.024224084,-0.16859995,0.0028404575,0.015955307,-0.018994503,0.05909392,0.04753574,0.0005211335,-0.024160441,0.021367665,-0.0071991724,-0.0032786995,-0.02761881,-0.0011793782,-0.04272108,0.026293809,-0.0056885025,-0.025717989,-0.037130263,-0.014669325,0.052459616,-0.071148984,0.034204204,0.04568105,-0.0009831669,0.057639528,0.061294395,-0.029647904,0.07568127,-0.057710133,-0.05757462,0.024094272,0.05111642,0.038231995,0.04517654,0.02771223,0.039296694,0.01416406,-0.027676782,0.011713296,0.0016542814,0.02975348,0.021098932,0.041360117,-0.06642453,-0.010024497,0.04001736,0.015846707,0.01180426,-0.02620886,-0.021130338,0.06005445,0.056822676,-0.028837793,-0.06319431,-0.029880686,0.022448644,-0.0017696157,0.040918436,-0.003953278,7.560794e-05,0.05022908,0.030552063,0.010520398,0.02658996,-0.013711694,-0.046986405,-0.023658361,-0.0071082516,-0.008031932,0.062171727,-0.06652151,-0.04199014,-0.007827565,0.056238532,-0.022018887,0.0075064683,0.03332609,0.018725758,-0.061718553,0.073024444,-0.0121239405,0.033093743,0.00052486564,0.031693026,0.022024598,0.008648325,0.08538669,-0.0699987,-0.009976921,-0.003436107,0.0075563784,-0.028138168,-0.0027844538,-0.015164944,-0.014937676,-0.012524244,-0.0085936375,0.010541405,-0.0585195,-0.03473793,0.050307214,0.023705631,0.018595167,-0.021636933,-0.0014701447,0.08315656,0.016887497,0.041461606,-0.010056975,-0.025719943,0.01540338,-0.022390854,-0.058964465,0.009964455,0.026193766,0.053502813,-0.05350582,0.040012438,-0.03785605,-0.00059459434,0.065876365,0.0114121875,0.01154781,0.035136744,-0.014296789,-0.013477488,0.040689632,0.023134576,-0.040806312,0.073734865,0.046324633,-0.01650841,-0.067002535,0.016104903,0.05917885,-0.008488726,0.046740834,-0.014148271,-0.022371836,-0.0014341831,0.030656258,0.009002131,0.009836413,0.010996196,0.005803687,-0.059674475,0.04650611,0.022767575,-0.020161996,-0.063951544,-0.028575938,-0.02169535,-0.031169437,0.04085926,0.032482076,-0.013957698,-0.0018365523,0.016347103,0.005672652,0.01830161,-0.01856336,0.014484674,-0.096262105,0.01022627,-0.02088025,0.0036753928,0.00049631,0.04076266,0.08458259,-0.012297505,-0.003697776,-0.012176325,0.008504339,0.05137086,0.029678203,0.032914653,0.00976712,-0.053969197,0.020450983,0.039450057,0.01739892,-0.002631177,-0.032124523,0.0512659,0.07194469,0.029136674,0.006841986,-0.02471016,0.031363543,0.060687568,-0.03075679,-0.019594554,0.021561624,0.015869021,0.03114307,-0.018674249,0.045259405,-0.010571942,-0.0153943505,0.038692776,-0.07067868,0.020423234,-0.0035355093,-0.00043084205,0.0379597,-0.031745598,-0.011231719,-0.016464148,0.016052516,-0.00032042438,-0.006571529,0.020809373,0.017663287,-0.027769152,-0.008625937,0.03491945,0.020659037,0.04939203,0.02537511,0.044788204,0.052579455,-0.00885229,-0.0039771753,0.004236219,0.080170535,-0.014565522,-0.011631635,0.00039311807,0.03165557,-0.029411389,-0.0048325667,0.026177805,-0.025573676,0.055378016,0.003340669,-0.028864548,-0.015220872,0.00072851294,0.025916584,-0.00317463,0.005554338,-0.03221994,-0.07255398,-0.017844267,0.0061749993,0.01966001,-0.033900116,-0.0046062157,-0.0035301107,0.004397504,-0.0058446922,0.06951434,-0.0025870414,0.02125326,0.055004235,0.067722075,0.00046520325,-0.03769429,0.0142946895,-0.027185915,-0.0151272,0.034528747,0.053418893,-0.011074026,-0.02525059,0.022422634,0.050090287,-0.039475933,0.019634625,-0.006831761,-0.030312577,-0.010952946,0.006509258,0.014257957,0.03489728,-0.0140176,-0.026085915,-0.049318057,-0.01098094,-0.011474636,0.01534468,0.033301212,-0.00019349893,0.016204882,-0.006856671,0.035757788,0.028667519,0.02227002,0.014623814,-0.04399842,-0.016097829,-0.056935612,0.058320466,-0.058424506,0.0002300765,0.012491868,-0.01610495,-0.023631664,-0.03289117,-0.0130383335,-0.024095431,0.018938243,0.027300155,0.030137789,0.019613182,-0.00436674,0.062065344,0.0011679616,-0.035160154,0.022924071,-0.022458378,-0.0053416416,0.01010297,0.021032244,0.042364784,0.03528502,-0.005472459,-0.046511598,0.018974053,0.06117404,0.0039013948,0.01719696,0.058068242,-0.067705154,-0.02686137,-0.00058065983,0.06156397,-0.03051991,-0.007654268,0.004637067,0.0057781227,0.049139254,0.05887678,0.032897245,-0.014832709,0.027952002,-0.04529184,-0.0210374,-0.017794408,0.020587757,-0.06032095,0.020282462,-0.011787677,0.006904533,-0.01129336,-0.05343341,-0.028216772,0.030219214,-0.02505206,0.0046507367,0.012950799,-0.0013642766,0.023480047,-0.043708414,-0.003801413,-0.016397327,-0.010827329,0.022424256,-0.062617436,0.056531128,0.0015850123,-0.013471391,0.008041133,-0.01359247,0.014207396,-0.011754019,-0.00603512,-0.029264223,-0.0008667389,-0.012823318,0.0057005994,-0.009115193,-0.019779436,0.016770469,-0.00017453708,-0.0017585148,-0.005095731,0.053787347,-0.0039539724,0.05113424,-0.026207158,0.026678635,-0.046873186,0.004547343,-0.026450403,-0.010022386,-0.026606113,-0.047634438,0.012719406,-0.0042697447,0.002475821,-0.016188683,-0.044550877,0.025413545,0.012419448,0.043053877,0.07544727,0.03245894,-0.012357894,-0.011684124,0.046184372,-0.04094454,-0.057536922,0.072451994,-0.021080775,-0.02536526,0.024341388,0.0580239,0.033739712,0.0007483216,-0.07382504,-0.0086598415,0.012757117,0.06143996,0.09875795,-0.024907313,-0.011815895,-0.0015377809,-0.024588572,-0.040733084,-0.0006317668,-0.02342354,-0.03983621,-0.0039213616,0.032991033,-0.0042278576,-0.04131701,0.018351004,-0.022979725,0.030833706,-0.0013856359,0.024322515,0.007985156,0.016393295,-0.046971478,0.043856896,-0.0014117521,0.013238106,-0.006645095,-0.02635333,0.022231141,-1.9208453e-06,-0.048573893,0.04915873,-0.040116668,0.077996306,0.024547301,0.015923522,-0.0315619,-0.052002452,0.02519819,-0.04590708]
4	0	2026-03-10 12:33:21.66214	f	<p>Γ£ö∩╕ÅCHI TIß║╛T Vß╗Ç Bß╗ÿT NHUß╗ÿM QUß║ªN ├üO RIT DYE ALL PURPOSE POWDER 31.9g</p><p>Γ£ö∩╕Å T├èN Sß║óN PHß║¿M: Bß╗Öt nhuß╗Öm quß║ºn ├ío Rit Dye All Purpose Powder 31.9g</p><p>Γ£ö∩╕Å KHß╗ÉI L╞»ß╗óNG: 31.9g</p><p>Γ£ö∩╕Å TH╞»╞áNG HIß╗åU: RIT</p><p>Γ£ö∩╕Å XUß║ñT Xß╗¿: Mß╗╕ (USA)</p><p>ΓÅ⌐ C├öNG Dß╗ñNG CH├ìNH:</p><p>- Rit All-Purpose Dye Powder l├á bß╗Öt nhuß╗Öm ─æa n─âng, ph├╣ hß╗úp ─æß╗â nhuß╗Öm c├íc loß║íi vß║¡t liß╗çu tß╗½ len, lß╗Ña, cotton ─æß║┐n nylon v├á - rayon.</p><p>- Mß╗ùi hß╗Öp chß╗⌐a 31.9 g (1 1/8 Oz) c├│ khß║ú n─âng nhuß╗Öm tß╗æi ─æa 0.5 kg vß║úi kh├┤.</p><p>- Bß╗Öt nhuß╗Öm n├áy c├│ thß╗â sß╗¡ dß╗Ñng vß╗¢i m├íy giß║╖t hoß║╖c thau.</p><p>- Ng╞░ß╗¥i d├╣ng c├│ thß╗â trß╗Ön c├íc m├áu sß║»c cß╗ºa Rit All-Purpose Dye vß╗¢i nhau ─æß╗â tß║ío ra v├┤ sß╗æ m├áu sß║»c kh├íc, thß╗â hiß╗çn phong c├ích c├í nh├ón v├á sß╗ƒ th├¡ch.</p><p>- Rit All-Purpose Dye Powder l├á c├ích dß╗à d├áng ─æß╗â l├ám mß╗¢i c├íc m├│n ─æß╗ô c┼⌐, tß╗½ quß║ºn ├ío, ─æß║┐n trang tr├¡ nh├á cß╗¡a, thß║úm trß║úi s├án v├á nhiß╗üu h╞ín nß╗»a.</p><p><br></p><p>ΓÅ⌐ Nhuß╗Öm bß║▒ng thau:</p><p>- Giß║╖t sß║ích vß║┐t bß║⌐n tr├¬n vß║úi nh╞░ng kh├┤ng sß╗¡ dß╗Ñng n╞░ß╗¢c xß║ú. ─Éiß╗üu n├áy gi├║p m├áu nhuß╗Öm thß║Ñm ─æß╗üu h╞ín.</p><p>- Dß╗▒a v├áo trß╗ìng l╞░ß╗úng vß║úi ─æß╗â ─æiß╗üu chß╗ënh l╞░ß╗úng n╞░ß╗¢c. Vß╗¢i 0.5 kg vß║úi, bß║ín sß╗¡ dß╗Ñng 11,5 l├¡t n╞░ß╗¢c ß║Ñm 60 ─æß╗Ö C. N├¬n d├╣ng thau nhß╗▒a hoß║╖c th├⌐p kh├┤ng gß╗ë, ─æß╗º rß╗Öng ─æß╗â vß║úi c├│ thß╗â xoay ─æß╗üu.</p><p>- Th├¬m 250g muß╗æi ─æß╗â t─âng m├áu sß║»c cho vß║úi tß╗▒ nhi├¬n nh╞░ cotton, lß╗Ña...</p><p>- Th├¬m 5ml n╞░ß╗¢c rß╗¡a ch├⌐n ─æß╗â th├║c ─æß║⌐y qu├í tr├¼nh nhuß╗Öm m├áu.</p><p>- Cho bß╗Öt nhuß╗Öm nhuß╗Öm rß╗ôi cho v├áo thau. Khuß║Ñy ─æß╗üu, sau ─æ├│ l├ám ╞░ß╗¢t vß║úi, vß║»t r├ío v├á cho v├áo hß╗ùn hß╗úp nhuß╗Öm.</p><p>- Cho vß║úi test c├╣ng loß║íi vß╗¢i vß║úi cß║ºn nhuß╗Öm v├áo thau, nß║┐u m├áu ─æß║¡m th├¼ cho th├¬m n╞░ß╗¢c, m├áu nhß║ít th├¼ cho th├¬m bß╗Öt m├áu. Khi tr├¬n vß║úi test ╞░ng ├╜ mß╗¢i tiß║┐n h├ánh nhuß╗Öm to├án bß╗Ö vß║úi.</p><p>- Khuß║Ñy li├¬n tß╗Ñc trong 10 ph├║t, sau ─æ├│ ng├óm vß║úi trong khoß║úng 10-30 ph├║t. Thß╗¥i gian ng├óm t├╣y thuß╗Öc v├áo loß║íi vß║úi v├á mß╗⌐c ─æß╗Ö thß║Ñm h├║t m├áu.</p><p>- Khi ─æß║ít ─æ╞░ß╗úc m├áu mong muß╗æn, lß║Ñy vß║úi ra khß╗Åi thau. L╞░u ├╜ rß║▒ng m├áu sß║╜ ─æß║¡m h╞ín khi vß║úi ╞░ß╗¢t v├á nhß║ít ─æi khi vß║úi kh├┤.</p><p>Xß║ú vß║úi bß║▒ng n╞░ß╗¢c lß║ính cho ─æß║┐n khi n╞░ß╗¢c trß╗ƒ n├¬n trong. Rß╗¡a lß║íi vß╗¢i n╞░ß╗¢c ß║Ñm v├á x├á ph├▓ng lo├úng, sau ─æ├│ ph╞íi kh├┤.</p><p>- Sß╗¡ dß╗Ñng th├¬m Color Stay ─æß╗â m├áu ─æ╞░ß╗úc bß╗ün h╞ín.</p><p><br></p><p>∩╕ÅΓÅ⌐ V├ái mß║╣o v├á l╞░u ├╜:</p><p>- Kiß╗âm tra m├áu bß║▒ng c├ích nh├║ng kh─ân giß║Ñy v├áo hß╗ùn hß╗úp nhuß╗Öm. Nß║┐u m├áu nhß║ít, th├¬m bß╗Öt nhuß╗Öm; nß║┐u m├áu ─æß║¡m, th├¬m n╞░ß╗¢c.</p><p>- Sß╗¡ dß╗Ñng Rit ColorStay Dye Fixative ─æß╗â giß╗» m├áu sß║»c bß╗ün l├óu sau khi nhuß╗Öm v├á tr╞░ß╗¢c khi giß║╖t.</p><p>- Tr├ính m├áu v─âng ra bß║▒ng c├ích phß╗º tß║Ñm trß║úi v├á ─æeo g─âng tay trong qu├í tr├¼nh nhuß╗Öm.</p><p>- Nß║┐u vß║úi chß╗⌐a 35% polyester trß╗ƒ l├¬n, nhß╗▒a hoß║╖c acetate, h├úy sß╗¡ dß╗Ñng Rit Dyemore.</p><p><br></p><p>L╞»U ├¥: - Lu├┤n kiß╗âm tra th├ánh phß║ºn cß╗ºa vß║úi tr├¬n Tag cß╗ºa sß║ún ph├óm tr╞░ß╗¢c khi sß╗¡ dß╗Ñng bß║Ñt cß╗⌐ sß║ún phß║⌐m n├áo cß╗ºa RIt. Nhß║»n tin vß╗¢i shop ─æß╗â shop t╞░ vß║Ñn cho tiß║┐t vß╗ü c├íc sß║ún phß║⌐m cß╗ºa Rit nh├⌐!</p>	185001.00	{}	185000.00	Bß╗Öt nhuß╗Öm quß║ºn ├ío Rit Dye All Purpose Powder 31.9g	bot-nhuom-quan-ao-rit-dye-all-purpose-powder-319g	{"Gß╗¡i tß╗½": "TP. Hß╗ô Ch├¡ Minh", "Th╞░╞íng hiß╗çu": " Rit", "T├¬n tß╗ò chß╗⌐c chß╗ïu tr├ích nhiß╗çm sß║ún xuß║Ñt": "─Éang cß║¡p nhß║¡t", "─Éß╗ïa chß╗ë tß╗ò chß╗⌐c chß╗ïu tr├ích nhiß╗çm sß║ún xuß║Ñt": "─Éang cß║¡p nhß║¡t"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	101	2	[-0.022205982,0.022314938,0.022229496,-0.08364523,0.029930662,0.004218071,-0.010418506,-0.0011356669,0.021290792,-0.00066306116,-0.023329759,0.046507947,0.049207088,0.018129693,-0.035420544,-0.05886499,-0.01350588,0.0120483935,-0.07527972,-0.017841995,0.07479081,-0.02149841,0.045491476,0.029926106,-0.057104982,0.03332181,0.03285091,0.028095527,-0.06088464,-0.10987132,0.040765382,0.055909894,0.017850759,-0.023430584,-0.0008207575,0.05639759,-0.019609055,0.012248199,-0.009283466,-0.023499643,-0.049507655,0.05800856,-0.017195152,0.011764635,0.0045166994,-0.021022161,0.0061259004,0.052741554,-0.05916932,-0.01430905,0.033519242,0.02079287,-0.07242172,0.02343077,-0.05271432,-0.0138068935,-0.049800698,-0.021489583,-0.0007247867,-0.009376979,0.018909989,-0.004657247,-0.047862355,-0.014127808,-0.011445765,-0.04115618,0.012849628,0.07356812,-0.01535936,0.022928145,0.0010671844,-0.02027182,-0.034830272,0.0036464264,0.04830539,0.040658183,-0.02371118,0.01992741,0.014811294,0.00019187924,-0.032204855,0.08305474,0.07541855,0.09589277,0.04087942,-0.0061851377,0.017047813,-0.02561208,-0.022214523,-0.0124575505,0.020836828,0.010366015,0.0011356041,-0.026274346,0.02843623,-0.016782604,-0.099920444,-0.09062149,0.0006374141,0.03725281,0.04859716,0.023337469,0.015551226,-0.07882487,0.052588228,0.007793169,-0.012284238,-0.019516703,-0.056579906,-0.009963049,-0.030742873,-0.036024503,0.0455739,-0.012816117,0.0036518117,0.052680638,-0.001989543,0.023614598,-0.077819906,-0.019872954,0.013691742,-0.0018748919,-0.03863417,0.037978217,0.009353938,0.02439312,0.041328162,0.03278592,-0.03162974,-0.04365991,0.010634795,-0.08952038,-0.037973117,0.055799548,0.029784359,-0.023332778,0.03386991,-0.046409838,0.0138086425,0.031896003,0.016515352,-0.049529307,-0.03670833,0.021064667,0.0364689,0.001555985,-0.0041945046,-0.024912102,-0.063790135,-0.009240786,0.007245531,-0.012891747,0.03990184,-0.0052121286,0.028607532,0.018599767,-0.0074864943,-0.05568295,0.057260506,0.012877141,0.011368521,-0.038467854,0.025115043,-0.011695962,-0.051476948,-0.005132542,0.008875677,-0.05599135,0.046046734,0.02954633,0.011984803,-0.094868325,-0.032029245,-0.1430232,0.040333573,-0.034379784,-0.040142845,-0.045945924,-0.026520822,0.059451494,0.073846474,0.008870352,-0.05797478,-0.040277787,0.039004095,-0.0487149,0.019475073,-0.011249592,0.091156244,-0.02101754,0.005749834,-0.026124027,-0.035736274,0.0043621147,0.042080108,-0.012618946,0.062751904,-0.018534565,0.033129267,-0.050508678,0.021796307,-0.005372297,-0.03291945,-0.079785354,0.022064582,0.01871405,-0.026211387,-0.017161846,-0.014206004,0.0068779667,0.015557357,-0.024313943,-0.0030745496,-0.034477003,-0.028444681,-0.026699193,0.07482175,-0.0028529852,-0.048841257,-0.011854176,0.037584223,0.0018578444,0.055980988,-0.010903149,0.056467872,0.05216979,-0.03737822,-0.040823247,-0.012462931,-0.08417476,0.029264538,0.016876496,0.017914165,-0.002669611,-0.0319531,0.0881911,0.03655611,-0.06425811,0.06920487,0.031732205,0.0595869,0.039824132,0.040006507,0.016873512,-0.011783421,-0.045086857,0.060853153,0.0020148735,0.040808752,-0.029715082,-0.0057913633,0.015612406,0.06194893,-0.001815243,-0.003387179,-0.025406301,0.013543034,0.045013256,-0.056090016,-0.008202086,0.036897913,-0.034571156,-0.016658984,-0.09134635,-0.035001606,-0.07181282,-0.02798643,-0.0416356,0.013324698,-0.053972114,-0.0010749358,-0.028179815,-0.035985984,0.029884107,-0.015299771,0.014742369,-0.023846254,-0.04416042,-0.04104245,-0.04563931,-0.0010374123,0.0010510935,-0.008540516,0.01224915,0.063256346,-0.023730917,-0.01770969,0.0008599628,-0.017164355,0.00017624552,0.009672048,0.029323205,0.044034805,-0.034603782,0.025904031,0.016029384,-0.01918775,-0.024736397,-0.02494238,0.03197166,-0.0032560292,0.029937927,-0.005450237,0.019733796,-0.04251575,-0.005094285,0.020832596,-0.0107049635,-0.013109411,-0.0012239447,0.075617135,0.040734414,-0.060603708,-0.019710591,-0.014884979,-0.0019192122,-0.17158091,-0.0034032995,0.032302756,-0.011876737,0.023211524,-0.009114496,-0.017927194,0.0082408795,0.005736855,0.009134126,0.016357258,-0.016259437,0.023390925,-0.002146286,0.033141606,-0.016691012,-0.04093801,-0.04850315,0.017788198,-0.014075875,-0.07376969,0.017830342,0.04624898,0.05557171,0.022480423,0.031154502,-0.0012772995,0.050187856,-0.022507485,-0.0613127,0.056553926,0.019323781,-0.023811376,-0.05259288,0.028355695,0.047194906,-0.01730871,0.012856691,-0.0017004422,-0.030720118,0.02701497,0.008615116,-0.016406674,-0.0399569,0.0025073546,-0.013513517,0.0032328393,0.014359437,0.026029361,-0.035732653,0.007355144,0.05390413,-0.020133872,-0.06025642,0.019474177,0.014224292,-0.041381747,0.012029262,0.044845305,0.013451175,0.0060164225,0.020710604,0.0067208116,-0.01453574,0.024150215,0.024307815,-0.007732655,-0.016020158,-0.046981353,0.045198724,-0.052487988,-0.013120595,0.0046521444,-0.01104602,-0.0013692997,-0.017864259,0.034775876,9.5062365e-05,-0.035028115,0.053684503,-0.017067404,0.038770225,0.020948716,0.052803338,0.018988488,-0.05615718,0.075256065,-0.02362338,0.06319163,-0.00031286795,0.05213858,0.022561569,0.02429262,0.013258068,-0.029518832,-0.022674412,-0.03277229,0.06439394,-0.013248863,-0.046299957,-0.017612645,-0.03328675,-0.021537967,0.06343334,0.014574874,0.051967036,0.03533104,0.0331878,-0.014553828,0.008338536,-0.024822438,0.022108175,-0.008908483,0.020979078,-0.00044896142,0.04303033,-0.030862132,-0.004429699,0.040262435,-0.04270583,0.009283826,0.010885437,-0.053070102,0.0049579926,-0.0039233114,-0.019383587,0.08118398,0.018278707,-0.057742037,0.06823575,0.056536656,0.021682829,-0.04517761,-0.03929211,0.02286082,-0.0075847902,-0.033152442,-0.025569119,-0.03345363,-0.014308463,0.03071211,0.05254279,-0.02056791,0.016474174,-0.031762704,-0.0026497452,0.07371388,0.008628511,-0.014414001,-0.02122449,-0.03757785,-0.03232654,-0.027254565,-0.0018053955,0.071445525,0.023324504,-0.014743241,0.041399255,-0.00319367,0.034375872,0.010366296,0.062479045,-0.014286099,0.036167193,-0.032212403,-0.0008939826,0.0032898386,0.053792648,0.037648004,0.033454724,-0.010792503,0.008798662,0.01773088,0.047246695,0.041271485,0.064496204,0.053888213,-0.012138897,0.04423671,-0.005751421,0.018114554,0.06304692,-0.010061887,0.0014345206,0.10337759,-0.054263666,-0.009262268,0.052166853,-0.008734936,0.069996074,0.010315241,-0.010937418,0.025916576,0.038759187,0.018192085,-0.023079723,0.020569526,0.042799544,0.0036178413,0.055162977,-0.0121690305,0.014888252,0.0031635344,0.043350436,0.028853906,0.0024692,0.0036328984,0.019141888,-0.011176281,0.009879794,-0.034766365,0.039828837,0.012200722,-0.03773381,-0.037476577,0.015717147,-0.030584566,-0.0015077273,-0.03326956,-0.006667285,-0.01488618,-0.06419039,0.0067671984,-0.013258269,0.0035140256,0.012520419,0.042690855,0.031880956,-0.03221321,0.017395888,-0.05254587,0.0622561,-0.034931157,0.05030838,-0.035395022,-0.006224634,-0.04013044,-0.0098903235,0.010326756,-0.01149738,0.028637454,-0.017780004,-0.048673652,0.019569611,0.021365715,-0.0006923204,-0.01685704,0.018677764,0.07615043,-0.025484806,-0.0063678776,0.035056204,0.027511254,-0.0074206917,0.031441625,0.02104495,0.00408213,0.015400746,0.07324648,-0.059350926,-0.02465022,0.005680188,0.0492606,-0.016596342,-0.0071660276,0.015719175,0.036992814,-0.012531998,-0.0109515125,0.0109153325,-0.031635597,0.012608995,0.030860096,-0.0066879704,0.032294035,0.015196114,-0.010394391,-0.10172918,0.012474791,-0.014350664,-0.043755196,0.023490978,0.019019581,0.010516426,-0.045260355,0.018540358,-0.026118685,0.0025490972,0.023538472,-0.0074460097,-0.0108384015,-0.020923495,0.026295496,-0.07992128,0.0244476,-0.009064674,0.025716873,0.0018960922,-0.006978826,-0.0083834715,-0.03301039,-0.010188858,-0.007893211,0.048531167,-0.0001391067,-0.013900332,0.033103883,0.018712686,-0.065068945,0.027864514,0.03288535,0.01019356,0.035594907,0.036327053,0.013605694,0.013446814,-0.021091228,0.009821846,-0.007124503,0.015167269,0.04583715,0.0057916827,0.033587094,-0.071163096,0.01558263,0.035189405,0.027359087,-0.0382506,-0.009565884,0.055202477,0.014743351,-0.0013198575,0.009260981,0.008439211,0.044163503,-0.026094982,-0.017012415,-0.008092984,-0.007934249,0.035283104,-0.06358598,0.08840875,0.0318142,-0.010372149,-0.035756,-0.04825677,-0.003846264,0.006757853,-0.05957318,0.0054187495,-0.05370442,0.006437103,0.032217022,-0.048032656,-0.042505376,0.002495391,0.0070527866,0.0069970726,-0.026482794,0.024833016,0.015999217,0.018694792,-0.0005759089,-0.04269671,-0.051052205,-0.013328171,-0.0006358147,-0.047038153,-0.010957635,0.07980109,0.025162185,0.020341815,-0.01443097,0.018926341,-0.013592063,-0.028162394,-0.02181268,0.054264054,-0.03272249,-0.0091954935,0.0028835004,-0.051300675,-0.027184753,-0.0062893955,-0.022670524,-0.054581627,0.00438995,-0.016576698,-0.022173265,0.021891125,0.059861034,0.00034822177,-0.0026061048,0.006136017,-0.0122737335,0.013419415,0.047216386,-0.014759094,0.002553472,-0.010627421,-0.04115304,0.0043805996,-0.020526662,0.0222124,0.01878649,-0.02647176,0.04003068,0.056452192,0.069408916,-0.041564897,-0.07114205,-0.018219275,-0.01787397,0.025946746,0.058910154,-0.052989017,-0.016589474,0.009778258,0.0027230124,0.018769361,0.03429229,-0.016758474,0.064598486,-0.050236177,0.017096898,-0.0037614729,0.012190249,-0.0329064,0.027615597,0.008516319,-0.013281793,0.011394425,-0.043082725,-0.050040193,-0.060708594,0.019062644,0.018798402,0.0028605736,0.029348617,-0.02287065,-0.03815618,-0.033581566,0.028460525,0.061393898,-0.047305718,0.009183874,-0.022743918,-0.026297087,-0.043226283,0.011779846,0.0074854633,-0.01715179]
14	0	2026-03-23 07:29:42.870794	f	<p>Bß╗Ö vß╗ç sinh ─æa n─âng, c├│ thß╗â dß╗à d├áng vß╗ç sinh ─æ╞░ß╗úc nhiß╗üu loß║íi thiß║┐t bß╗ï: m├íy t├¡nh, laptop, tai nghe, ─æiß╗çn thoß║íi, b├án ph├¡m... Nhß╗▒a ABS cao cß║Ñp, chß╗æng va ─æß║¡p. Thiß║┐t kß║┐ nhß╗Å gß╗ìn, dß╗à d├áng mang theo b├¬n m├¼nh</p><img class="rounded-lg shadow-sm max-h-[500px] w-auto mx-auto my-4" src="http://localhost:8080/uploads/712dda1f-5f22-4c13-b62e-5faeedb61691_vn-11134207-7r98o-lv187gjlqj2185.webp" data-image-id="7"><p></p>	22222.00	{}	12000.00	Bß╗Ö Dß╗Ñng Cß╗Ñ Vß╗ç Sinh Laptop M├íy T├¡nh SMTech Bß╗Ö Vß╗ç Sinh B├án Ph├¡m M├án H├¼nh Tai Nghe ─Éiß╗çn Thoß║íi Nhß╗Å Gß╗ìn	bo-dung-cu-ve-sinh-laptop-may-tinh-smtech-bo-ve-sinh-ban-phim-man-hinh-tai-nghe-dien-thoai-nho-gon	{"Sß╗æ l╞░ß╗úng h├áng khuyß║┐n m├úi": "C├ÆN H├ÇNG"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	3	[-0.02116645,0.022371102,-0.031632327,-0.013678768,0.055138648,-0.00913766,0.024590435,0.008943454,0.006037684,0.035557378,-0.034300916,0.029412257,0.058074344,-0.012437464,-0.039138887,-0.010786776,-0.0006160686,0.010447815,-0.12086386,0.0004744095,0.0090775825,0.0038894222,0.04230115,0.017304545,-0.0985766,-0.022372687,0.0056671444,0.012317229,-0.0067098057,-0.08556409,0.0075750765,0.054639507,-0.012948553,0.021996241,0.0070869103,0.054977566,-0.034839306,-0.0063976482,0.0004952499,-0.031978384,-0.06148438,0.0120657645,-0.023796972,0.01200352,0.0008857444,0.029538928,-0.024871947,0.028725883,-0.04020565,0.035083883,0.035753362,0.008859684,-0.015200537,0.024384107,-0.0321309,0.00239078,-0.012352519,-0.040209062,-0.013648787,0.0041900566,-0.00049154833,0.0035210676,-0.0069043976,-0.016426874,-0.050391328,-0.038099308,0.02201978,-0.00068233575,-0.03008826,-0.0016683607,-0.076780625,-0.02640629,-0.083124764,0.031061523,0.02000756,-0.03688804,0.0056328056,-0.016704012,0.0014244498,0.05147349,-0.029404216,0.0019567083,0.063780025,0.06877039,0.03684274,0.0010818309,0.016900636,-0.0722357,-0.04437393,0.006744544,0.04155443,-0.009447262,0.017674852,-0.015991354,0.08960006,0.051437717,-0.105883524,-0.09340507,0.13631071,0.01213243,0.036507495,-0.02381091,0.014195116,-0.10291288,0.056687992,0.007967643,-0.0318942,0.029940953,-0.037164,0.036623415,-0.060615785,-0.022413809,0.030412732,0.018101245,0.011856488,0.025305096,-0.0061835963,0.02274907,-0.062245075,-0.0038355952,0.03262248,0.015424928,-0.046690043,0.048807338,-0.014697335,-0.0098390225,0.002923554,-0.0090630865,0.011947406,-0.013449509,0.048622016,-0.08820528,-0.059399396,-0.018607428,-0.098794796,-0.0047785304,0.025086803,-0.058734164,0.019087695,0.06828601,0.018206777,-0.055782057,-0.03869667,-0.010312133,0.0050775134,0.005840972,-0.0045263227,0.017104285,-0.029095124,-0.013498613,-0.026581671,-0.0382962,-0.00660595,0.00058922044,-0.029008478,0.004104618,0.027139498,-0.038199097,0.09340758,0.025672037,0.03623351,-0.0071903025,0.013110383,-0.01611504,-0.0070424154,0.015711822,-0.0095457975,-0.05402659,0.037002277,0.046686504,-0.02087302,-0.05411665,0.042413857,-0.083656795,-0.013702143,-0.013328995,-0.053571753,-0.05961709,-0.018397246,0.051917154,0.04741499,0.05734329,-0.0006518325,-0.013584696,0.036165725,0.006099154,0.007984884,0.014529943,0.06587195,0.040540513,-0.006108957,0.025855107,-0.013747793,0.018559339,-0.017702991,-0.0481766,0.01673767,-0.0047853375,0.045545656,-0.022160912,0.011078135,-0.018589865,0.0019229609,-0.07534102,0.0075718397,0.05657235,-0.056305412,-0.024469173,0.012670225,-0.021328833,0.013359129,0.03174532,-0.02168603,-0.054545395,0.026977964,-0.005897587,0.05453668,0.029430036,-0.021099558,-0.023342412,0.02949627,0.011901285,0.06418521,0.044928055,0.04313214,0.014912641,-0.036641404,-0.0078116274,0.0024518832,-0.08265699,-0.014197833,0.038310554,-0.035489164,0.04027062,-0.0056729955,0.03566382,0.04923837,-0.0014181234,0.0091758175,0.03468989,0.013490268,0.061367024,0.06970496,0.065300465,-0.01675225,-0.023562087,0.09368546,0.050318394,-0.025009958,-0.055881146,-0.0069508404,-0.016594464,0.07121896,-0.03419311,-0.07433673,-0.0009951427,0.017160578,0.042595476,-0.016035356,-0.05621146,0.055586636,-0.0096205585,-0.013227874,-0.07069391,-0.002658482,-0.100331634,-0.02886232,-0.043148268,0.025022523,-0.020778036,-0.0014635378,-0.03825912,-0.0164322,0.023632739,-0.028739216,0.00021020332,-0.03144511,0.01744989,-0.013643879,-0.06778623,0.010491113,0.04592489,-0.06019227,0.05728559,0.010048031,-0.05696312,0.00905144,0.018260447,-0.008603435,0.0029117148,0.0054961513,0.035005577,-0.020247228,-0.049365636,0.06048847,0.015203598,-0.0030568838,0.0034757357,-0.018753884,0.0035560124,-0.00033112054,0.066012934,0.020682964,0.026028972,0.00801343,-0.0312782,-0.019256957,-0.014833655,-0.013699472,0.0015660708,0.04409908,0.046250988,-0.07867173,-0.044646792,-0.008128029,-0.015926162,-0.19203122,-0.015652644,0.00874547,0.009772246,0.03699957,0.015415135,-0.0095090335,0.05290062,0.00027554692,-0.042095833,-0.01584696,-0.053664174,-0.008872172,-0.012895367,0.041623726,0.0048968624,-0.026212104,-0.0023973642,-0.0059581604,0.048018772,-0.06410731,0.010221466,0.04081929,0.047773857,0.003213568,0.035649847,-0.039014783,0.0434882,-0.04611158,-0.07977936,0.020196522,0.031154055,-0.0024968663,0.030992609,0.049104463,0.055940796,0.024026355,-0.0007544833,0.04102361,-0.015361427,0.048877217,0.06907895,0.012591387,-0.021881526,-0.016404463,0.003992826,-0.033436652,0.03834891,0.036046114,-0.01550789,0.019321978,0.028424272,-0.042706206,-0.0096619185,-0.014898325,0.030502645,0.0043962765,-0.027259782,0.026578331,-0.006460024,-0.05411456,0.010272392,0.03260059,0.01858749,0.007563872,-0.03606685,0.017450834,0.016329814,-0.0023575462,0.038118787,-0.06261082,-0.043132734,-0.045260742,0.08867547,0.010387274,0.009747956,0.03435605,0.0047624367,-0.052536245,0.030337768,0.007869245,0.04247082,-0.0040261475,0.03880508,0.044969,-0.042327,0.10427074,-0.05664812,0.001807779,0.021151606,0.00913593,0.009170301,0.022083951,0.013120664,0.01979803,0.011457669,0.0029568863,0.006534421,-0.049343776,0.00079223036,-0.008637081,-0.035856735,0.0144046,0.0056840526,-0.033118296,0.030236362,-0.0067961416,0.040711585,-0.0023364765,-0.027704606,-0.01323529,-0.011204843,-0.053316403,0.021854375,0.030934563,0.101748854,-0.027323194,-0.01458828,-0.033664644,-0.026150482,0.03252422,0.012387347,0.0025732403,0.02227723,-0.04243516,-0.024899423,0.0106088165,0.003774306,-0.055744916,0.017603198,0.070703216,0.015864594,-0.034526784,-0.026915845,0.029927973,-0.07607375,-0.006920888,-0.0037210768,-0.050058164,-0.021470224,0.017124983,0.07308279,0.0146727655,0.010016251,-0.031015987,-0.07066673,0.032867175,0.017468397,-0.04584748,-0.022981748,0.0050066253,0.0017130553,-0.06673634,0.045240425,0.07304701,0.006619577,-0.008216361,0.01734288,-0.0028654467,-0.020008048,0.004136023,0.030257592,-0.04656768,0.008033921,0.015063053,-0.020261899,-0.025617875,0.022360234,0.04981785,-0.011677896,-0.025275825,-0.014401148,-0.0045073605,0.032481536,0.018992964,0.072337046,0.0016071951,-0.05873466,-0.011324597,-0.005309545,0.039389424,0.041517187,-0.054294165,0.008365202,0.06821335,-0.0007947668,-0.0151200835,-0.03230488,-0.023639143,0.044454273,-0.062798575,-0.029838333,0.07400978,-0.044820588,-0.0020751478,0.03379708,0.029949754,0.021129215,-0.0052891835,0.062089425,-0.0061233,-0.0043100556,0.029002326,0.02197281,0.021770878,-0.023257844,0.024725907,-0.0068121944,-0.002398759,0.0006060607,-0.01159067,-0.019745145,0.014097994,-0.03489974,-0.0550297,0.017567832,0.052753568,0.010128796,-0.007844643,0.064374596,0.0036698817,-0.032634873,-0.00057579036,-0.019682039,-0.014298635,-0.03937094,-0.0015566021,0.019532697,0.012486107,-0.0050595836,-0.01401303,0.03300789,-0.043806728,0.08228279,-0.031078625,-0.03066681,-0.016724536,0.02497646,0.009272959,0.0035299284,-0.005045935,-0.0023233981,-0.091522686,-0.02248433,-0.023698112,0.030687554,-0.015477663,-0.029979952,0.045553118,-0.014162614,-0.0068813073,0.029583145,-0.015140978,0.007452237,0.0052696755,0.03478103,-0.02931872,0.017269146,0.024497828,-0.048307627,-0.00927055,0.019325847,0.04024832,-0.003830443,-0.0075643803,0.012706329,0.029584633,-0.006021465,-0.0071015246,0.027806962,-0.042370874,-0.05253386,-0.0034695133,-0.012247093,0.02115874,0.036993917,-0.02748669,-0.051005855,-0.00035455282,-0.032241717,0.029176533,0.01629418,0.038521692,-0.0056096325,-0.027589971,0.0005935595,0.030505262,0.010255122,0.0016118695,-0.04025264,0.007292288,-0.032453675,0.016299544,-0.022967555,0.008179725,0.02725334,-0.023343535,-0.036326654,-0.038480204,0.0074362573,0.03277439,0.0024591004,0.002925989,0.019820375,-0.013570479,-0.005093412,0.0427457,-0.036279596,-0.05199008,0.027158331,0.016972333,0.004161046,0.015466495,0.040496938,0.03581501,0.0055683637,-0.03361798,-0.016305631,-0.015905304,0.06230317,0.046969112,0.009404747,0.013847148,-0.03464845,-0.0046395217,0.03266516,0.051015127,-0.041844215,-0.01761642,0.005379391,0.016577756,0.009499778,0.023814213,0.031546608,-0.004878445,0.05584425,-0.07225198,0.012740459,-0.033542693,0.03716165,-0.04348238,0.04275592,0.026695719,-0.014393271,-0.023025403,-0.027372917,-0.004572432,-0.009824961,0.00084136263,-0.010637818,-0.051366907,0.027933015,0.014345837,-0.016811537,-0.010427457,0.023419397,0.012687354,0.03526668,-0.04861228,0.03946753,0.003407576,-0.002695194,-0.01807161,-0.0039984942,0.012497726,-0.017253203,-0.0074878247,-0.034523673,0.026101315,0.019741332,-0.008458625,0.03444877,-0.022709262,0.04481952,-0.033599887,0.006727876,-0.026144356,0.05435665,0.00037740287,0.021447001,-0.0048317253,0.021660294,-0.046292987,0.022590147,0.010358758,0.007916974,-0.031480096,-0.043835092,-0.0030739424,-0.031857297,0.03041691,0.009030194,-0.016689772,0.021904659,-0.015256466,0.020891163,0.045618277,-0.010737659,0.00025739477,0.014935514,0.007645483,0.009414266,-0.0103202965,0.053455785,0.0010273538,-0.011982819,-0.022731485,0.030541304,0.07485256,-0.008625355,-0.040541917,0.027734736,-0.031465963,0.044978093,0.05542875,-0.058277056,-0.03226657,0.013106405,-0.03756158,-0.004716126,0.013247022,-0.037821546,-0.053820893,-0.038434718,0.011896357,0.032912157,-0.06781938,-0.030643672,-0.040272776,0.02207284,0.027930137,0.013377466,-0.013204665,-0.06992676,-0.043897826,0.05804619,0.032609448,-0.0053205374,0.059124526,-0.04355499,-0.011591385,0.031017618,-0.014362729,0.038768303,0.0014053889,0.012889228,0.02837919,0.007591779,-0.08188374,-0.041108903,0.06723252,-0.010089093]
30	0	2026-05-12 15:12:35.727598	f	\N	1200000.00	{"testing": "testing"}	1200000.00	testing	testing	{"testing": "testing"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	1	[0.00841813,0.009010367,-0.031441133,-0.029024757,0.028442495,-0.02354448,0.0005016232,0.016955482,-0.025148928,0.017922956,-0.014237266,0.030329185,0.06826084,0.0027302857,-0.018982885,-0.03425311,0.011835567,0.020614505,-0.122520395,-0.013872436,0.038107853,0.0088224765,0.035787392,0.035776712,-0.04907293,-0.025555726,-0.016146054,0.026311735,0.023152046,-0.045601577,0.040872898,0.05441707,-0.006855598,-0.02417831,0.0056560324,0.025322225,0.037344996,0.016683172,0.014098935,-0.03367924,-0.035835255,0.03457799,0.004874795,0.035369612,-0.027193764,-0.03633357,-0.021132857,0.045241084,-0.047521945,0.034329172,0.027050091,0.04593096,-0.045508478,0.010090104,-0.03335157,-0.01671242,-0.007928459,-0.03188894,0.0020645855,-0.018916706,0.0606575,-0.018186776,-0.014197552,0.004596865,0.003767579,-0.016510403,0.006804648,-0.015876366,-0.06858993,-0.007344494,-0.03892923,-0.029806903,-0.0264688,0.027921828,0.03686501,-0.037105583,0.0068950206,-0.006910091,0.009592665,0.06285401,-0.0074568577,0.032971833,0.087498814,0.094853155,0.004419887,0.013546407,0.015343099,-0.11608018,-0.05858218,-0.006112187,0.07133393,0.037232414,0.018690415,-0.0063980133,0.056014467,0.010139459,-0.11973813,-0.09279052,0.09717768,0.047329098,0.0116001135,0.013672277,-0.012813302,-0.03570631,0.033639554,0.03524775,-0.040008172,-6.467095e-05,-0.02187468,0.009801149,-0.07847357,-0.057884023,0.01242857,0.012266031,-0.020188786,0.03293661,-0.041741714,0.0023517378,-0.028726144,0.016324729,0.014717418,0.019230857,-0.039071415,0.056403,-0.0012845882,0.0029710797,0.019596122,0.011373052,-0.05206401,-0.006961804,0.014007399,-0.08438604,-0.016101325,0.015329763,-0.03160452,-0.026539257,0.04871817,0.004303317,0.03714641,0.048047774,0.034978837,-0.0668179,-0.03038192,-0.0045361225,-0.0370617,-0.007743924,0.0026683572,0.05650706,-0.043473344,-0.004867817,-0.019761596,-0.022552475,0.033456434,-0.020161072,0.02506488,-0.009975853,0.032495085,-0.027298,0.07203815,0.015126208,0.026483288,-0.025686296,0.036965903,0.012678941,-0.041897878,0.001135621,-0.0025309708,-0.05649047,0.051058702,-0.0037398355,-0.043145664,-0.02892303,0.034693103,-0.0991032,0.01698861,0.0016390013,-0.051982988,-0.016543552,-2.5724194e-05,0.038836475,0.06350294,0.03099254,-0.0051704957,-0.073001385,0.033200145,-0.013887536,0.019177014,0.008492706,0.08025622,0.052458357,0.004646207,0.019869488,0.007652244,0.038474973,-0.023403497,-0.051576387,0.016404398,0.0019613612,0.03496733,-0.037245385,0.013892443,-0.025952332,-0.012857045,-0.04340351,-0.007864755,0.050937574,-0.06120259,-0.03529688,0.0065908483,-0.01765409,0.017230444,0.010094275,-0.00019369589,-0.053529795,0.036598224,-0.013232089,0.07159274,0.02217315,-0.011134194,-0.035543565,0.059345644,0.03307137,0.069004275,0.046606373,0.056755487,0.009533238,-0.038668368,-0.008394005,0.035761263,-0.048079934,-0.0015998221,0.041680705,0.0076353885,0.035886552,-0.06636781,0.052279253,0.041677088,-0.031572677,-0.023096552,0.029202098,0.055074114,0.032434102,0.10067906,0.047527064,0.04749874,-0.045452733,0.119572036,0.061947368,-0.028952604,-0.04383337,-0.0085384315,-0.024706032,0.03612434,-0.029682176,-0.06098848,-0.012731402,0.009948221,0.030785067,-0.01762794,-0.004996792,0.043323148,0.01664,-0.03930458,-0.1001656,-0.047370374,-0.12298604,-0.019674677,-0.0061320458,0.060687147,-0.036074292,0.024380103,-0.012570902,-0.055017747,-0.005299489,-0.023832522,-0.0053836536,-0.024715096,0.00018660062,-0.016903337,-0.074113674,0.036406625,0.0449211,-0.013396442,0.0073152715,0.024700413,-0.06690634,0.017823104,0.0110587785,-0.022043496,-0.018405678,0.042019907,0.039756507,-0.0124990875,-0.053751044,0.023191387,0.01285129,0.0003971836,-0.003737719,-0.007967188,0.0063051814,-0.021049686,0.08155286,-0.009520062,0.028453216,0.0011194509,-0.0015858306,-0.009345743,-0.021860888,-0.028511554,0.010201938,-0.015062719,0.04756699,-0.06282401,-0.043057494,-0.016136818,-0.040022485,-0.1776386,-0.017251356,-0.010603317,0.0023343908,0.028502412,0.012103998,-0.013225082,0.038018,-0.0025798636,0.0050418833,-0.017870964,-0.035934746,0.004531813,-0.009197771,0.022837678,-0.0058280895,-0.035086803,-0.041589152,-0.008872437,0.027651638,-0.06886128,0.01627866,0.060150262,0.020222882,0.05507116,0.05056715,0.002619837,0.015593138,-0.026393728,-0.07820841,-0.020318609,0.018565621,0.023891833,0.05591332,0.026360726,0.083285026,0.0089728255,-0.027597947,0.012544235,0.003423919,0.03602032,0.033152964,0.010927751,-0.028663917,-0.014792672,0.0124200005,-0.014207679,0.003986816,0.042147364,-0.015442258,0.054021303,0.062085353,-0.0543867,-0.05656956,-0.032065302,0.03398004,-0.027912684,0.009575839,0.03397324,-0.011647709,-0.028573794,0.016659586,-0.02204444,0.054093264,-0.03005032,-0.030299095,0.0145855835,0.030207744,-0.010627748,0.07679205,-0.04730894,-0.02554386,-0.035978854,0.009429369,-0.0020632062,0.019549688,0.027802149,0.0058431234,-0.044556458,0.061835334,-0.014159238,0.06023761,0.0016093025,0.032255955,-0.009204383,-0.05458343,0.059136096,-0.077404566,-0.033958293,0.00392509,0.020116879,-0.0039532906,-0.012712476,0.023749916,0.0029661744,0.0015005313,-0.04109253,0.03866555,-0.020680998,-0.02039207,0.014701886,-0.043733574,-0.028370127,0.00888851,0.0023328676,0.04131674,0.005156279,0.021367999,0.018903157,-0.047268283,0.019030418,0.0099220155,-0.04284429,-0.019391946,0.048625182,0.07543188,-0.0071093515,0.07223818,0.0064561493,0.018128246,0.0415955,0.010324429,-0.0020028476,0.025306439,-0.016332485,-0.014260278,0.03868122,0.018355701,-0.031658735,0.029237423,0.06986184,0.012093963,-0.049671274,-0.0009801624,0.009727521,-0.0055652275,0.01960057,-0.021908179,-0.056765147,0.0041328026,0.010988466,0.05138609,0.020946546,0.010836332,-0.011336339,-0.046625398,0.04200549,0.025233045,-0.024922682,-0.026415287,0.0098062055,-0.0027956394,-0.01868979,0.03337892,0.06741516,-0.010419737,0.015477144,0.010263706,-0.040480386,-0.0056455955,-0.020216165,-0.010494128,-0.0595309,0.018609213,-0.012514036,0.003639267,-0.0512153,0.051477477,0.036931418,0.0018474138,-0.019269964,-0.0044471207,0.021779912,0.0323111,0.006864635,0.06435142,-0.032508794,-0.049381923,0.0044159326,0.011146805,0.030039437,0.0073576276,-0.01585476,0.07739932,0.051804993,0.00798489,-0.003569615,-0.07013591,-0.05463802,0.054725844,-0.031513106,-0.0066021523,0.042699516,-0.005293137,0.027048593,-0.019309742,0.02700523,-0.007992114,-0.02103844,0.03147619,-0.036740407,0.029950537,-0.023461724,0.016342213,0.013307274,-0.02327898,0.016279293,0.010239656,0.010655041,0.022962406,-0.031767443,0.0028461553,0.028929109,-0.020931434,-0.04584236,0.032225356,0.032405995,0.027348842,-0.009640226,0.051059622,0.04812393,-0.0030488842,-0.023933554,0.0017233818,-0.0063322186,-0.007978238,-0.015546617,0.018867567,0.028341502,0.023307174,-0.015531504,0.06274629,-0.006867401,0.073883474,-0.0353046,-0.0037928156,-0.019723684,0.01541369,-0.007756918,0.00083933206,0.0228819,-0.042183783,-0.06371052,-0.0026374825,-0.0034534356,0.038796894,0.008312695,-0.012167325,-0.00033699488,-0.00734667,0.027570112,0.0554962,-0.012487093,-0.01032801,0.018743437,0.017569514,0.0015703456,-0.001323853,0.025297843,-0.029681118,-0.033486802,0.019959608,0.05908179,-0.00814994,-0.0015132495,0.019289294,0.053659953,0.012159407,0.021810668,0.017050546,-0.013942183,-0.018478913,-0.0048163803,0.0028875398,-0.003719524,0.02293129,0.00782508,-0.07519643,0.0090529015,0.013072942,0.003983023,0.03588035,0.014998248,0.05393327,-0.044871815,0.016369997,0.0321866,-0.014197154,0.024037383,-0.054015625,0.0011910937,-0.05894232,-0.0069106775,-0.043938868,0.02162997,0.05074807,-0.033262152,-0.03776963,-0.038032576,-0.022635218,-0.03274338,0.0014620314,0.02015189,0.0185658,0.011931079,-0.038526475,0.074528545,-0.021213975,-0.075606965,0.040994253,0.010613694,0.0014328584,0.029323263,0.04362755,0.022849109,0.022336923,0.011519912,-0.01846585,-0.025558734,0.04860685,0.027425451,0.017540824,0.012098692,-0.034687653,0.0016778982,0.004853007,0.064262405,-0.03102814,-0.030548256,0.043698266,0.017511478,0.019495392,-0.0003633097,0.03568795,0.026780024,0.04531336,-0.047136843,0.004001924,-0.044667494,0.035338193,-0.038573734,0.03311202,0.014178514,0.022026947,0.004930068,-0.038707703,-0.02481297,-0.0060422183,-0.0038680737,-0.007162685,-0.04300044,0.03814987,0.026871555,-0.034489825,0.009564913,0.0040713763,0.017167589,0.021803273,-0.032246873,0.047747176,0.0104693035,0.026738662,-0.0018505581,0.032768294,-0.018529952,-0.030039206,-0.0152144255,-0.041439958,0.010375778,0.0349833,0.02808915,-0.040761393,-0.02841514,0.07905713,-0.011145405,-0.020547543,-0.013111253,0.046193283,0.006321154,0.03409941,-0.003319566,0.030629007,-0.043489836,-0.0045439787,-0.047836006,0.015375405,-0.022700131,-0.058495484,0.021079399,-0.00024709312,0.032532055,0.012219648,-0.028959898,0.03297297,-0.03935087,0.011504508,0.037954345,0.013861512,-0.020497724,0.023952423,0.04582365,0.036945824,-0.012807473,0.025006093,0.031006211,-0.02122753,0.053998847,0.041328378,0.056214012,0.006064342,-0.04949708,-0.0047149654,-0.02836637,0.048628405,0.06592637,-0.040847916,-0.019264778,0.029640857,-0.043897115,-0.02327513,-0.007860778,-0.048092026,-0.03887472,-0.016879389,0.02150894,-0.029472766,-0.097716555,0.005271789,-0.04079398,0.02544044,-0.005153755,0.00034165106,-0.023020672,-0.04146504,-0.077893704,0.0033143316,-0.030508831,-0.004119874,0.038286407,-0.0028908192,0.004715511,0.010410521,0.005969501,0.022520218,-0.03593,0.080968715,0.034768384,-0.007025069,-0.047772747,-0.055261586,0.044953153,-0.0493747]
31	0	2026-06-07 13:04:39.047161	f	<p>adasddddddddddsssss</p><p></p><p></p><p></p><img class="rounded-lg shadow-sm max-h-[500px] w-auto mx-auto my-4" src="http://localhost:8080/uploads/bda6a275-891f-49a1-b6cd-af281179ea8e_Screenshot_7-6-2026_13631_www.bing.com.jpeg" data-image-id="11"><p></p>	10000000.00	{}	10000000.00	Iphone XXX	iphone-xxx	{"H├úng": "Apple"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	1	[-0.011849426,0.0027597162,-0.010998229,-0.035302386,0.026485108,-0.0009641472,-0.0011163848,0.01762605,-0.011174807,0.04151724,-0.027791236,0.020694923,0.0804517,-0.017103886,-0.0032996917,-0.0454902,0.00039455976,-0.0054643275,-0.09215991,-0.0077766553,0.012442377,0.013094912,0.015583805,0.015383625,-0.020318253,-0.0111208595,-0.031465907,0.050990883,0.02419117,-0.043883413,0.003562174,0.082667336,-0.040093586,-0.021844344,0.00928366,0.022539964,-0.010153821,0.034536984,0.039282013,-0.06665384,-0.05467215,0.025821937,0.013952062,-0.0034887993,0.002979736,-0.005182607,-0.017641524,0.049709167,-0.040762756,0.03581103,0.043898586,0.020299327,-0.051116735,-0.03177467,-0.03142317,0.006046695,0.0011711044,-0.025991226,0.008387,-0.06706037,0.032227233,0.001908589,-0.019517105,-0.014981523,0.02411376,-0.032102775,0.022255871,-0.004301807,-0.068646125,0.051942233,-0.039414,-0.07236826,-0.007508338,0.0074190474,0.05694294,-0.050397683,-0.013960881,0.0022484716,0.025609268,0.055900816,0.00087460346,-0.004927368,0.08761392,0.07012762,0.028294787,0.007977307,0.001941278,-0.061375316,-0.060907684,-0.03365848,0.07586307,0.017228026,0.042224765,0.03881972,0.07738804,0.0141952215,-0.103046775,-0.114350274,0.07929033,0.045675937,-0.020534573,0.024935413,-0.006386936,-0.078058325,0.0543768,0.01754599,-0.033300865,-0.047709197,-0.020002322,0.015556494,-0.05905999,-0.05837786,0.032954715,-0.026111072,0.01974497,0.05541083,-0.02307758,0.050883874,-0.019093582,0.020406298,-0.00032710188,0.0033548104,-0.0633587,0.025733417,-0.010289895,0.035050828,0.035886075,-0.00912994,-0.014327765,-0.0057630297,0.049202114,-0.07894746,-0.026799258,0.014368391,-0.055989705,0.0021459493,0.06451767,-0.012136944,0.040925756,0.0430278,0.013952329,-0.00933268,-0.028409146,-0.016086677,-0.020245312,0.013514274,-0.013322175,0.044563204,-0.049956836,0.044304717,-0.009683283,-0.02622633,0.040549353,-0.034979694,0.007870597,-0.041436393,0.03047607,-0.008515752,0.071628556,0.012174393,-0.010962937,-0.037417326,0.066315494,-0.0034400483,-0.056242444,0.068115786,0.014997277,-0.037313472,0.031702146,0.03724513,-0.03915121,-0.024574464,0.034887463,-0.13019116,0.009785128,-0.023191702,-0.07270543,0.009323264,-0.01771506,0.043075368,0.1065265,0.024407892,0.0052934163,-0.03329263,0.05003226,0.024392739,-0.027344005,0.009232968,0.052208047,0.03201058,0.05765238,-0.02328729,-0.006701129,0.03175714,-0.0019636771,-0.034772582,0.030736899,-0.010735258,0.05075008,-0.048681118,0.010697709,0.003529257,0.0045540514,-0.044279385,-0.008884142,0.03743952,-0.07737164,-0.00824498,-0.007856351,0.00018049327,8.974603e-05,0.015989546,0.01426989,-0.058016308,-0.010800557,-0.005297288,0.08854292,0.020659283,-0.012455943,-0.007281169,0.020345438,0.01879787,0.063173756,0.037482295,0.026172835,0.024098415,-0.047969576,-0.011085236,0.04231774,-0.037699666,-0.008828344,0.0036138813,-0.016032374,0.013230804,-0.03548818,0.03023876,0.042253233,-0.032406148,-0.009425486,0.023553817,0.06248711,0.046560366,0.07240961,0.041237004,0.025798466,-0.009867888,0.063225694,0.03341061,-0.04128651,-0.036176182,-0.011885611,-0.0460426,0.044116143,0.019054838,-0.06899649,0.004963102,0.02762457,-0.016981957,-0.023796689,-0.031709954,0.034749456,0.0023622431,-0.028546885,-0.078055106,-0.049373057,-0.065500244,0.0041251755,-0.01790703,0.027590401,-0.032660462,0.014999619,-0.03785136,-0.039678797,-0.0095824795,-0.053162005,0.017563779,-0.04205732,0.006455544,-0.018299673,-0.03160631,0.059291,0.02828427,-0.03397489,0.01304118,0.007901019,-0.06856766,0.024214456,0.0070334133,-0.0034002236,-0.0007907847,-0.005982914,0.06444133,0.014649483,-0.024477841,0.030206332,0.020029223,0.010749039,0.024392689,0.012144246,0.01706733,-0.0035734766,0.07540778,-0.04449748,0.0037223627,-0.017700378,-0.032707937,-0.029680522,-0.02492252,-0.021118483,-0.013785758,-0.017416958,0.07029057,-0.04140244,-0.05858684,-0.010084104,-0.028024072,-0.18103585,-0.0003155129,0.0036700978,-0.019087521,0.05132741,0.036697675,0.0068373266,0.032008566,0.037092097,0.0021091406,-0.018264808,-0.016411675,-0.022175353,-0.03966863,0.0027402746,0.0006761052,-0.036162008,-0.050566766,-0.012982468,0.03709074,-0.055546615,0.02086778,0.047739994,0.036400564,0.048259895,0.057777394,-0.019590588,0.0085324,-0.054911472,-0.06256068,0.014866826,0.04630611,0.052327067,0.04771356,0.015223567,0.07019828,-0.0051376126,-0.04378811,-0.016660897,-0.0031841537,0.034171324,0.036356915,0.024754506,-0.060100105,0.009408184,0.017662302,-0.0021344628,0.012486249,-0.01069069,-0.040974192,0.06767873,0.040433817,-0.0672599,-0.066632494,-0.042530924,0.020270701,-0.034852374,0.032692343,-0.0009572376,-0.008620489,0.03293133,0.023300061,0.012533171,0.04315972,-0.02183521,-0.051915325,-0.034222588,-0.004507351,-0.013549413,0.0766229,-0.07241827,-0.02196565,-0.039120454,0.061974056,-0.028147087,0.025674766,0.039767034,0.017601654,-0.053173147,0.07588754,-0.014213163,0.07965645,-0.033923544,0.042204615,-0.013191996,-0.015076846,0.07397082,-0.05071445,-0.01567037,0.0013827436,0.0074484134,-0.0155023215,-0.012248717,-0.037133597,-0.0009278584,-0.020138342,-0.015424148,-0.012469835,-0.047411762,-0.004029809,0.036118746,-0.042844478,0.021840807,0.0081715975,0.017504318,0.0429744,0.014362571,0.04859644,-0.0028966218,-0.024304401,0.03320217,-0.009878507,-0.051750273,-0.010812878,0.031314094,0.047840826,-0.034455042,0.043226168,-0.040068418,0.00051803706,0.040140275,-0.003128764,0.017266681,0.0009895599,-0.031682923,-0.03289146,0.04216726,0.008021789,-0.03189315,0.046004083,0.05435773,-0.024567584,-0.056224328,0.024988113,0.025873005,-0.042740755,0.05947932,0.0041491995,-0.051839855,-0.003622263,-0.0020753564,0.02811034,0.006137437,0.00952824,-0.011541039,-0.04381477,0.041465532,-0.008038147,-0.010404329,-0.019337786,0.011799144,-0.006224616,-0.056918923,0.042170417,0.064627886,0.005721917,0.017082617,0.008549523,-0.008149871,-0.01704833,-0.05160763,0.013112701,-0.07066278,-0.013601041,0.0055329613,-0.032751553,-0.036464404,0.041105315,0.059985306,-0.034846928,-0.001151698,-0.013939324,0.019135337,0.04470332,0.029148433,0.058342773,-0.004835912,-0.044708896,0.016795686,0.0029684734,0.017979477,0.0019559774,-0.024327464,0.053860642,0.07087604,0.019420067,0.012381118,-0.067363836,-0.03001465,0.06532186,-0.041888546,-0.023091296,0.03707337,-0.009326026,0.041378807,0.016604243,0.0113373315,0.0030627267,-0.00942615,0.02030757,-0.039411116,0.0069485866,-0.021803632,0.012044921,0.046856277,-0.03476078,0.015043121,-0.0074173114,0.022136824,0.026012031,-0.012186508,0.008375443,0.023417762,-0.045312997,-0.015368876,0.022402888,0.044316247,0.07576816,0.039485816,0.06806705,0.054916475,-0.021624269,0.006922842,-0.005956163,0.046425056,-0.042552877,0.00044627878,0.009277712,0.011306478,0.014030234,-0.026887061,0.029888503,-0.04629352,0.036295723,-0.03727729,-0.01179187,-0.029545927,0.043163087,0.011574535,-0.011207746,0.011133059,-0.055939157,-0.063884765,-0.016378071,0.008729916,0.036591183,-0.0087525835,-0.0003035561,-0.0062246444,-0.0067855553,0.034308635,0.069208786,-0.012287117,0.017277962,0.04031996,0.041594524,-0.02799732,-0.011120507,-0.0026953632,-0.01148476,-0.019664902,0.045760024,0.069760434,-0.012626399,-0.018956412,0.009964771,0.02098483,0.0029899827,0.053011138,0.009078373,-0.0146392,-0.014685947,-0.0032588043,-0.0009264302,-0.0049276934,0.0070515447,-0.015977276,-0.032554038,0.014511075,0.004506411,-0.0009788919,0.009926144,-0.01663051,0.020705,-0.034660183,0.011900007,0.040679097,0.038906876,-3.1167696e-05,-0.03754744,-0.024880884,-0.058847345,0.057327352,-0.06136239,0.0005572198,0.048899848,-0.05334529,-0.042254116,-0.033882443,-0.0019477509,-0.0025090394,0.013510231,6.533265e-05,0.028738737,0.014455538,0.0040710107,0.0630965,-0.019826068,-0.033935077,0.033143528,-0.0025618905,-0.033635966,0.010086554,0.032978114,0.041504115,0.019864481,-0.010224666,-0.056576762,-0.017464701,0.046943348,0.0086960215,-0.017839087,0.035866268,-0.07136247,-0.0019998918,-0.005773403,0.09355971,-0.036039066,-0.0018424232,0.014843406,0.0040396657,0.030089702,0.051913876,0.034468412,0.0328472,-0.02426217,-0.044753443,-0.011738252,-0.004931651,0.0140426075,-0.033411093,0.022707367,-0.004334611,-0.006135172,-0.0044092247,-0.042761598,-0.028615015,0.014285716,-0.011871738,-0.0010134649,0.0037880805,0.03937013,0.020939628,-0.047751594,0.020286182,-0.01854306,-0.0025490336,0.021838747,-0.03524031,0.06531515,0.014419899,0.01590036,0.030186495,-0.0068836203,0.0061899316,-0.05019495,-0.00637735,-0.010522092,-0.008669351,-0.008342997,-0.015591637,0.028194038,-0.011166718,0.033179976,0.015920749,0.0060878075,-0.019580418,0.009965292,0.013086976,0.052642293,-0.029723965,0.03851097,-0.027869008,0.0048436164,-0.038286183,0.007694876,-0.038145445,-0.039962683,0.00034542533,0.009032616,0.002905703,-0.022094995,-0.023707243,0.036323935,0.0031689599,0.018120242,0.020642322,0.027943822,-0.015919136,-0.009265925,0.028698603,-0.018986233,-0.06332122,0.055222727,-0.0029246416,-0.023418607,0.021920033,0.04617238,0.043941088,-0.0070534633,-0.038322873,0.0122273285,-0.019640146,0.037746847,0.10554498,-0.03364609,-0.02566624,-0.0011694725,-0.033886936,-0.024049193,-0.0035850033,-0.034533203,-0.01700846,0.00053743605,0.01757518,-0.0458934,-0.077339746,0.013897382,0.020220827,0.034590915,-0.0010395873,0.034215152,0.013992242,-0.024434442,-0.041042484,0.023066655,0.008023757,-0.0016110324,-0.01026207,-0.00026446537,0.017180096,0.0099248225,-0.016304791,0.051485732,-0.040927205,0.060422055,0.043931916,-0.0018550912,-0.03336089,-0.055080857,0.03614778,-0.02675634]
1	0	2026-02-04 20:25:15.620905	f	\N	35690000.00	{"asd": "asd"}	35690000.00	─Éiß╗çn thoß║íi iPhone 17 Pro 256GB - Ch├¡nh h├úng ZP/A	dien-thoai-iphone-17-pro-256gb-chinh-hang-zp-a	{"Gß╗¡i tß╗½": " TP. Hß╗ô Ch├¡ Minh", "Th╞░╞íng hiß╗çu": "Apple", "Hß║ín bß║úo h├ánh": "12 th├íng", "Loß║íi bß║úo h├ánh": " Bß║úo h├ánh nh├á sß║ún xuß║Ñt", "Dung l╞░ß╗úng l╞░u trß╗»": "256GB"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	1	1	[0.01969435,0.036454987,0.010626868,-0.046129957,0.06175596,0.027600782,0.014827914,0.00395179,-0.014850292,0.013168829,-0.021333955,0.017907629,0.048748165,-0.0073692617,-0.013367507,-0.025930697,0.009544078,0.0122113675,-0.09335156,0.015854407,0.016540335,0.002634608,0.009297497,0.029934753,-0.032473452,-0.03139669,-0.034016263,0.06354798,0.026023326,-0.057038713,-0.038640574,0.071197115,-0.034188624,-0.028877078,0.00990405,0.07007386,0.004664718,0.011918533,0.051034503,-0.081752464,-0.02843522,0.06742789,-0.025768898,0.019251077,0.02338342,0.011821229,-0.012243441,0.044936832,-0.030530088,0.03882443,0.06754831,-0.0071429126,-0.05229451,-0.007681976,-0.033017743,0.0023415682,-0.037362527,-0.04765546,0.007976885,-0.019022027,0.037803493,0.02090868,0.012102479,-0.017614713,0.024966497,0.0026449866,0.015140551,-0.028491348,-0.07331323,0.02204145,-0.0019626745,-0.077897795,-0.021839418,0.05002688,0.043441776,-0.041614242,0.004599669,-0.0020966053,0.026675833,0.06935087,-0.02329853,-0.005426401,0.08666342,0.075110726,0.004371078,0.025969002,0.033221725,-0.07854408,-0.06639647,-0.013976907,0.0691631,-0.017379707,0.033827797,0.036017217,0.08738747,0.0013144587,-0.10350498,-0.09403657,0.0762434,0.0002106656,-0.0164171,-0.009611495,0.0065966197,-0.12462225,0.026878549,-0.007600613,-0.038879387,-0.031801127,-0.019424004,0.02952521,-0.054361437,-0.065967135,0.019833934,0.008389031,-0.030859323,0.0035545677,-0.005555858,0.011913151,-0.02972458,0.014017848,0.011462729,0.0026220388,-0.043390222,0.042366575,-0.00684737,0.04623655,0.004442096,-0.019568823,-0.0014981951,-0.020698853,0.039993998,-0.095510244,-0.0016266794,-0.011396025,-0.05052594,0.0039291265,0.09862194,0.03850309,0.049857397,0.006990586,-0.0030209036,-0.03784072,-0.054540347,0.024614722,-0.016792838,-0.0051628016,-0.02154947,0.02111956,-0.041388277,0.025536848,0.007209812,-0.03452228,0.030748196,-0.016188646,-0.006173727,-0.015778292,0.0077202176,-0.03686527,0.05143732,0.053568047,0.020009592,-0.025954925,0.076102935,0.016892307,-0.036966152,0.024080176,0.004877816,-0.034840003,0.048659712,0.007916358,0.035667434,-0.033432696,0.035540674,-0.122220315,-0.021944117,-0.02018059,-0.044905916,-0.0020073925,-0.010513143,0.018394517,0.095170625,0.012893117,0.0015607019,-0.014905043,0.039082732,-0.012806559,-0.012923643,-0.027353713,0.040695675,0.05890145,0.05958823,-0.016728733,-0.00978545,0.028338283,0.0019388691,-0.06498962,0.023622015,-0.011953853,0.080698825,-0.06210322,0.02799459,-0.0014591127,-0.010784586,-0.077926815,0.012701652,0.0076659885,-0.08010264,0.0059401942,-0.011793676,-0.0030289998,-0.009149922,0.030444726,0.024101503,-0.0641509,-0.008233951,-0.00068119925,0.059540037,0.017768558,-0.010895666,-0.035918664,0.015652934,0.020666325,0.03622478,0.032148473,0.02161547,0.020440726,-0.03739354,-0.01098025,0.039856635,-0.058902636,0.030474689,0.009490836,-0.014228781,0.016181486,0.0039173537,0.0003351956,0.031113049,-0.009081447,0.0014342718,0.045781262,0.07291302,0.01505142,0.0715972,0.067332,0.016325828,0.026058031,0.10527769,0.01616136,-0.01303348,-0.02809245,-0.007170796,-0.029877469,0.0013110827,0.028252654,-0.05662757,-0.023385406,0.031442367,-0.018008307,-0.0005221857,-0.010485163,0.046097428,-0.038617834,-0.030084329,-0.06607536,-0.030595442,-0.0716344,-0.024196198,-0.011705722,0.03044425,-0.0070224577,0.0013581213,-0.024715124,-0.0039085485,-0.0067072883,-0.03492781,0.051004224,-0.043171253,-0.0010840802,-0.008166591,-0.049725186,0.06034209,0.046971194,-0.010718844,0.01540559,0.011905303,-0.047909383,-0.01617665,0.023398967,-0.0166326,-0.025333924,0.025742741,0.039426938,0.005542672,-0.021318227,0.010785745,0.030374173,4.8062917e-05,0.051741764,-0.009739664,0.013451928,-0.0522624,0.040888034,0.0077490383,-0.01572264,0.009160344,0.0075369566,-0.0019164293,0.01388783,-0.03936764,-0.026262887,-0.0050274925,0.08196381,-0.03658157,-0.03359572,0.0072357077,-0.01962999,-0.18883155,0.009011245,-0.00520902,-0.009130786,0.060492374,0.016746622,0.011505139,0.004243758,0.0052279243,0.018907344,-0.012497237,-0.020083565,-0.0077986713,-0.046604067,0.0013019806,0.004086843,-0.018189462,-0.0072197393,-0.018974707,0.044887614,-0.04595933,0.022557218,0.052222762,0.036803015,0.051587965,0.03575896,0.0041036727,0.055513814,-0.05950958,-0.05734912,0.0422981,0.05148535,0.06486065,0.040779013,-0.006199116,0.04987754,0.015749404,-0.012521625,-0.02141028,-0.0035907703,0.025793519,-0.00848924,0.013451054,-0.04528165,0.007263066,0.03116884,0.013959448,0.010507881,0.028993033,-0.030844267,0.082416534,0.057923406,-0.0713021,-0.037610516,-0.01008616,0.035524692,-0.0059544635,0.05649544,0.013371708,-0.008498071,0.0088294605,0.03422251,-0.011602276,0.0125394445,-0.018856503,-0.04629111,-0.022334242,0.0057286755,-0.004342441,0.05676513,-0.0463691,-0.050680514,-0.010813719,0.06694817,-0.044456095,-0.00087485684,0.028264455,0.035248984,-0.044519495,0.056280583,-0.009079018,0.013560235,-0.0015892474,0.050816838,0.00018697887,8.089158e-05,0.09748004,-0.06466336,-0.01949413,-0.022786193,-0.010508944,0.009531358,0.011210468,-0.0079688225,-0.005650796,-0.039884653,-0.02238737,-0.02807738,-0.031211976,-0.01874554,0.023032095,0.018697217,0.03214109,0.025799721,0.0028344225,0.045630828,0.008414849,0.0052256295,-0.012562393,-0.053938422,0.013363982,0.0047027627,-0.06474915,0.0049077193,0.013652213,0.05796285,-0.02451713,0.025322003,-0.044869892,0.0057370984,0.025481783,-0.013632315,0.016047308,-0.021677908,0.0047694524,-0.023250354,0.043313004,0.004231422,-0.02862124,0.038021237,0.06682714,-0.010204654,-0.057056576,-0.00682149,0.04677475,-0.0067846878,0.026355272,-0.015905578,-0.03725925,-0.017625924,0.00945765,0.0087579945,0.010944206,0.042259835,-0.0076534413,-0.035749663,0.011538344,0.009260568,-0.027872456,-0.0201233,-0.0215993,-0.014096239,-0.056371115,0.07258397,0.035215326,-0.01039497,0.0054333103,0.012731016,0.009879357,0.027243724,-0.04907236,0.033774935,-0.043892328,-0.009170925,-0.04847966,0.006345429,-0.009461694,0.03852715,0.0597199,-0.03405319,-0.0030941374,-0.012236086,0.054786425,0.09197614,0.042852674,0.06256266,-0.016039537,-0.043983214,0.01989504,0.018959526,0.032556076,-0.0061476473,-0.0044942736,0.020560745,0.08247482,0.03305097,-0.005269677,-0.03666863,0.0004314003,0.053987052,-0.022189414,-0.026867647,0.027232582,0.0012319281,0.04883386,0.011754764,0.007219679,0.029172657,-0.0031577183,0.03568321,-0.03088932,-0.005038334,0.00020212795,0.049935427,0.047247604,-0.05784084,-0.04117841,-0.024257647,-0.004550598,0.016378019,0.009277652,0.0011761758,0.0059288936,-0.0090973135,0.0032335846,0.04329806,0.0028991534,0.051520593,0.018354759,0.046993896,0.060126357,-0.020726591,0.029812349,0.00040578906,0.06601808,-0.019264081,-0.021904213,0.02555029,0.016922975,-0.032231636,-0.0043317038,0.03827083,-0.016138332,0.011412105,-0.019226098,-0.056450002,-0.011642571,0.0200269,0.012178296,-0.007977474,0.043491907,-0.027797176,-0.09514296,-0.026739754,-0.023998339,0.03365136,-0.011455533,-0.03337739,0.0023072849,-0.017351486,0.012772251,0.07173559,-0.012477687,-0.010673175,0.07794354,0.06559556,0.008545403,-0.008061769,0.018094495,-0.027621174,-0.007606903,0.038060635,0.05292975,-0.007465603,-0.03469934,0.018899862,0.03658233,-0.02255123,0.06607513,0.015504179,-0.045341533,-0.03859595,-0.016084159,0.008903797,0.03133613,0.006172632,-0.018958619,-0.042207588,-0.0062177246,-0.0036375825,0.0007468744,0.0056653763,0.007864417,-0.0012678901,-0.027252614,0.0137317255,0.03590429,0.07696351,0.018679034,-0.04878805,-0.008717846,-0.04255507,0.057780825,-0.033577774,0.008153896,0.03412605,-0.02460949,-0.015498768,-0.051700465,-0.017137649,-0.00057558785,0.01580158,0.032320183,0.027290681,-0.015674885,-0.024096008,0.0391686,-0.01036193,-0.020006653,0.04447351,-0.017522752,-0.01986627,0.018917657,0.030060885,0.057185445,0.022248738,-0.035626274,-0.03607216,-0.030033734,0.06618171,0.021369668,0.02327507,0.030493656,-0.059884723,-0.028519558,-0.007783816,0.04045625,-0.08422381,-0.01128542,0.014050626,0.019671913,0.013366035,0.052742474,0.024302408,0.0069888593,-0.007330393,-0.054075394,-0.012011312,0.0008709532,-0.011924427,0.017280417,-0.007883766,0.010418818,0.02340617,0.004625037,-0.043369066,-0.04561039,0.025294624,-0.0093232505,-0.0042727673,0.018408783,0.0051284106,0.036023784,-0.070187785,0.0059189145,-0.011576157,-0.017904622,-0.006691437,-0.053674195,0.07649478,0.021154325,0.012314257,0.009918957,0.008600829,0.012553243,-0.048410524,-0.012007518,-0.028865442,-0.014117806,-0.0023686453,-0.020379124,0.0036680137,0.022899453,0.006235154,-0.034699477,-0.005284696,-0.04111717,0.03731059,-0.0021089676,0.020819671,-0.03997127,0.010677763,-0.045716215,0.015384356,-0.024035187,-0.042461876,-0.019477949,-0.052587442,-0.0011684404,-0.01424672,0.02468169,-0.0044076126,-0.04079624,-0.010430651,0.0080710575,0.02184032,0.055004943,0.0051220227,0.020481661,-0.02044659,0.030216016,-0.034571107,-0.047701452,0.064465396,-0.025687007,-0.028337903,0.008338929,0.045505177,0.033489928,-0.0032164436,-0.03943688,0.0008857052,-0.018068168,0.063815355,0.091887556,-0.055038113,-0.022754304,0.009386447,-0.025407437,-0.023162736,0.011070005,-0.02830567,-0.009194168,-0.020805193,0.035881042,-0.025469609,-0.080059834,0.007884521,-0.011820636,0.07113419,0.027758325,0.013285373,0.03849658,-0.011745855,-0.049838316,-0.004671411,0.0017832805,0.0023512817,0.012195702,0.0040125246,0.025995487,0.0061460743,-0.01941125,0.036863603,-0.01710231,0.07265808,0.012189987,-0.010759481,-0.0042852224,-0.038456593,0.017667213,-0.03862469]
2	0	2026-02-04 20:52:29.304651	f	\N	12790000.00	{"asd": "asd"}	12790000.00	iPhone 13 128GB Ch├¡nh H├úng VN/A	iphone-13-128gb-chinh-hang-vn-a	{"RAM": "4GB", "Gß╗¡i tß╗½": " TP. Hß╗ô Ch├¡ Minh", "T├¼nh trß║íng": "Mß╗¢i", "Th╞░╞íng hiß╗çu": " Apple", "Hß║ín bß║úo h├ánh": "12 th├íng", "Loß║íi bß║úo h├ánh": "Bß║úo h├ánh nh├á sß║ún xuß║Ñt", "Dung l╞░ß╗úng l╞░u trß╗»": "128GB"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	1	1	[-0.021756297,0.021686407,-0.025791762,-0.05025356,0.076447256,0.00919404,0.008858661,-0.010010312,-0.0110882195,0.022294734,-0.017863685,0.0061018686,0.044189375,-0.020526867,0.0064006136,-0.07355436,-0.02433246,-0.0055966605,-0.09722081,-0.013096302,0.03165585,0.008148409,0.023283679,0.03515374,-0.05197499,-0.041932024,-0.029804328,0.060823105,0.04408638,-0.056016084,0.012732969,0.103825524,-0.0019103031,-0.007510453,0.014977937,0.015118785,0.004957898,0.030414632,0.02763486,-0.067188345,-0.040884316,0.044478077,0.01818808,0.017574837,0.0025267422,0.005010701,-0.00976564,0.046318173,-0.041786194,0.054567672,0.016693706,0.0068570366,-0.034806386,-0.024150878,-0.045189947,-0.0035444002,-0.011410864,-0.062205262,0.030030018,-0.025263174,0.04633728,-0.006675542,-0.02567871,-0.012037002,0.00045312868,-0.039305337,0.014313508,-0.022841915,-0.04824628,0.0087532075,0.0031609389,-0.04443471,0.0048422427,0.044087008,0.043450713,-0.03973943,0.0028515207,-0.0001952841,-0.0010787968,0.065582834,-0.014776507,0.032739885,0.05964745,0.057408866,0.023938429,0.02056178,0.010526948,-0.047444917,-0.06916979,-0.0184007,0.04619999,0.010130446,0.05598652,0.0075831097,0.06854157,0.010947105,-0.10805833,-0.05654222,0.09975669,0.035641074,0.017647183,0.002589662,0.00020050726,-0.07761034,0.014373131,-0.024738034,-0.04445631,-0.02478222,-0.029257275,0.0027734647,-0.07248018,-0.06811158,0.03128911,-0.027095068,0.020734748,0.027992848,0.0055292128,0.027535798,-0.054868303,0.019561304,0.027509049,0.039692592,-0.018799128,0.0076001687,0.00723784,0.02957685,-0.0031733846,-0.014184197,-0.022011427,0.0031832897,0.063638255,-0.06558118,-0.025456566,-0.000595089,-0.011231881,-0.021718534,0.058110267,-0.011763546,0.011941471,0.041778363,0.018237658,-0.02581025,-0.045049876,-0.012149519,-0.0054260227,-0.009486354,-0.0045491266,0.001108027,-0.06436371,0.04712978,-0.03315287,-0.029573387,0.039731428,-0.023458341,-0.022010047,-0.044982202,-0.0003888377,-0.01799715,0.07301048,0.029629515,0.014813099,-0.007876272,0.053409226,0.018680526,-0.06310223,0.03030726,0.012251865,-0.039567064,0.05324396,0.07138849,0.026841791,-0.018745165,0.013347358,-0.12660775,0.009589692,-0.0043404163,-0.039269097,0.0017592262,-0.009064386,0.026754526,0.06927991,-0.0008267159,-0.013244067,-0.032012437,0.055096257,0.029488597,0.008872334,-0.024620617,0.020345008,0.036970284,0.025441557,-0.03543429,-0.017047275,0.047948148,-0.0048942864,-0.03927306,0.0017400287,-0.04201812,0.0544283,-0.028792113,0.0018430048,0.008980525,0.019406235,-0.030667152,-0.0024634383,0.018424721,-0.061124247,0.0044094655,-0.017485382,0.0010306047,-0.019224534,0.030915469,0.008043006,-0.084745124,-0.019368181,0.0093164025,0.041988093,0.004232926,-0.048081707,-0.03569504,0.002585419,0.0055588866,0.029934919,0.072742686,0.02147246,0.025971819,-0.03071895,0.03026244,0.025336139,-0.07556775,-0.001423555,-0.00611169,-0.020435106,0.016024584,0.0026620007,0.039340716,0.038770508,0.010012659,0.0055361195,0.031427056,0.08322138,0.02941646,0.04927107,0.08499271,-0.0017825473,0.0038325547,0.080237456,0.03708979,-0.009989155,-0.037831817,-0.042582083,-0.06438016,0.059793673,-0.006504037,-0.07294598,0.0009903365,-0.0013988061,0.023289897,0.0011672192,-0.012530956,0.0063305576,0.008267373,-0.032309234,-0.055956103,-0.050862145,-0.10323431,-0.004875378,-0.039317675,0.009625444,-0.029264573,0.002514861,-0.055559892,-0.010817437,-0.022075092,-0.04397971,0.024443172,-0.055240903,0.0038230398,-0.044469964,-0.039342154,0.059778124,0.049118005,-0.007945932,0.00015556888,0.00026815356,-0.054263357,-0.0048135966,-0.02108873,-0.0054525197,-0.0425769,-0.02053141,0.043059193,0.044736825,-0.027510429,0.047780894,0.03933722,0.008873817,0.02941627,-0.031287454,0.02665789,-0.0044090846,0.057613984,0.0006816804,0.018956687,0.037875075,-0.00011996265,-0.0017567703,0.010560258,-0.02683317,-0.008454843,0.0013617084,0.058860347,-0.045954857,-0.07198868,-0.005644653,-0.024550153,-0.171813,-0.005431299,0.0068246974,-0.022626633,0.063425384,0.022687517,0.027549408,-0.0022744925,0.035186023,0.041221187,-0.015233006,-0.011747707,-0.0011647923,-0.029786525,-0.0013294982,0.021983262,-0.022383267,-0.03146202,0.004022823,0.023934767,-0.046174567,0.0107250875,0.07913806,0.06340089,0.049587958,0.05089927,-0.035593137,0.083351165,-0.070050105,-0.057951517,0.0025768827,0.060583018,0.026783269,0.048135895,-0.007274796,0.06760706,0.014352368,-0.02101776,-0.004120392,-0.021954656,0.03177144,0.020323327,0.04131992,-0.05432389,-0.006798978,0.06342721,-0.01370054,0.006816046,-0.0056893523,-0.034425568,0.041381408,0.03990911,-0.041188523,-0.0320356,0.010539752,0.013283893,-0.013365679,0.039749034,0.0026141137,0.011666062,0.04626784,0.038255464,-0.0018524383,0.017269643,-0.0073802066,-0.04849359,0.0002539189,-0.001951013,-0.03228055,0.05789255,-0.06898784,-0.03799126,-0.013559078,0.05807794,-0.027113477,0.003088354,0.03206442,0.01317343,-0.056035966,0.054346394,-0.007057348,0.04969166,-0.013077608,0.065224744,-0.00872089,-0.003539007,0.10206246,-0.0656205,-0.0071193026,0.0023381715,0.02838742,-0.00942623,-0.009326222,0.008238208,-0.0021363813,0.0048929434,-0.011306451,-0.028515648,-0.07883434,-0.039072335,0.018980417,-0.009276654,0.032719832,0.0033605667,-0.009546402,0.056981903,0.030650774,0.04241119,0.027998893,-0.030734476,0.026512057,-0.0009591768,-0.054224804,0.008864411,0.047050595,0.063631244,-0.05304806,0.042808313,-0.03607826,-0.013186561,0.062371932,-0.003990953,-0.0011441549,0.00053580466,-0.041437797,-0.02455763,0.063457794,0.021445615,-0.027955808,0.051882654,0.061262675,0.017520286,-0.005873032,-0.0118282605,0.051575627,-0.018172747,0.033461418,-0.0042477385,-0.0016195715,-0.0043851384,0.016539643,0.018739484,0.00666779,0.03042091,0.020639082,-0.010072657,0.06746651,0.0039048865,-0.04202518,-0.043905616,-0.017667135,-0.024699101,-0.033077907,0.06011347,0.054408573,0.007979601,-0.004183477,-0.0078537995,0.010418036,0.020697482,0.002378849,0.036732983,-0.072378755,0.02168376,-0.021138785,-0.008801254,-0.008110078,0.05316503,0.042370882,0.0052821515,0.012950925,-0.029073132,0.031885784,0.067776985,0.046219125,0.07076608,0.0063292664,-0.053790335,0.0010972078,0.036240987,0.0258891,0.021191482,-0.04832817,0.04048503,0.08660914,0.028392006,0.011683711,-0.032486748,0.022791378,0.05959021,-0.02937332,-0.022596195,0.028639235,-0.035269536,0.007831797,-0.010781257,0.010631716,0.006177497,0.01057856,0.042401593,-0.037605334,0.0053607915,0.0018101179,-0.0037925341,0.06739533,-0.05270104,-0.003097012,-0.004062444,0.0017579849,0.03353641,0.0064328746,0.011981567,-0.011072293,-0.018198567,-0.019943025,0.038847804,0.012802054,0.06104175,-0.028235609,0.041102957,0.06675897,-0.011152505,0.009717303,-0.0023204482,0.08376774,-0.017032517,0.004021757,0.0011707695,0.00071515475,-0.006255494,-0.005858197,0.017267726,-0.026263744,0.045140315,-0.046121024,-0.027107803,-0.025807573,-0.0017932096,0.037518054,0.003201417,0.009736602,-0.055499587,-0.07149815,-0.048415888,-0.015417721,0.032294463,0.0063114134,-0.009712634,0.02811201,-0.012200455,0.008774017,0.085344024,-0.026757393,0.012246268,0.061427098,0.059437834,0.0040046307,-0.013423379,0.003299962,-0.023395207,-0.0444807,0.03570607,0.07668866,-0.0064159003,-0.029398326,0.025895126,0.07096377,-0.030314248,0.047981832,0.037019998,-0.035122424,-0.019876681,0.021950675,0.005334095,0.055351704,0.02741738,-0.013908676,-0.041335046,0.007207172,0.024428137,0.023346687,-0.009186826,0.0030596475,0.0033973653,-0.018170655,-0.00086341205,0.034498103,0.04133635,0.024060193,-0.014964992,-0.024350742,-0.045324992,0.056221254,-0.031861622,-0.01176133,0.028716289,-0.035526846,-0.032869503,-0.036258813,-0.025767628,-0.0021924134,0.031813454,0.0073715863,0.024574354,0.026023805,-0.0159739,0.04750071,0.029614296,-0.047733244,0.025294518,-0.015088557,-0.024308244,0.048340417,0.037362114,0.03858387,0.044143576,0.0040684263,-0.05614668,-0.0064985147,0.06307507,0.021658933,0.015658282,0.074414946,-0.07680433,-0.05465745,0.008672966,0.061958518,-0.042100795,0.026303358,0.013659781,0.017676655,0.037319295,0.026946314,0.016207723,-0.00606685,-0.025244748,-0.02015167,-0.0208306,-0.0071640383,-0.0033040715,-0.0027006727,0.045443423,0.01033551,-0.006816721,-0.009917107,-0.06500474,-0.020630479,0.0017426278,-0.004594592,-0.011595228,-0.013915754,0.030814627,0.025340758,-0.06404484,0.019338999,-0.021462886,0.010460191,-0.008231591,-0.031357743,0.06482156,0.0043514976,-0.020203317,0.006389537,0.010352306,0.0035464272,-0.02975186,-0.003448741,-0.01183483,0.0023968867,0.0017343109,0.00566292,-0.014345317,-0.01590041,0.02661053,-0.0033009371,-0.007730552,-0.010605269,0.05637341,0.0073676975,0.033534236,-0.05485327,0.028362066,-0.016543172,-0.019569568,-0.028056039,-0.023855487,-0.024160637,-0.056656044,-0.026374115,-0.008931083,0.011102403,-0.0067039663,-0.022708794,0.018802026,0.0059701554,0.032586686,0.03233487,0.050282273,-0.013846841,-0.020004844,0.05375226,-0.029763432,-0.028371934,0.056211427,0.011795842,-0.03480121,-0.025075033,0.042626265,0.035223167,-0.016830947,-0.042263307,0.0013116766,-0.017318662,0.0323017,0.06399818,-0.048544805,-0.024854386,0.0016355758,-0.021555053,-0.044165395,-0.00014304867,-0.014520147,-0.03825075,0.009933756,0.0031440132,-0.019272443,-0.059760995,0.008248646,0.014789716,0.030338444,0.0356688,0.04831816,-0.0006335572,-0.019880816,-0.026715485,0.05372044,0.003326404,0.006318248,0.013303307,-0.013726397,0.015736321,-0.012766227,-0.038273882,0.046113867,-0.028531676,0.037935276,0.069617845,-0.00533712,-0.027572555,-0.051735606,0.019937914,-0.038511284]
27	0	2026-03-23 08:45:36.217311	f	\N	200000.00	{}	200000.00	Tai nghe Sony MDR EX155AP in ear c├│ d├óy vß╗¢i micro ─æ├ám thoß║íi - ─æß║ºu cß║»m 3.5mm	tai-nghe-sony-mdr-ex155ap-in-ear-co-day-voi-micro-dam-thoai-dau-cam-35mm	{"Th╞░╞íng hiß╗çu": " sony", "Kiß╗âu kß║┐t nß╗æi": " C├│ d├óy"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	108	7	[0.023369655,-0.006129513,-0.039092604,-0.015997322,0.016695945,-0.03160448,0.017743608,0.03361919,-0.009157711,0.0015359514,-0.03680521,0.037563134,0.08972636,-0.012695485,-0.006177416,-0.044420354,-0.016791802,-0.0120837875,-0.12150145,-0.015383705,0.02301624,-0.008801584,-0.019043548,0.04696334,-0.024339171,0.01837292,-0.004464341,-0.0077067506,0.0046356507,-0.021876434,-0.029720219,0.042277,-0.0024619813,0.0071349945,0.0055210334,0.02295008,0.037815005,0.0076093394,-0.006848974,-0.023749989,0.008248206,0.0757282,0.029846136,-0.0022622603,-0.042131457,0.0021999925,-0.021001257,0.096277535,-0.06955326,0.021323835,0.0440407,0.015504222,-0.02022341,0.006158993,-0.012191472,-0.0021023504,-0.070150316,-0.03272759,-0.010251495,-0.023536952,0.04005486,0.027438296,-0.00526897,0.028991843,-0.037336703,-0.027308254,0.005967926,0.00044437236,-0.08595016,0.0027343614,-0.04050075,-0.0939062,-0.025190812,-0.007261363,0.06603359,-0.09939415,0.044252213,0.017630797,-0.008384058,0.066149116,-0.016953865,0.027415104,0.1084032,0.01489208,-0.0023490873,0.013305026,-0.01155655,-0.08083488,-0.03800363,0.0012696934,0.022534626,0.0074330987,0.029962528,0.04216852,0.104861535,0.0063467077,-0.044288464,-0.13297917,0.08634283,0.081840485,0.025596999,-0.024832778,0.05040473,-0.087955125,0.02594496,-0.0037741233,0.006198184,-0.036064744,-0.01004395,0.02982482,-0.015804661,-0.05122628,0.037987795,-0.001467209,-0.04401615,-0.0057849116,-0.019115118,-0.010693885,-0.0024295526,0.01694422,0.026525961,0.024150847,-0.016947623,0.02560385,0.010008767,0.024098538,0.03788579,-0.00044996047,-0.010490654,-0.009020965,0.0076738955,-0.092897244,-0.051525872,-0.004286675,-0.016074346,-0.029216928,0.078046754,-0.020988796,0.03960898,0.03203752,0.03354741,-0.05033768,-0.043075576,0.0033195051,-0.045781575,-0.009907435,-0.068673536,0.045166526,-0.051456448,-0.0287464,0.0011970493,-0.054627687,0.0045650536,-0.01796487,0.043467756,-0.06707987,0.06949888,-0.00056621426,0.05561709,-0.011443809,0.0044915723,-0.04331388,0.02722459,-0.012426797,-0.028935634,0.036979727,0.034822475,-0.05099172,0.039437447,0.041400526,-0.018793257,-0.07253365,0.030208029,-0.08846695,-0.014023034,-0.037251003,-0.06256725,-0.028182255,0.0060360115,0.04095347,0.057644248,0.035685394,0.024967954,-0.05299716,0.015111151,-0.010447758,0.0240697,-0.014449962,0.042340703,0.026976144,-0.0035645806,0.0072265374,0.034757096,0.058256544,0.04026077,-0.10851159,0.0068555754,-0.009318167,0.017803242,-0.0052153007,-0.010247126,0.018830134,-0.014458133,-0.058125224,-0.002228363,0.0268838,-0.044788167,-0.014358546,-0.012992543,-0.02039541,0.05032966,0.019651484,-0.0053376667,-0.0306609,-0.018594917,-0.020886544,0.032256275,0.012878661,-0.013408723,-0.020048134,0.0626974,0.028319225,0.062116385,0.058000825,0.037419308,0.04285455,-0.03424647,-0.0012948314,0.0056919567,-0.027767021,-0.048169423,0.03302604,0.030106055,-0.029664857,-0.020455066,0.054769143,0.014710059,-0.027942393,0.021002792,-0.04192671,0.03144396,0.025551254,0.07756258,0.04944992,0.029212393,-0.060045008,0.03980281,-0.00949028,-0.01617618,-0.031589806,-0.02534038,-0.048145052,-0.013608861,0.015212323,-0.0932852,-0.03319286,0.0025596581,0.0056050275,-0.035441853,0.0030757254,-0.006600639,0.0054099783,-0.016533338,-0.06658679,-0.0034477839,-0.11758025,-0.016156042,-0.021327766,0.03538599,-0.026158359,-0.026790852,-0.07422219,-0.043200254,0.0020245342,-0.044047914,-0.018694203,-0.011587066,-0.007957801,-0.066060066,-0.004570117,0.036687095,0.07610926,-0.028741116,0.027803969,-0.005980491,-0.051982824,0.021062097,0.040408287,0.0012619329,-0.01565843,0.015591523,0.028703928,-0.0073368503,-0.00027457104,0.027560538,0.016161673,-0.023839062,0.035491288,0.025059668,0.027458979,-0.02480277,0.057166714,-0.025314104,-0.0536723,0.0016664658,0.014249938,0.036244582,-0.008514639,-0.040779855,-0.021265894,-0.0035458023,0.066933095,-0.063783504,-0.021782132,-0.0075294166,-0.013434985,-0.16941464,-0.004990658,0.030627578,-0.0058695804,0.036030825,-0.011196293,-0.011262957,-0.01886791,-0.0066674277,-0.004603414,0.010250488,-0.0106551945,0.03565152,-0.018735515,0.011149631,-0.0007228028,-0.02074839,-0.04817713,-0.018013889,-0.0017818097,-0.077561654,0.0046412232,0.069823205,0.058222108,0.029969053,0.018074142,0.043315906,-0.009432393,-0.05417353,-0.04766104,0.021393837,0.03868067,0.027013658,-0.039980188,0.025874903,0.074333794,-0.03323041,-0.022212474,0.0026578763,0.006052621,0.022781283,0.012594243,-0.0013552292,-0.034282867,-0.041951,0.033414412,-0.019595912,0.01140271,0.030735891,-0.034976546,0.02250504,0.021440085,-0.049466416,0.0074160816,-0.019019505,0.06429584,-0.043227453,-0.02196346,0.0018241911,-0.021999104,-0.02828919,-0.0037786656,0.013309169,-0.043608658,-0.01081851,-0.0638975,0.035896182,0.0004238397,-0.0021842748,0.09327283,-0.114986286,-0.01396503,-0.044169597,0.045842964,-0.015925055,0.0057345815,0.0005462185,0.010442701,-0.027882729,0.09536629,0.034532204,0.04712384,0.009499666,0.05386871,0.024308436,0.014435577,0.0900977,-0.060695566,-0.010453733,0.002842352,0.02248729,-0.044805013,0.0071620685,0.027588174,-0.0100910915,-0.0050114947,-0.013798519,0.025913399,-0.076237895,-0.0033877913,0.04052356,-0.015881924,-0.04485344,0.018835677,0.027473437,0.082987055,0.008601832,0.029768977,0.046936877,-0.034452077,0.019956978,0.009904469,-0.028990906,0.016947772,0.030506907,0.055936094,-0.016087303,-0.00637697,-0.041953065,-0.008475604,0.016323127,0.014674956,-0.0098501565,0.029312389,-0.008455721,-0.0054665226,0.043327626,0.009575306,-0.041709773,0.0037477626,0.064112425,-0.018225666,-0.02816375,0.0010257165,0.023874106,-0.022058766,0.038121488,0.0072977412,-0.024913125,-0.011026222,-0.010728696,0.02008963,-0.009950022,-0.018285386,-0.021590985,0.0043250844,0.030824495,0.017296243,-0.0108702155,-0.0168086,-0.024320541,0.028390922,-0.051331453,0.043402072,0.06897521,-0.015694236,-0.0012819581,-0.017673869,-0.021874996,0.011022852,-0.016097916,0.023114063,-0.05089894,0.016345523,-0.0050011873,-0.022748558,-0.024041858,0.025366148,0.05005263,-0.038251743,-0.03300643,-0.0110122645,0.025761202,0.040866166,-0.0023532442,0.030992717,0.005170824,-0.0345386,-0.0088732345,0.05885384,0.035404842,-0.0035159052,-0.0038765443,0.023119718,0.044633508,0.0058067585,-0.056726325,-0.027642984,-0.020991175,0.07637533,-0.018445501,-0.00058150536,0.043236133,-0.023896398,0.00495114,0.012645615,0.013458118,0.01361167,-0.03786753,0.0012586013,-0.041941375,0.01952966,0.021034313,0.013710558,0.020220825,0.007781376,-0.025109101,0.02756023,0.044124268,0.0138445,0.02553285,-0.006274605,0.0027168163,-0.0413606,-0.05010191,0.012524665,0.024207821,0.047763005,-0.0070144907,0.06629348,0.02202498,-0.03534,-0.030436855,-0.020154634,-0.0012712581,0.02204092,0.0023806277,0.014918402,0.001252308,-0.013752463,-0.014933853,0.046171334,-0.02367847,0.039325852,-0.0023873015,0.0026249036,-0.017754754,0.012957491,0.022906428,-0.022203172,0.012661589,0.010956377,-0.068845175,-0.016392319,0.048235044,0.063746855,-0.024688967,0.012866379,0.023833582,-0.0082792165,0.024001027,0.029207483,-0.0051334165,-0.005036976,0.018920973,0.016912436,0.0070161037,-0.017859435,0.015603304,-0.04979105,-0.0322994,0.023403628,0.033765256,0.020896923,0.018807845,0.0057483725,0.055251747,-0.026702872,0.038526952,-0.007153586,-0.0040608062,0.0053284373,-0.012384421,-0.018941317,0.02321917,-0.040875997,-0.012602918,-0.01937808,0.0014012324,-0.028779345,0.008926814,0.0026556686,0.01748538,-0.011484509,-0.051397987,0.043765076,0.022822639,0.0077519165,0.021833345,-0.06085617,-0.0036966493,-0.058176823,0.02419014,-0.052057568,0.0066507123,0.021335665,-0.03822538,0.0041353726,0.009533168,-0.013411969,0.021671081,0.03234122,0.028281527,0.063544676,-0.020992469,0.023031054,0.013835725,-0.043304205,-0.06709004,0.030368261,-0.002379288,-0.013275031,-0.026092514,0.021439966,0.056142677,0.021980138,-0.040970117,-0.057784792,-0.0242635,0.019028831,-0.007615034,-0.0059803003,0.002323499,-0.0423451,0.01656825,0.01449942,0.102470465,-0.034709744,-0.036882833,0.014543351,0.010866456,0.025946334,-0.0131166605,-0.01301208,0.008002208,0.054729097,-0.06322164,0.024561485,-0.033438534,-0.039917827,-0.021929363,0.007486991,0.009809211,-0.003755494,0.024168618,-0.026940646,-0.014089803,0.0038628664,-0.011086923,0.004909487,-0.030481415,0.061669696,0.06385868,-0.009981769,-0.054870468,0.014191619,-0.009833731,0.04572204,-0.030549427,0.08716312,-0.010037177,0.012180345,0.0067536584,-0.01510207,-0.026369758,-0.029054118,0.004810273,-0.034756422,0.025762811,-0.0100424485,0.0056061996,0.0068491288,0.0016190289,0.026656652,0.005305042,0.027323078,-0.025339937,0.04760684,-0.006357121,-0.0015874514,-0.046054624,0.02557144,-0.040749364,0.029386798,-0.008431904,0.027720908,-0.01014108,-0.11013359,0.004236852,-0.024217749,0.017708056,0.007473468,-0.0048420513,0.014489911,0.010642767,0.00984721,0.058646597,0.011415899,-0.034191266,0.009462926,0.030214014,-0.03898057,-0.032325424,0.0180009,-0.06540288,-0.03720328,-0.0033449337,0.086753875,0.042006038,0.0096386755,-0.030399559,-0.01255651,-0.037319057,0.043927185,0.05855996,-0.006862314,-0.025768505,0.0040485417,-0.03920912,-0.010521798,0.0047356724,-0.026143365,-0.017629331,-0.01625,0.048285626,-0.04841269,-0.039990127,-0.023124754,-0.025256464,0.04690564,-0.010568218,0.010799066,-0.006133238,-0.041674893,-0.012003045,0.04536265,0.03931707,-0.03794481,0.01431558,-0.023231206,-0.01447453,-0.034770153,0.030823503,0.033722594,-0.009511586,0.03621068,0.05009902,-0.007895032,-0.06453373,-0.029710727,0.06254775,-0.035837524]
28	0	2026-03-23 08:48:48.978079	f	\N	1000000.00	{}	1000000.00	Tai nghe c├│ d├óy dß║╣t HOCO giß║»c cß║»m 3.5mm c├│ mic jack vu├┤ng tiß╗çn lß╗úi d├╣ng cho samsung xiaomi ...	tai-nghe-co-day-det-hoco-giac-cam-35mm-co-mic-jack-vuong-tien-loi-dung-cho-samsung-xiaomi	{"Th╞░╞íng hiß╗çu": "hoco", "Kiß╗âu kß║┐t nß╗æi": " C├│ d├óy"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	108	7	[0.033980776,0.010616975,-0.012805374,0.009710495,0.025478795,0.0038978334,0.04086138,0.050350785,-0.01374349,-0.016020019,-0.025549147,0.046739466,0.107627556,0.0069987667,-0.045095585,-0.01622541,-0.009438466,0.004206033,-0.114460714,0.025394572,-0.010903615,0.0036427386,0.012994952,0.030486599,-0.034696955,0.0013299304,0.0008712915,0.0036358198,-0.034963686,-0.047520112,0.007185348,0.07353496,0.009198273,0.006315047,0.015777063,0.028893892,-0.029557409,-0.0039057473,0.011229419,-0.019488318,-0.023728948,0.049822886,0.013123203,0.013472011,0.023306614,-0.0014475059,0.024260897,0.024928082,-0.05046267,-0.007860968,0.07580604,-0.001994387,-0.038948204,-0.009753194,-0.0066531245,0.013807501,-0.04220134,-0.07008893,0.026653871,0.009268625,0.03958047,0.014127666,0.0018230604,-0.0065555666,-0.05367744,0.01111144,0.00017984466,-0.032951236,-0.084036455,0.0027457017,-0.03192212,-0.058442913,-0.047480404,0.030644674,0.042146448,-0.03025938,-0.015215146,0.0132325515,-0.027401924,0.047143757,-0.03125934,0.006971598,0.059716977,0.0990005,0.0021963338,-0.020852804,0.035658907,-0.06513089,-0.046440057,0.0033663954,0.061001346,-0.068196915,0.03234701,0.016552377,0.07635373,0.037000973,-0.0903319,-0.09498361,0.05672015,0.055964764,-0.0020160964,-0.028681817,0.04346188,-0.11109924,0.007213176,-0.0063648787,-0.015913354,-0.044747695,-0.010209928,0.010883352,-0.041655373,-0.012580173,0.0041332357,-0.01518521,-0.009159303,0.0007389878,-0.018279841,0.021384055,-0.0627851,0.00420485,0.007951151,0.017313799,-0.0630054,0.029546402,-0.018620027,-0.028020753,0.022164576,-0.019143471,-0.02264365,-0.020690745,0.043003082,-0.10315989,-0.047714207,-0.014231684,-0.0093294885,-0.069644146,0.06997564,0.014162111,0.05769757,0.031120706,-0.014635545,-0.02586403,-0.049167108,-0.0009225901,-0.020613318,0.026949093,-0.06422643,0.00713471,-0.04414634,0.014647204,-0.02834281,-0.009402048,0.059890997,-0.018155258,0.019496549,-0.0380665,0.02287009,-0.027001083,0.030356484,0.02719928,0.008886415,-0.051444836,0.030083394,0.00081516814,-0.04441159,0.057736307,0.0069581307,-0.056840662,0.066637,0.049560543,-0.024816604,-0.07918484,0.027410833,-0.08735246,0.0066247904,-0.010372907,-0.041409675,-0.06068491,0.043885656,0.01822866,0.05760813,-0.001212846,0.009940443,-0.054667313,0.037626553,-0.0055699046,0.030579964,0.04264246,0.04669756,0.020131316,0.017493935,0.009821863,0.03365144,0.030245584,-0.01586322,-0.076530434,0.047629543,0.047942456,0.023794893,-0.051260646,-0.0090501215,-0.008875697,-0.03218608,-0.062259108,-0.020061463,0.017865788,-0.05032968,-0.044754274,0.009030283,-0.015636673,0.035234388,0.06709236,0.008244003,-0.04725793,-0.012240515,-0.0027090278,0.05090342,0.0387844,0.034600098,-0.034612577,0.014889552,0.0076599387,0.06679718,0.041654006,0.041359216,0.048226323,-0.05441265,0.020010058,0.034103308,-0.08953418,-0.017309286,0.026669359,-0.015005149,-0.01804425,-0.015225232,0.041507546,0.052833084,-0.043676827,0.011275977,0.009991446,0.04195174,0.07100546,0.083890066,0.051664285,0.041058186,-0.016924338,0.06617867,-0.004110541,0.018873012,-0.04893178,-0.019289816,-0.09088314,-0.006919035,-0.009171788,-0.06486105,0.009670928,0.0053627826,0.020483255,-0.037099577,0.027827952,0.038263816,0.015701361,-0.01829828,-0.050696068,0.0066473363,-0.115816645,-0.0017989129,-0.039615184,0.044305652,-0.029117038,-0.008975613,-0.025688594,-0.020616295,-0.030080017,-0.020660175,0.0022033511,-0.056522757,0.0042168894,-0.06479261,-0.03077643,0.029181309,0.03780913,-0.014287355,0.02914235,-0.0028099653,-0.08070312,0.024882145,0.019529773,-0.01285005,0.004000344,0.011882417,0.042134456,0.012190003,-0.0063206726,0.011288983,0.019351237,-0.01400825,0.06495591,-0.017124241,0.02858854,-0.042273626,0.0067957556,-0.012451766,-0.013023961,0.035253994,0.00036482405,0.010232009,-0.05297434,-0.016139958,-0.025906479,0.01470032,0.03763272,-0.08068815,-0.03848735,0.017027926,-0.023546297,-0.14969328,-0.024677027,0.0068506435,0.004331563,0.02989694,0.015586043,-0.020831145,-0.016291559,0.034416154,-0.036675353,-0.019107748,-0.028835315,-0.021225736,0.029926311,0.019682743,0.01284228,-0.026354467,0.0021626987,-0.0019763198,0.046643656,-0.05475457,0.04179832,0.07322085,0.04121817,0.051545072,0.038385216,0.03491353,0.020908702,-0.037993394,-0.028116476,0.028573874,-0.0067801187,0.051784407,-0.009219129,0.012889537,0.08008257,-0.037285622,-0.016231285,0.028201643,0.015955376,0.038075052,0.02446483,-0.0043492415,-0.022626959,0.004917566,0.0180427,-0.007248921,-0.0028815612,-0.007831872,-0.03105403,0.0567266,0.04981865,-0.067625955,0.016809987,-0.029949669,0.024205904,-0.052403938,0.002864133,0.014848474,-0.030310133,0.020565648,-0.007852645,-0.015154447,0.0053047603,0.0061783865,-0.043624688,-0.012964048,-0.010663377,0.024583343,0.03168707,-0.096243836,-0.01738377,-0.021306535,0.05503752,0.015872099,0.03781265,0.045810718,0.0070156762,-0.015818587,0.040657006,0.0070039094,0.047629677,0.026027692,0.036488455,0.0029023583,0.01462424,0.10148619,-0.024266144,-0.0042740162,0.01608633,0.028938064,-0.023674168,-0.00013979073,0.018077793,-0.021445466,0.023552034,-0.012696914,0.014624209,-0.04370029,-0.040112548,0.017440494,-0.017150998,-0.017115103,-0.005538198,0.024962151,0.06665429,0.01773981,0.07449834,0.052583806,0.0032309883,0.035265297,0.022248274,-0.048737135,-0.021907184,0.03446226,0.059652615,-0.027290445,0.0059575024,-0.009160479,-0.013782348,0.023087544,-0.049707998,-0.0075979126,-0.014034557,0.006690605,-0.0074502723,0.052936826,0.0063462495,-0.03353676,0.030376185,0.097117245,0.010353868,-0.0635252,0.015517728,0.039952733,-0.0007013074,-0.00946901,-0.0026084178,-0.048695717,0.0096829515,-0.0049431347,0.028197898,0.009464823,0.004721638,-0.0011509421,-0.031841386,0.048656583,0.027132703,-0.032847356,-0.025960883,0.027009608,0.012737071,-0.054255042,0.033698656,0.07191269,-0.00030796093,-0.0023980336,-0.038256887,-0.012022923,-0.030347051,-0.019043984,0.0066884137,-0.06823715,0.03013767,-0.008518856,0.03237694,-0.035627067,0.028411536,0.08511291,-0.014466176,-0.02820672,0.023647146,0.005326775,0.04415718,0.009290925,0.03860927,-0.007915369,-0.054451734,-0.018718567,0.039289676,0.050486922,0.0014820743,-0.025925005,0.017379241,0.06327631,-0.0039820643,-0.010507632,0.00030606697,-0.04459744,0.066951245,-0.054567866,0.0065609873,0.035061087,-0.038131766,0.03748836,0.0125160385,0.011464061,-0.045584217,-0.039339267,0.01637263,-0.025366692,0.013305556,-0.017107477,0.028811753,0.00052850496,-0.010301522,-0.03859559,0.025175389,0.014563454,0.027256662,-0.008277902,-0.025756657,-0.0033924445,-0.029454136,-0.02792491,0.024068499,0.0701416,0.043835927,0.017970081,0.057034794,0.036511593,-0.029603738,0.027001647,-0.029943064,0.04498083,-0.031531807,0.0017079618,0.05171518,0.01021358,-0.011391066,-0.044538617,0.054994136,-0.03638471,0.06136803,-0.04467597,-0.032321844,-0.026775224,0.011540754,0.017106052,-0.015217893,-0.0024495176,-0.0028302583,-0.055506557,-0.02877991,0.03396387,0.047278,-0.031888843,0.00933029,0.015430054,0.019886235,0.016148962,0.07311935,-0.0504608,0.036138017,0.03439534,0.035924774,0.011457248,0.0015170822,0.00034107422,-0.012935168,0.02394231,0.023267744,0.030495822,0.011614284,0.009012492,0.025835304,0.013581075,-0.016673796,0.012143187,0.026144257,-0.028774723,-0.05598092,0.030699806,0.022513656,0.009518264,-0.0053222515,-0.010532415,-0.04380457,-0.017291678,0.008479386,0.022018677,-0.04816269,-0.01221406,-0.017631881,-0.042609666,0.018005233,0.06483151,-0.000269987,0.035677552,-0.031205803,-0.052452575,-0.05673544,0.03896271,-0.052420523,-0.004527412,0.023654092,0.017214384,0.026451092,0.018203955,-0.03999761,-0.0034665195,0.0026269185,-0.0015242078,0.03375708,-0.0030669803,0.00081404025,0.009155831,-0.011476296,-0.04303979,0.0458926,0.014549914,-0.026839647,0.012837938,0.033899087,0.04705038,0.02134151,-0.023384364,-0.01727992,-0.04951343,0.039970778,0.050853994,0.012267452,-0.00047337243,-0.05256293,-0.014321929,-0.0009566624,0.05246679,-0.03389519,-0.0025015858,-0.0070318067,-0.03154385,0.007816557,-0.008609735,0.06554245,0.0033232588,0.04877254,-0.04265776,0.025710395,-0.044348877,0.005115871,-0.030746153,0.01268964,-0.016473165,0.029650979,0.04893012,-0.01855708,-0.028040817,0.030869601,-0.007871187,-0.018693088,-0.046847776,0.039018426,0.0031265616,-0.029084053,-0.016212491,0.02147203,-0.011753452,0.04141837,-0.0007145469,0.03137625,-0.00899468,0.0077070524,-0.033792302,-0.009916369,-0.006784975,-0.05138196,-0.0035142181,0.0139639005,0.022997487,-0.011881051,0.017699782,0.010040383,-0.03522695,0.042993367,0.015108761,0.017439341,-0.028175779,0.021821104,-0.008847936,0.05223855,-0.014138374,0.0041684886,-0.041865278,0.025791507,-0.004142293,0.042712662,-0.0012221042,-0.078501105,0.012840105,-0.032467227,0.0035293156,0.014341706,-0.0026998734,0.008838467,-0.022702299,0.0026344731,0.026500225,-0.015714776,-0.020046525,0.025916344,0.021174492,-0.025683261,-0.06332517,0.07074636,-0.004798021,-0.029536681,-0.0023442756,0.068452224,0.03541654,0.004235525,-0.05292513,-0.018069949,-0.012490551,0.08223605,0.077983625,-0.04005867,-0.035141986,0.021684315,-0.05123698,-0.007386707,-0.01132555,-0.0017814182,0.0055128983,-0.05725848,0.0481768,-0.018947637,-0.021645261,-0.002973418,-0.03179081,0.05333923,0.0069890823,0.029705657,-0.006636065,-0.010851094,-0.043813966,0.06986299,0.005572015,-0.04542557,0.010565634,-0.00788804,-0.014337259,-0.032044705,-0.014061872,0.020185016,-0.025045658,0.056488086,0.04857016,0.002322571,-0.051522728,-0.06993448,0.04450765,-0.0024280117]
16	0	2026-03-23 07:52:50.283314	f	<p>Ch├áo mß╗½ng ─æß║┐n vß╗¢i HD88!.</p><p>Qu├╜ Kh├ích L╞░u ├¥: USB V5.0 kh├┤ng d├ánh cho c├íc loß║íi m├íy t├¡nh ─æang tß║»t chß║┐ ─æß╗Ö Update windown. Khi Sß╗¡ Dß╗Ñng USB m├á kh├┤ng kß║┐t nß╗æi ─æ╞░ß╗úc l├á lß╗ùi 99% do M├íy t├¡nh cß╗ºa Qu├╜ Kh├ích kh├┤ng tß╗▒ ─æß╗Öng cß║¡p nhß║¡t Driver. Qu├╜ kh├ích h├úy c├ái driver USB cho m├íy t├¡nh Win7 ( Win10 bß╗ï lß╗ùi c┼⌐ng c├│ thß╗â c├ái lß║íi)</p><p>Tß║úi driver c├ái ─æß║╖t cho usb:</p><p>Mong Qu├╜ Kh├ích l╞░u ├╜ tr╞░ß╗¢c khi phß║ún hß╗ôi ─æ├ính gi├í sß║ún phß║⌐m ß║í!!!</p><p>Mß╗ìi thß║»c mß║»c. Chß╗ë cß║ºn Ch├ít vß╗¢i ch├║ng t├┤i. ≡ƒî╣≡ƒÿè</p><p>===================================</p><p>≡ƒìÇ πÇèBß║ín h├úy ─æß╗ìc M├┤ Tß║ú Sß║ún Phß║⌐m Tr╞░ß╗¢c Khi ─Éß║╖t H├áng nh├⌐ ! πÇï ≡ƒìÇ</p><p>USB Bluetooth Dongle 5.0 gi├║p m├íy t├¡nh b├án, m├íy t├¡nh c├óy, Laptop thu ph├ít s├│ng bluetooth - HD88</p><p>M├┤ tß║ú sp: Kß║┐t nß╗æi truyß╗ün dß╗» liß╗çu kh├┤ng d├óy giß╗»a M├íy t├¡nh v├á c├íc thiß║┐t bß╗ï hß╗ù trß╗ú Bluetooth</p><p>D├╣ng kß║┐t nß╗æi ─æ╞░ß╗úc vß╗¢i m├íy in, Tay game, M├íy PS, Xbook, loa. tai nghe  ... v├á nhiß╗üu thiß║┐t bß╗ï kh├íc c├│ hß╗ù trß╗ú</p><p>USB Bluetooth V5.0 n├áy cho ph├⌐p kß║┐t nß╗æi dß╗» liß╗çu kh├┤ng d├óy giß╗»a m├íy t├¡nh v├á c├íc thiß║┐t bß╗ï c├│ hß╗ù trß╗ú Bluetooth, ─æiß╗çn thoß║íi di ─æß╗Öng, c├íc thiß║┐t bß╗ï Kß╗╣ thuß║¡t sß╗æ c├í nh├ón, v├á c├íc thi├¬t bß╗ï kh├íc c├│ thß╗â kß║┐t nß╗æi kh├┤ng d├óy vß╗¢i m├íy t├¡nh cß╗ºa bß║ín.</p><p><br></p><p>C├íc thiß║┐t bß╗ï c├│ thß╗â kß║┐t nß╗æi vß╗¢i nhau trong phß║ím vi tß╗æi ─æa 10m. ( kh├┤ng c├│ r├áo cß║ún)</p><p>,,,</p><p>Kß║┐t nß╗æi nhanh h╞ín so vß╗¢i c├íc thiß║┐t bß╗ï USB Bluetooth tr╞░ß╗¢c ─æ├│.</p><p><br></p><p>D├╣ng cho m├íy t├¡nh , laptop kh├┤ng c├│ Bluetooth hoß║╖c c├│ nh╞░ng bß╗ï lß╗ùi. Kß║┐t nß╗æi USB tiß╗çn lß╗úi.</p><p>≡ƒÄÇPhß║ún hß╗ôi</p><p>ΓåÆ Phß║ún hß╗ôi cß╗ºa bß║ín l├á rß║Ñt quan trß╗ìng ─æß╗æi vß╗¢i ch├║ng t├┤i. Xin vui l├▓ng d├ánh mß╗Öt ch├║t thß╗¥i gian ─æß╗â ─æ├ính gi├í cho sß║ún phß║⌐m n├áy 5 sao phß║ún hß╗ôi, nß║┐u bß║ín h├ái l├▓ng vß╗¢i sß║ún phß║⌐m hoß║╖c dß╗ïch vß╗Ñ cß╗ºa ch├║ng t├┤i, cß║úm ╞ín bß║ín rß║Ñt nhiß╗üu !!</p><p>ΓåÆ Xin vui l├▓ng li├¬n hß╗ç vß╗¢i ch├║ng t├┤i tr╞░ß╗¢c khi ─æß╗â lß║íi phß║ún hß╗ôi trung lß║¡p (3 sao) hoß║╖c ti├¬u cß╗▒c (1-2 sao). Ch├║ng t├┤i sß║╜ cung cß║Ñp giß║úi ph├íp cho ─æß║┐n khi bß║ín h├ái l├▓ng vß╗¢i sß║ún phß║⌐m cß╗ºa shop. HD88 Xin tr├ón trong Cß║úm ╞ín bß║ín!</p><p>#usbblutooth cho m├íy t├¡nh b├án</p><p>#usbblutooth cho m├íy t├¡nh c├óy</p><p>#usbblutooth</p><p>#usbblutoothgiare</p><p>#usbblutoothcholaptop</p><p>#usbblutoothchomaycay</p><p>#usbblutoothchomayban</p><p>#usbblutoothchuan</p><p>#usb bluetooth.</p><p>#usbbluetooth</p>	37000.00	{}	37000.00	USB Bluetooth Dongle 5.0 gi├║p m├íy t├¡nh b├án, m├íy t├¡nh c├óy, Laptop thu ph├ít s├│ng bluetooth - HD88 - A001	usb-bluetooth-dongle-50-giup-may-tinh-ban-may-tinh-cay-laptop-thu-phat-song-bluetooth-hd88-a001	{"Gß╗¡i tß╗½": "Thanh H├│a", "T├¬n tß╗ò chß╗⌐c chß╗ïu tr├ích nhiß╗çm sß║ún xuß║Ñt": "─Éang cß║¡p nhß║¡t", "─Éß╗ïa chß╗ë tß╗ò chß╗⌐c chß╗ïu tr├ích nhiß╗çm sß║ún xuß║Ñt": "─Éang cß║¡p nhß║¡t"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	3	[0.031968594,-0.0030755608,-0.044214968,-0.015807362,0.026089909,-0.03609424,-0.013631064,0.007872331,-0.004373505,0.016054396,0.010777744,0.022769557,0.055124115,0.0329403,-0.022561127,0.0028906518,0.015571881,0.002714069,-0.13556252,-0.0015885999,0.04434504,0.0019902834,0.006705607,0.018574348,-0.039690305,0.008045432,0.006484184,0.010182673,0.017338336,-0.06343059,0.022981007,0.054690823,-0.03339579,0.02539948,0.014423358,0.008937715,-0.025784025,0.061395198,0.013388483,-0.09117016,-0.04118713,0.03353992,0.015221877,0.056902464,-0.024491703,0.0016463556,0.0516672,0.035855502,-0.031983156,-0.034421124,0.027714364,-0.0015082533,-0.039130565,0.026288513,-0.067261845,0.024174612,-0.0761832,-0.031667497,-0.012430828,-0.023340335,-0.031275842,-0.0058647604,0.015254166,-0.035218284,-0.03872231,-0.0010183445,-0.022838501,-0.03419948,0.012455544,-0.0029820444,-0.04743978,0.00025169994,-0.044974256,0.010762745,0.017906377,-0.0012260725,0.016495084,-0.07242696,-0.00945617,0.0338663,-0.06641114,-0.003887532,0.036094207,0.081473485,-0.014644698,-0.008802282,0.021443572,-0.07792541,-0.037111267,0.012991469,0.042563718,-0.0017414811,0.031154828,-0.032278232,0.028851334,-0.0043996456,-0.12171348,-0.099041246,0.069556095,0.019641016,0.029059349,-0.02094815,0.014178708,-0.125269,0.04926366,0.0048350533,0.005141372,-0.027025731,-0.028648289,0.021164421,-0.014235301,-0.027518034,0.024897445,-0.0012033496,0.0139777865,-0.0046210475,-0.06286639,0.0215004,-0.021832274,0.0022405053,0.013676199,0.061760254,-0.03185925,0.05051667,0.013934487,0.0124496,0.05260458,-0.03051437,-0.017360166,-0.03425326,0.020560384,-0.072622746,-0.07923916,0.014611975,-0.06485649,-0.045037895,0.03126497,0.009951151,0.061772544,0.00639983,0.009275014,-0.052934255,-0.023491316,0.014215129,-0.014620081,-0.013568794,-0.031284362,0.03849924,-0.061186552,-0.0060716183,-0.028319836,-0.03343351,-0.021782806,-0.010093695,0.005267254,-0.01502124,0.04850837,-0.023850337,0.05107834,0.04823243,0.036827914,-0.015597281,-0.0034416472,0.012080029,-0.031575486,0.018484773,-0.026308903,-0.085749954,0.026522476,0.057987504,0.012754359,-0.06397041,-0.004835176,-0.07281174,0.009370118,-0.016045686,-0.012218547,-0.053806487,0.016878724,0.047090363,0.092323594,-0.005315829,0.014242139,-0.051595185,0.041146,-0.011028597,-0.0041981474,0.0010130359,0.07861127,0.033316243,-0.010603559,-0.007927049,0.021193681,0.029198533,-0.015243277,-0.044796746,0.033476956,-0.0033671327,0.023459554,-0.049749564,0.036353577,-0.0027902091,-0.017137906,-0.05251078,-0.030746646,0.027211716,-0.07281937,0.008130858,-0.01789316,0.011108877,0.017014481,0.0053321254,0.007749448,-0.04378773,-0.021561977,-0.0215237,0.06575481,-0.03309458,-0.015658705,-0.023022844,0.06443848,0.0126406355,0.028429676,0.04112694,0.03842895,0.056135014,-0.009271064,-0.007826436,-0.016475925,-0.044858456,-0.020135244,0.005415593,-0.02277465,0.03092093,-0.018991929,0.049049605,0.0627607,0.026288228,-0.0012509578,-0.0068591074,0.0069133453,0.07295932,0.08472834,0.017042547,0.021454625,-0.043210845,0.017148398,0.04626046,-0.006581562,-0.017329618,-0.03720615,-0.0151629625,-0.025395554,0.0033907285,-0.027541768,-0.025991663,0.014269673,0.010506878,0.0051012756,-0.022029933,0.0849212,0.019483985,-0.02703507,-0.06925109,0.0004818564,-0.055928603,-0.06839061,-0.013607738,0.061454307,0.006870692,0.004494103,-0.098153315,-0.015443662,0.0034253662,-0.018852511,-0.050679397,-0.004550821,-0.027890584,-0.028825305,-0.08520105,-0.00053131295,0.017359382,-0.030194366,0.028208014,0.003554733,-0.08907072,-0.020868467,0.025330631,-0.021700485,-0.020819755,-0.00024418024,0.07847171,0.023886168,-0.024497237,0.041047253,0.035459742,-0.04171296,-0.004634549,-0.010717657,-0.011729742,-0.007368804,0.067529194,-0.033459287,-0.022891227,-0.014139066,-0.005806922,-0.0148986755,-0.05408031,0.025014628,-0.049991276,0.028911546,0.035826765,-0.060135372,-0.03323376,0.001979556,0.01101722,-0.13368943,0.014274934,0.031067608,0.017333038,0.074869365,0.033991426,-0.008228541,-0.021796094,-0.00586607,-0.031028967,-0.0063563557,-0.05751681,0.006824022,-0.03393359,0.02694561,0.034181744,-0.010360862,-0.004699825,0.03851208,0.046424005,-0.049559873,0.05020737,0.030171627,0.07411822,-0.019649321,0.04022053,0.024606224,0.017653717,-0.04758452,-0.07729692,0.0034426788,0.019000083,-0.020291027,-0.018567784,0.013422832,0.018263193,-0.002226089,-0.013507154,0.027683275,0.011552892,0.04682325,0.03440338,-0.0067388746,-0.049589224,0.0038737706,0.011415123,-0.04118208,0.06333285,0.049866546,-0.037106022,0.035527732,0.033486616,-0.04069241,-0.029422358,-0.036385357,0.057943754,0.01673546,-0.034421694,0.028310947,-0.0052054883,-0.039356373,-0.016453067,0.05885013,0.033794336,-0.02591226,-0.018688722,0.035192616,-0.007645477,0.0075335484,0.05838194,-0.09356145,-0.024717793,-0.038970143,0.020548312,-0.044295967,0.043779366,-0.0001175481,-0.013845208,-0.04989753,-0.0009386189,-0.015436967,0.0035162205,0.00072246965,0.046090633,-0.034053683,-0.028177138,0.05897119,-0.052403707,-0.048956376,0.0053996425,0.017762741,0.027836647,0.01782551,0.08629397,0.009978656,-0.02215547,0.059794128,-0.0177385,-0.018898467,-0.042433247,0.055719137,-0.027852695,0.008788432,-0.032491002,-0.002780069,0.060582977,0.026497303,0.034232743,-0.0053303028,0.013419593,-0.0026736716,0.017742673,-0.018922046,0.0366055,0.032420833,0.05956213,-0.015712688,-0.008887632,-0.05636252,-0.0020105198,0.023822006,0.041136567,-0.016348748,0.055418838,-0.025733313,-0.012744349,0.04557628,0.032119937,-0.048050944,0.030592306,0.07024515,0.0049078553,-0.041487057,-0.025831044,0.05098265,-0.03526893,0.037964866,-0.035574168,-0.022015112,-0.02591964,0.018715838,0.06711189,-0.021070268,-0.008414025,-0.051983774,-0.0030927402,0.052702356,0.021548687,-0.063286096,-0.014712652,-0.017597772,-0.039522257,0.028903367,0.05590142,0.047763985,7.054486e-05,-0.0069408147,0.017416025,-0.0010951724,-0.017465832,-0.0102531,0.06995583,-0.015081939,-0.016160885,0.005847748,0.027135521,0.0195903,0.052495245,0.04706706,-0.013275618,-0.035640113,0.03996215,-0.004518524,0.058089983,0.026486753,0.09758679,0.053406876,-0.05006316,0.010029782,0.03260687,0.0674773,0.0033285997,-0.04266423,0.028659398,0.009916862,0.007426552,-0.014903562,-0.0052779242,-0.0036776061,0.045375258,-0.086053595,0.0032201733,0.03499569,0.01654915,0.014679037,-0.001670138,0.0440353,0.037660595,0.005778954,0.044344313,-0.025366297,0.0064482847,0.04417516,-0.010356096,-0.008215425,0.017235417,-0.041176233,0.01259482,-0.019567395,-0.041249685,0.017145265,0.029654289,0.003864049,-0.03457675,-0.07551931,0.08572621,0.080501266,0.044055093,-0.013086151,0.051876217,0.0049321316,0.010686173,-0.0046569435,0.005358381,-0.003243363,-0.01891641,-0.018526178,-0.010072689,-0.011954093,-0.0010100508,-0.020628834,0.022344366,-0.018285688,0.0863044,-0.012430705,-0.020988937,-0.010083672,0.034590866,0.017366467,0.029460361,0.015649423,0.007716181,-0.0699961,0.018002005,0.012070814,0.0118630845,0.0018151503,-0.002970165,-0.033325303,-0.00032307586,0.010067568,-0.0054616295,-0.017614998,-0.013962567,-0.031097485,0.0075519597,-0.048514277,-0.008053925,0.00010712771,-0.05586923,-0.040588282,0.007432498,0.037693787,0.0034671342,0.014555512,0.036591403,0.030099705,-0.030798893,-0.004845247,0.029607855,-0.00519949,-0.028201574,0.010403302,0.007104373,-0.009861341,-0.044518795,-0.034656588,-0.025261309,0.010592531,-0.057953257,0.008726196,0.016892232,-0.0007582269,0.007740946,-0.030248368,0.00024739915,0.037214596,0.009056325,-0.012381161,-0.025791833,-0.0010925913,-0.0727317,0.015161604,-0.02129856,-0.004262023,0.010484046,0.040775217,-0.046753623,-0.03525948,-0.0059247334,-0.0068979785,0.009039387,0.011050794,0.04404493,0.010541439,0.013569753,0.031171734,-0.009440863,-0.05449013,0.0462848,0.021089086,-0.019129036,0.010327384,0.027230907,0.03776311,0.0043147085,-0.00749925,-0.022225386,-0.011971718,0.026485227,0.005427948,0.019525167,-0.026709527,-0.076970175,0.0070593623,0.03483719,0.045943003,-0.04089644,-0.05814227,-0.004049475,0.014598141,-0.02760173,-0.00025967803,0.02050819,-0.008839356,0.06789417,-0.064800695,-0.028350329,-0.038609058,0.026733277,0.009107621,0.02621867,0.034444187,0.027529268,-0.021134285,-0.0500295,0.008814984,0.011256202,0.04789634,-0.04804851,-0.042525396,0.022885645,0.055822406,-0.036388498,0.0066120564,0.056044593,-0.008870396,0.0081381,0.0025296954,0.01963269,0.003149031,-0.028295392,-0.048212625,-0.013256286,0.021667145,-0.031648636,-0.0038367894,-0.01564145,0.014155297,0.015275726,-0.013219814,-0.00124711,0.019315744,0.03225813,0.028412849,-0.018213933,0.006947327,0.038947295,-0.0027809693,0.026906243,0.01046593,0.020417638,-0.041345533,0.0048028734,-0.0076329885,0.030046534,-0.024862655,-0.09017,-0.009568529,0.0073784646,0.02345736,0.009716685,-0.034349367,0.011610774,-0.011519312,-0.0005526749,0.06284169,-0.013986112,-0.00127872,-0.02630693,0.046197586,-0.009900811,-0.014522545,0.06525093,-0.030074334,-0.01851997,0.006199356,0.074489415,0.04302801,0.016123349,-0.08006482,0.015379977,-0.010315651,0.048743222,0.056526635,-0.023845918,-0.0026312568,0.022354651,-0.062761314,-0.03976921,0.0001385554,-0.03089713,-0.025485555,-0.027473211,0.05139526,0.017509371,-0.031338584,-0.0063282093,-0.0084621655,0.036785144,0.006305339,0.015425744,-0.006095044,-0.04708082,-0.03434776,0.056519967,0.05796909,0.005123851,0.02512092,-0.036313158,-0.030652551,-0.017170988,0.011482241,0.047062784,0.00093965756,-0.028492285,0.026307696,0.052280523,-0.10354192,0.011499705,0.036697112,-0.0054560574]
24	0	2026-03-23 08:37:08.060313	f	\N	4320000.00	{}	4320000.00	─Éß╗ông Hß╗ô Nam Movado Museum Classic 0607200 Quartz 40mm - ─Éß╗ông Hß╗ô T├ón T├ón	dong-ho-nam-movado-museum-classic-0607200-quartz-40mm-dong-ho-tan-tan	{"Loß║íi bß║úo h├ánh": " Bß║úo h├ánh nh├á cung cß║Ñp", "Mß║╖t ─æß╗ông hß╗ô": "Kim", "Kiß╗âu ─æß╗ông hß╗ô": " Thß╗¥i trang"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	107	6	[0.011473464,0.021763211,0.008802714,0.0020134489,0.029351864,0.013471349,0.018967431,0.011182101,-0.038947977,0.04521479,-0.022073383,0.02748302,0.060604364,0.020079333,0.0111395065,-0.03878511,-0.007001046,0.025463063,-0.119489945,0.0078047947,0.005980309,0.015492733,0.051040355,0.025813775,0.029633168,-0.030380068,-0.011333112,0.031138327,0.03248276,-0.032253742,-0.004856192,0.05838526,-0.03748891,-0.02086287,0.004455064,0.029479673,0.036588144,0.051740486,0.00829044,-0.04200992,-0.03709398,0.048585754,0.042008962,0.030182544,-0.046954025,0.0135654155,-0.0011818472,0.0071134493,-0.0023772418,0.036488477,0.05178422,0.08203373,-0.021820018,0.005391737,-0.020710506,0.02682354,-0.010048678,-0.037873425,-0.011511417,-0.017067855,0.028022105,0.0032516404,0.014994675,0.019066565,-0.033449106,-0.036126588,0.011561698,-0.039784487,-0.040928323,0.019824775,-0.02408444,-0.011545223,-0.009262832,0.027215071,0.03110864,-0.10286352,-0.017794257,0.018917741,0.0012492159,0.041512746,-0.029293379,0.009904937,0.076952055,0.03969993,0.057126526,-0.0068110144,0.020186696,-0.0794024,-0.0475708,0.018218627,0.08106799,-0.004728973,0.010853135,-0.02491671,0.0667745,-0.045047037,-0.056350954,-0.15404744,0.09523777,0.030987037,0.024963275,0.023201745,-0.0060588825,-0.08005271,0.0010573701,-0.018107185,0.008594014,-0.007582212,-0.037272237,-0.006378889,-0.07999185,-0.03587441,0.061429694,-0.043571446,-0.0062585305,-0.034895968,-0.023455594,0.008071333,-0.0041162265,0.04713376,-0.031490017,-0.007914759,-0.037689783,0.05680088,-0.0040308973,-0.026209055,0.0052574277,-0.01450194,0.002330402,-0.042897947,0.008131454,-0.10017936,-0.021256993,0.010024814,-0.004301603,0.01593654,0.044271734,0.012612701,0.00069740275,0.027378222,0.018220875,-0.046589877,0.007872645,0.0327143,-0.06592789,0.01868902,-0.024662083,0.004163486,-0.1061553,-0.013958992,0.0077416124,-0.058769893,0.015792504,-0.011664446,0.00795595,-0.0074167745,0.0028837062,0.0004515047,0.06216188,0.025203492,-0.011531765,-0.050017916,0.086240575,0.037839655,-0.02196146,0.06399907,0.018651038,-0.016768098,0.042822674,-0.025205392,-0.020622816,-0.060860593,-0.004303897,-0.09219494,-0.012532283,-0.037131242,-0.05309256,-0.029263437,0.014993746,0.065227516,0.09045454,0.0020279696,-0.01353073,-0.019319795,0.0047612856,-0.017929414,-0.011033423,0.00623133,0.03775693,0.04758068,0.0071919034,0.009271272,0.0033163298,0.029608304,0.016351476,-0.051052973,0.029386964,-0.046127822,0.041559067,-0.022036504,0.014491262,-0.0053037293,-0.00079628895,-0.027154403,-0.03215939,0.033672582,-0.066154145,-0.011927556,-0.006436156,-0.036039624,0.02673968,0.034930598,0.034452304,-0.042531118,-0.015422694,-0.021691283,0.0504871,0.05588898,0.015616683,-0.04670986,0.0036710682,-0.015621573,0.03306678,0.02642624,0.032143723,0.008714865,-0.054486174,0.0089444155,0.016437344,-0.059659388,-0.0062715006,0.03107857,0.01595476,0.015342182,-0.019871993,0.03442375,0.0070522637,-0.017920502,0.023600642,0.001125939,0.04509256,0.056766093,0.07234311,0.045482397,0.046155613,-0.04331153,0.099574044,0.023322657,0.025521949,-0.035410017,-0.04748747,-0.018584566,0.048117448,-0.035855044,-0.06706761,-0.08210777,0.019137066,-0.035937544,-0.005690512,0.03114834,0.04352367,0.035847336,-0.032999534,-0.04990377,-0.02136414,-0.0741368,-0.04289604,-0.04927838,0.0086020315,-0.018888503,0.01523762,-0.050229397,0.019903831,-0.0069727222,-0.029831102,0.0013350672,-0.014727113,0.01386691,-0.029603258,-0.04740017,0.05052682,0.030931005,-0.00646189,0.02933009,-0.018488836,-0.03160719,0.035017874,0.017546866,-0.020407656,0.0065476634,0.006838182,0.043672685,0.019291999,0.0040969374,0.009673132,-0.014112624,0.006857252,0.009953932,0.04539574,0.010854334,-0.046669252,0.078002736,-0.0285006,-0.018689005,0.047211144,-0.006078246,0.018132975,-0.00062218943,-0.057267986,-0.023567637,0.021505391,0.012538613,-0.024996195,-0.07734869,-0.0321812,-0.0365874,-0.14093855,0.0049249684,-0.018632561,-0.022181496,0.03488218,0.0064831255,-0.014490223,0.03441674,-0.0077865976,0.0119942585,-0.015487203,-0.016527928,-0.013809979,-0.014363951,0.04501125,-0.018729137,-0.011683104,-0.036229923,0.016676974,0.047049023,-0.08283138,0.037973225,0.029631196,0.0856905,0.04936305,0.0433196,0.013497303,0.043713197,-0.06092205,-0.05455477,0.037890658,0.039823517,0.010144042,0.0557019,0.06527686,0.07378768,0.009581973,-0.010144032,0.007752754,-0.0014341816,0.042747032,0.04234361,-0.004939741,-0.024788402,-0.0226184,0.027658995,-0.028082417,0.0050989604,-0.008604932,-0.01879885,0.020109542,0.053342856,-0.026059808,-0.051929783,-0.007458283,0.0041794814,-0.042387348,-0.015394476,0.020740686,-0.01265462,-0.0062689516,0.038611386,-0.008326549,0.014680442,-0.031496845,-0.026307127,-0.026714293,0.036776144,0.030450454,0.042008284,-0.06892381,-0.022149876,-0.043341707,-0.0020945698,-0.036429644,0.0042930427,0.038128812,0.017567994,-0.012292085,0.07649211,-0.045073044,0.04764497,0.013574357,0.0033353046,0.0056756586,-0.03752772,0.049629636,-0.08546595,-0.02697036,0.013921223,0.036671,0.00014433384,-0.014005958,-0.0050029526,-0.010484271,-0.02410258,-0.04567061,-0.0055672443,-0.046453793,0.01003755,-0.007747063,0.0074413423,-0.015363698,0.025731508,-0.019668499,0.08041839,0.045385506,0.022225212,0.049115527,-0.009660695,0.057320427,0.012695627,-0.01974419,-0.006079809,0.010401483,-0.018308718,-0.05843146,0.05900029,0.027244585,0.00692286,0.043780964,0.021066831,-0.04371147,-0.01354885,0.022145223,-0.048087858,0.07116261,-0.021389574,-0.011464841,0.03671055,0.0822437,0.022224022,-0.045503296,-0.007525359,0.008330873,0.0003367669,0.011990337,-0.007935216,-0.03405849,0.0173838,-0.013179078,0.037362635,0.045083754,0.024353107,-0.016539078,-0.054113306,0.0037100427,0.048005167,-0.038133483,-0.004684102,0.0012124806,-0.008087116,-0.025326025,0.049868744,0.092843376,-0.029965302,0.03340996,-0.0077926214,0.0038714798,0.033740498,0.028078234,0.0011509114,-0.055640455,0.050011568,0.015483577,-0.0069670067,-0.0036735004,0.030362925,-0.0027905677,-0.014941245,-0.0024432477,-0.010375594,-0.042531174,0.06303762,0.018882675,0.07982598,0.004733074,-0.07840272,-0.0069225403,0.03313207,0.029758044,-0.019668214,-0.0061717955,0.06539744,0.10236508,0.04332891,-0.033559386,-0.035686966,-0.018867817,0.092352755,-0.040180024,-0.019528959,0.07813514,0.009503809,0.046563223,0.024788339,-0.010636579,0.007733795,0.008703013,-0.012104582,-0.022692217,0.031248273,0.001483938,0.04617763,0.056788888,-0.004573436,-0.0046167225,0.027987108,-0.013097437,0.0099579515,0.033564813,0.011133814,0.031244887,-0.0071787033,-0.0328582,0.033222683,0.032951742,0.044441927,0.014918286,0.049125716,0.022506615,-0.004222302,0.03172113,-0.012244526,-0.004648127,-0.024837371,-0.056870025,0.021682851,0.019319994,0.009722507,-0.016992815,0.01621385,-0.0023452514,0.042597912,-0.007155103,0.011449212,-0.038850714,-0.03412071,-0.013802236,0.0005535807,0.011539317,-0.07620828,-0.040882375,-0.035358813,-0.03654226,0.021054776,0.012078117,0.038295384,0.01829789,-0.014907991,0.042097405,0.11215467,-0.012529404,0.01249497,0.024975788,0.035529394,0.046309438,-0.04526437,0.052525558,-0.03651186,-0.05425485,0.0047439705,0.047690105,-0.021078598,0.00468836,0.02699362,0.021453321,0.021496838,0.03244012,-0.03331305,0.015146008,-0.050787702,-0.012217763,0.023207411,0.005662388,0.044142384,0.017695144,-0.024232455,-0.020089675,-0.021484863,0.017411688,-0.0059291488,-0.01289969,-0.008327724,0.0008080816,0.028457128,0.013789819,0.018041745,0.04022097,-0.037839316,-0.02242955,-0.058248125,0.03035286,0.0011140316,0.0028051853,0.019221444,-0.019216787,-0.03956401,0.019122453,-0.0010143192,0.018582562,-0.0002672814,0.015465035,0.013326539,0.0106086945,-0.005654917,0.011918609,-0.033227913,-0.07706255,0.027363354,0.011481095,-0.014073238,-0.039975926,0.0067676418,0.012701307,0.004087021,-0.048515238,-0.03097511,-0.029117554,0.064604156,-0.0075917775,-0.029794602,0.031803593,-0.04332813,-0.0022573713,0.0075085615,0.08256876,0.0020860145,0.0030496053,0.035223253,0.031139622,0.026055638,0.03835308,-0.0073961974,0.06170132,0.022826415,-0.0398489,-0.010473288,-0.009077654,0.050061468,-0.05606659,-0.015851943,-0.022674995,0.051570754,-0.006477366,0.0027219,-0.023160767,0.013916209,-0.0038312802,0.015479078,-0.018165309,0.013212247,0.025139276,-0.052428465,-0.0027839022,-0.042350255,-0.007225608,0.019167459,-0.015474286,0.033832755,-0.005289801,0.026903147,-0.0052660774,-0.029386362,0.019260658,-0.036721904,0.03786449,-0.023346227,-0.019593561,-0.017509416,-0.02201363,-0.00904856,0.01711528,0.0039498797,-0.018112484,-0.0072515686,-0.00053525757,0.04835256,0.030111318,0.015190453,0.023069052,0.023698775,-0.03911215,-0.0015431055,0.010444494,-0.018174894,-0.03297003,-0.04387842,-0.0212734,-0.04392096,0.023994826,-0.018746547,-0.02133947,-0.024238063,-0.02543762,-0.007937634,0.093324065,-0.017548941,-0.011011258,0.029355757,0.033801716,-0.042164613,0.010073364,0.06456116,0.0065324074,-0.008919729,0.004641052,0.026604112,0.053434264,-0.0133991605,-0.04183546,0.01569006,-0.026210837,0.043863576,0.08240589,0.007767457,-0.038528092,-0.00703612,-0.056760453,-0.0025442452,-0.043665394,-0.08087306,-0.03570481,0.0014488476,0.06597794,-0.0013643017,-0.08579743,0.01738409,-0.039570834,0.020054417,-0.039766125,0.01943134,-0.040969502,-0.039470002,-0.05233914,0.033468366,-0.006998322,-0.0337069,0.0023662213,-0.034524713,-0.020303244,0.023990417,0.013909697,0.02347601,-0.014825379,0.011274645,0.05285785,-0.0023787448,-0.012748447,0.0014971483,0.01194048,-0.053142194]
26	0	2026-03-23 08:41:43.375395	f	\N	3000000.00	{}	3000000.00	─Éß╗ông hß╗ô c╞í nam Orient Watch Sun And Moon RA-AS000 lß╗Ö m├íy mß║╖t k├¡nh sapphire chß╗æng x╞░ß╗¢c d├óy th├⌐p ─æeo tay ch├¡nh h├úng	dong-ho-co-nam-orient-watch-sun-and-moon-raas000-lo-may-mat-kinh-sapphire-chong-xuoc-day-thep-deo-tay-chinh-hang	{"Mß║╖t ─æß╗ông hß╗ô": "Kim", "Kiß╗âu ─æß╗ông hß╗ô": " C├┤ng viß╗çc, Thß╗¥i trang, Thß╗â thao", "─Éß╗ông hß╗ô ─æeo tay": " Tß╗▒ ─æß╗Öng"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	107	6	[0.026036957,0.03947529,0.017647786,-0.035748713,0.042819615,0.05205972,0.016151132,-0.009245379,-0.021912087,0.040743884,-0.04968181,0.03411703,0.054157257,0.012030145,-0.0072669443,-0.028332466,-0.014094065,0.013125174,-0.12453019,0.036864683,-0.019053226,-0.009591631,0.03471317,0.0072203097,0.034129266,-0.01393008,-0.020866593,0.057436857,-0.009673213,-0.05813147,-0.04828257,0.054030873,-0.023130935,-0.001341305,0.0011122745,0.045350347,-0.0030946205,0.029982015,-0.019021194,-0.038183693,-0.060102373,0.08124397,0.021820083,0.026780628,-0.0041244254,-0.04931887,-0.044938095,0.05334174,-0.04918216,0.00801834,0.031699494,-0.015219295,-0.0535271,0.013270112,-0.033499114,-0.030321889,-0.019065687,-0.0131747825,0.0018529014,-0.0044377837,0.018708112,0.021216126,0.042138543,-0.008115671,-0.020171782,-0.037014525,0.015950354,-0.027231429,-0.049825754,0.050561737,0.0055849697,-0.0147002665,-0.018716456,0.042800937,0.0640002,-0.049612883,-0.022014435,0.046901993,0.006159333,0.03652521,0.006122044,0.0065299147,0.07945742,0.021232057,0.09789006,-0.0504455,0.021465788,-0.05171331,-0.060452666,0.0020022066,0.032718804,-0.0024746798,-0.0010280506,-0.00956397,0.029205795,0.012303587,-0.048517343,-0.14388491,0.104256414,0.011510654,0.013713501,0.0067793136,0.020633062,-0.02597513,0.0161961,0.020813223,0.004771799,0.012576712,-0.023453588,-0.032305345,-0.086988665,-0.025758354,0.060296297,-0.018500062,-0.028886735,-0.0035595633,-0.0028807332,0.0073437304,-0.022686599,0.08195307,0.021929218,-0.044444185,-0.058075573,0.060103737,0.023986874,-0.016542958,-0.017596172,0.04412115,-0.011583826,-0.03221864,0.011200725,-0.080382,-0.045741316,0.0140391905,-0.015776534,-0.024792377,0.06448719,-0.040510368,0.014103089,0.0054814015,-0.006241632,-0.0477604,-0.04205873,0.0127015645,-0.03557242,0.023000216,-0.049570873,0.0018908611,-0.054210406,-0.011819752,-0.011842473,-0.037214406,0.015253556,-0.043219995,0.032276917,-0.02043036,-0.0038214864,-0.016744748,0.039611876,-0.004335438,0.038312208,0.005204669,0.07871366,0.017054345,-0.035690878,0.020284286,0.00884958,-0.06808192,0.0025393,0.03105936,-0.02824557,-0.05854901,-0.015104517,-0.11790236,-0.0046540885,-0.038445823,-0.04983605,-0.021931326,-0.0642736,0.04753839,0.07089189,0.026277823,-0.009485453,-0.035813183,0.004618905,0.0065948414,0.016669853,0.023197813,0.03907988,0.030047845,-0.02278804,0.0029206662,-0.041868,0.035294257,-0.012031996,-0.046031136,0.048056062,-0.018340286,0.029855438,-0.05376317,-0.0083786445,0.0014400418,-0.016915498,-0.0020000138,-0.03148404,0.02341825,-0.062643744,-0.05148971,-0.007342886,0.022093331,0.07101274,0.06195599,-0.009746601,-0.03276851,-0.033086892,-0.0035772005,0.056264486,0.07907498,0.0038220712,-0.075412884,0.008343141,-0.015663903,0.029091123,0.015112439,0.041840818,0.0066996715,-0.019384475,0.024719695,0.0234722,-0.009953667,-0.00694388,0.040969517,-0.008798078,0.033456907,-0.045614704,0.038572382,0.039775595,-0.054124057,-0.0049281237,-0.006505681,0.04818625,0.0008959865,0.07007091,0.010321875,0.02001106,-0.08784769,0.09203093,0.044279747,0.034854535,-0.051555984,-0.031214142,-0.041240323,0.040638655,-0.019167004,-0.06468564,-0.055843093,0.012339636,-0.029673174,-0.0243276,0.008036439,0.03550484,0.016524332,0.012979483,-0.05220972,-0.065444745,-0.067822404,0.034261163,-0.03393574,0.0074305185,0.0018790246,-0.019083893,0.00087673427,-0.019275138,0.015847538,0.0063913534,0.014114081,-0.028647978,-0.018131875,-0.017196052,-0.07795311,0.045525726,0.038564328,-0.028579045,0.023741318,0.028050492,-0.05277689,0.018249597,0.018233022,-0.025124365,0.027767347,0.01168181,0.050394922,0.029739138,-0.0224775,0.044688754,-0.009075911,-0.03926516,0.039554395,0.013396398,0.009297003,-0.005951472,0.056139685,-0.060021687,0.020619249,-0.0011184538,0.013318599,0.06275024,-0.008420192,-0.05318031,-0.053635824,0.0275956,0.033703044,-0.0061448286,-0.08897701,-0.0030732914,-0.024808493,-0.098505944,-0.027356515,-0.00905415,-0.018649433,0.04431218,0.0031082158,-0.019603822,0.0394035,0.018127158,0.014821332,-0.047858123,0.009772098,-0.0059624305,-0.008235336,0.02769957,-0.0063099824,-0.06620712,-0.064380564,0.01931681,0.032513984,-0.051599592,0.010098296,0.02556389,0.054222178,0.03436613,-0.00521923,0.028644027,0.023030864,-0.0635171,-0.013054668,0.0113274,-0.00035505378,0.025662363,0.031827334,0.0333732,0.03816954,0.0025438983,-0.03660673,-0.005240695,-0.024978785,0.03529628,0.009385468,-0.010374253,-0.06394366,-0.023163246,0.083477706,0.00048389894,-0.0069607,0.007343535,-0.058333926,0.021106442,0.030021157,-0.048758857,-0.024921887,-0.039353315,0.018208882,-0.024406759,0.0061750063,-0.007549278,0.004935819,0.00054985203,0.016449966,-0.021080889,-0.011332639,-0.0030898592,-0.030691098,-0.0025607143,0.015572917,-0.015088574,0.03471883,-0.05929747,-0.021643315,-0.06170115,-0.009851738,-0.045713708,0.00017566438,0.03446571,0.007174858,-0.015191432,0.10459642,-0.01798735,0.056733567,0.044122677,0.010951329,-0.007211544,0.01198699,0.068647385,-0.057768773,0.0059325714,-0.005838528,0.03705107,-0.005360722,0.009025025,-0.011542676,0.011803758,0.0145212235,-0.023939295,0.00046170346,-0.07874871,-0.03219574,0.042926796,-0.008017806,0.04951384,0.04299286,0.011428775,0.06346235,-0.0044386983,0.0012888785,0.043596234,-0.005859489,0.04047016,0.03481424,-0.041076764,0.031117,0.03605414,0.007494127,-0.04725146,0.040693477,-0.0017701437,0.0016873054,0.027972499,0.0031059159,-0.0346726,-0.03874581,-0.019918524,-0.029076416,0.031398177,0.011374358,-0.04786502,0.019279018,0.04150491,0.03544834,-0.06153924,-0.04635011,0.009526398,0.0010446034,0.019773606,-0.0046131173,-0.07133786,0.032474175,0.015202999,0.045567002,0.029756987,-0.0063170926,-0.0015118032,-0.037105076,-0.008212358,0.010223797,-0.027173635,-0.02707123,-0.0028746454,-0.0072101885,-0.04845744,0.05281383,0.096474014,-0.032502957,0.013256424,0.024951413,-0.008458451,0.023839295,-0.015903622,0.019667,-0.059202075,0.05194781,0.041462176,-0.0012392962,0.008759928,0.005985309,0.055712536,-0.026035668,0.017186161,-0.044380218,-0.03708522,0.039856736,-0.008664363,0.062444795,0.019939689,-0.08270235,-0.01769618,0.022866745,0.08637272,-0.0102410875,0.011864474,0.011896747,0.07016507,0.0017056613,0.007987866,-0.031344596,-0.029934488,0.07760139,-0.038535185,-0.015383822,0.03923085,-0.02558987,0.060089923,-0.012281853,0.011361504,-0.013504751,5.50036e-05,-0.019500645,-0.052497182,0.02423073,0.029719125,0.03876452,0.08790159,-0.02198473,0.018320331,0.054199137,0.0056397268,0.0069940193,0.0054350663,0.01666502,0.0298297,-0.01517612,-0.05041852,0.004083251,0.030614499,0.034469966,-0.0059266877,0.026407667,0.01732654,-0.048289947,0.008689675,-0.026458625,0.002398502,-0.017309844,-0.05081767,0.020601252,-0.0023785308,-0.0009698676,-0.025068097,0.04713398,0.006004368,0.056040067,-0.023819597,-0.035913877,-0.07404178,-0.0181912,-0.013282179,-0.00681596,-0.017630512,-0.053266123,-0.0716872,-0.022185408,0.004161219,0.029380571,0.024283167,0.016717514,0.0049035545,-0.037148647,0.03431988,0.069477886,-0.016147213,-0.004785194,0.008375019,0.015753156,-0.009597413,-0.000765963,0.06774935,-0.07758869,-0.007536053,0.0164498,0.043729052,-0.028674422,0.020584302,0.027010597,0.037404444,0.025846267,0.00726523,-0.03459987,-0.029799726,-0.06297107,-0.05304088,0.00024550414,-0.01327704,0.030381234,0.012691753,-0.039260227,0.020275652,-0.00040770552,-0.0015774098,0.009672816,0.0037109442,0.009701691,-0.02409902,-0.011073274,0.005566028,0.04903743,0.046530742,-0.012757372,-0.033926114,-0.060222045,0.024619363,-0.034307737,-0.002896794,0.012939548,-0.073671795,-0.006023208,0.015760455,-0.0012527653,0.00044667238,-0.0022497005,0.0077737947,-0.00957939,-0.015053248,0.015570831,0.025309663,-0.021074118,-0.068843275,0.013076313,0.053913824,-0.0018634124,-0.0077696163,-0.005336305,0.013226484,0.0380259,-0.029809339,-0.019803923,0.0022890004,0.06605757,0.0005834118,-0.031577572,-0.008591091,-0.030311896,0.011187614,0.005733596,0.070405595,-0.03326455,-0.023373561,0.062392585,0.045491055,0.028762864,0.05997443,-0.002632645,0.049250785,0.044903744,-0.040276606,-0.0018429632,-0.012734769,0.017742721,-0.044884436,0.06295088,-0.020300359,0.04446161,-0.01861085,-0.07340553,0.01228131,0.003912657,0.012553337,-0.009991452,-0.016012821,0.009222702,0.070616595,-0.008275527,-0.02953469,-0.04955387,-0.0047365306,0.05835957,-0.035485383,0.05263332,0.009263169,0.01698584,0.027104286,-0.023926748,0.007508027,-0.032527063,0.023039408,-0.049076825,-0.02234907,-0.0014769061,-0.013490349,-0.0204007,-0.0102964435,0.026145883,-0.025253978,0.0004038393,0.010067722,0.037848458,0.0143808555,0.018791746,-0.038695436,0.025211412,-0.019993287,-0.031366408,-0.00014998027,-0.023084233,0.0049259486,-0.036949366,-0.052282024,-0.019465208,0.032068774,-0.025381304,-0.0011120152,0.014930191,-0.06131932,0.040944155,0.03530708,0.024458488,-0.025835697,0.03631757,0.0013164193,-0.04128682,0.00957308,0.020384984,-0.011875102,-0.027912492,0.02552418,0.006768074,0.06589041,-0.042941958,-0.056606106,-0.008252178,-0.006413762,0.06535185,0.025187833,0.004801469,-0.046192657,-0.012006584,-0.03204557,-0.006124823,-0.029537916,-0.08659836,-0.01481935,-0.027755952,0.053165913,0.010732215,-0.088323735,-0.04130529,-0.0027657547,0.024819471,-0.019441947,0.025015088,-0.035676643,0.025548015,-0.05608807,0.035775878,0.0051798513,0.022092493,-0.008037382,-0.025273541,0.0030637092,-0.014107954,0.04256253,0.014202298,-0.030114193,-0.0042322287,0.029081162,-0.010407732,-0.021809326,-0.014149065,0.035836574,-0.028054794]
21	0	2026-03-23 08:22:37.785429	f	<h1>Gi├áy L╞░ß╗¥i Nam Loafer - SP8A51D12-3 ─æ╞░ß╗úc l├ám tß╗½ chß║Ñt liß╗çu da b├▓ cao cß║Ñp, c├│ ─æß╗Ö bß╗ün cao v├á dß╗à d├áng vß╗ç sinh. L├│t gi├áy ─æ╞░ß╗úc thiß║┐t kß║┐ mß╗üm mß║íi, tß║ío sß╗▒ thoß║úi m├íi, ├¬m ├íi cho ng╞░ß╗¥i sß╗¡ dß╗Ñng. Phß║ºn ─æß║┐ gi├áy l├ám tß╗½ cao su ─æ├║c kß║┐t hß╗úp c├╣ng phß║ºn gß╗ù tß║ío n├¬n ─æiß╗âm nhß║Ñn sang trß╗ìng v├á tinh tß║┐. ─Éß║┐ ph├¡p c├│ ─æß╗Ö bß╗ün cao, khß║ú n─âng ma s├ít tß╗æt tß║ío cß║úm gi├íc chß║»c chß║»n trong tß╗½ng b╞░ß╗¢c ─æi.</h1><p>Th╞░╞íng hiß╗çu: Nga</p><p>Giß╗¢i t├¡nh: Nam</p><p>Ph├ón loß║íi: Gi├áy l╞░ß╗¥i</p><p>Chß║Ñt liß╗çu: Da b├▓</p><p>M├áu sß║»c: ─Éen</p><p>─Éß║┐ gi├áy: ─Éß║┐ ph├¡p</p><p>─Éß╗Ö cao: 3cm</p><p>Ph├╣ hß╗úp: Phß╗æi vß╗¢i quß║ºn short, ├ío thun, quß║ºn t├óy, ├ío s╞í mi...</p><p><br></p><p>GIß╗ÜI THIß╗åU Vß╗Ç TH╞»╞áNG HIß╗åU</p><p>L├á th╞░╞íng hiß╗çu gi├áy da cao cß║Ñp ─æß║┐n tß╗½ Nga, MULGATI lu├┤n ─æß║╖t sß╗▒ h├ái l├▓ng cß╗ºa kh├ích h├áng l├¬n h├áng ─æß║ºu, lu├┤n lß║»ng nghe v├á thß║Ñu hiß╗âu ─æß╗â tß║ío ra nhß╗»ng d├▓ng sß║ún phß║⌐m tinh tß║┐ v├á chß║Ñt l╞░ß╗úng nhß║Ñt.</p><p>Tu├ón theo triß║┐t l├╜: ΓÇ£H├úy mang nhß╗»ng giß║Ñc m╞í cß╗ºa bß║ín l├¬n ─æ├┤i ch├ón ─æß╗â dß║½n lß╗æi giß║Ñc m╞í ─æ├│ th├ánh hiß╗çn thß╗▒cΓÇ¥ ΓÇô Roger Vivier. C├íc sß║ún phß║⌐m cß╗ºa MULGATI ─æß╗üu ─æ╞░ß╗úc tuyß╗ân chß╗ìn kß╗╣ l╞░ß╗íng tß╗½ chß║Ñt liß╗çu da b├▓ nhß║¡p khß║⌐u, sß╗¡ dß╗Ñng ph╞░╞íng ph├íp gia c├┤ng ─æß╗Öc ─æ├ío l├á sß╗▒ kß║┐t hß╗úp giß╗»a kß╗╣ thuß║¡t truyß╗ün thß╗æng v├á c├┤ng nghß╗ç hiß╗çn ─æß║íi, nhß║▒m mang ─æß║┐n cho kh├ích h├áng sß╗▒ thoß║úi m├íi, tß╗▒ tin v├á mß║ính mß║╜ h╞ín trong cuß╗Öc sß╗æng.</p><p><br></p><p>H╞»ß╗ÜNG Dß║¬N CHß╗îN SIZE GI├ÇY D├ëP</p><p>1. ─Éß║╖t b├án ch├ón l├¬n tß╗¥ giß║Ñy, sau ─æ├│ d├╣ng b├║t vß║╜ theo khung b├án ch├ón cß╗ºa bß║ín l├¬n tß╗¥ giß║Ñy.</p><p>2. D├╣ng th╞░ß╗¢c ─æo chiß╗üu d├ái b├án ch├ón bß║▒ng khoß║úng c├ích xa nhß║Ñt tß╗½ m┼⌐i ch├ón ─æß║┐n g├│t ch├ón.</p><p>3. Lß║Ñy kß║┐t quß║ú vß╗½a ─æo ─æ╞░ß╗úc so s├ính vß╗¢i bß║úng size ─æß╗â chß╗ìn size gi├áy ph├╣ hß╗úp</p><p>Bß║óNG SIZE</p><p>Size 37: 23.5cm</p><p>Size 38: 24cm</p><p>Size 39: 24,5cm</p><p>Size 40: 25cm</p><p>Size 41: 25,5cm</p><p>Size 42: 26cm</p><p>Size 43: 26,5cm</p><p>Size 44: 27cm</p><p>Size 45: 27,5cm</p><p>Size 46: 28cm</p><p>Size 47: 28,5cm</p><p><br></p><p>CH├ìNH S├üCH ─Éß╗öI H├ÇNG V├Ç Bß║óO H├ÇNH</p><p>- ─Éß╗òi h├áng trong v├▓ng 15 ng├áy c├│ ─æiß╗üu kiß╗çn kß╗â tß╗½ ng├áy mua h├áng.</p><p>- Bß║úo h├ánh miß╗àn ph├¡ 6 th├íng kß╗â tß╗½ ng├áy mua h├áng.</p><p>- Bß║úo d╞░ß╗íng sß║ún phß║⌐m trß╗ìn ─æß╗¥i.</p><p>- Thß╗¥i gian bß║úo h├ánh: 07 ΓÇô 10 ng├áy.</p><p>- ─Éß╗ïa ─æiß╗âm bß║úo h├ánh: c├íc showroom MULGATI tr├¬n to├án quß╗æc.</p><p><br></p><p>#MULGATI #giaytay #giaytaynam #giayda #giaydanam #giayluoi #giayluoinam #giaycuoinam #giaythethao #giaythethaonam #giaysneaker #giaysneakernam #giaycaonam #giaydon #giaydecao #giaydecaonam #giayboots #giaybootsnam #bootsnam #chelseaboots #giayloafer #giayderby #giaybrogues #giaywingtip #giaycongso #giaybigsize #giaymoccasin #moccasin #denimsneaker #slipon #giayslipon #depnam #sandalnam #tongnam #vidanam #leatherwallet #thatlungnam #leatherbelt #clutchnam #giaydaxin #giaydacaocap #giaydadep #giaydabo #giaydichoi #giaydasangtrong #giaycasualnam #giayleather #leather #dabocaocap #giayluxury #giayclassic #giayfashion</p><p></p>	1200000.00	{}	1200000.00	Gi├áy L╞░ß╗¥i Nam MULGATI Penny Loafer - SP8A51D12-3	giay-luoi-nam-mulgati-penny-loafer-sp8a51d123	{"Loß║íi da": " Da B├▓", "Th╞░╞íng hiß╗çu": " MULGATI", "Chiß╗üu rß╗Öng ph├╣ hß╗úp": " Kh├┤ng"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	106	4	[-0.007780131,0.05140047,-0.030035026,0.006770213,0.019016132,-0.02920698,-0.032588474,0.01645429,0.013786539,0.04265219,-0.009727709,0.024475288,0.010501692,-0.035806037,0.01040689,-0.04423556,-0.02136106,0.03665674,-0.084429905,0.029819245,0.032979768,-0.0014949187,0.057842065,0.0070963637,-0.0689116,-0.0006243978,0.00069244433,0.02460943,0.04460834,-0.07703848,0.0306856,0.05266573,-0.019607618,0.046575677,0.02864752,0.017838683,0.010170561,0.06194982,-0.007359121,-0.07256586,-0.017619045,0.028636351,0.024804734,0.07976105,-0.013395742,-0.021422574,-0.004264628,0.027324442,-0.007980177,0.03200552,0.036601268,0.05013589,0.010707316,0.033548098,-0.03895204,-0.016253982,-0.038749557,-0.0073417583,0.015482104,0.0043490683,0.0057450403,-0.022297448,0.011492786,-0.00019937666,-0.046571013,-0.0027505676,-0.019805992,0.0058190175,-0.06317497,-0.028182665,-0.05019307,-0.014636246,-0.035761226,0.008512017,0.035026636,-0.051591698,-0.01972688,0.020415468,-0.0006184678,0.06808373,-0.007935769,-0.002167545,0.11384896,0.07145042,0.062611766,0.037275758,-0.002335615,-0.07304917,-0.04809428,-0.05630076,0.0007022025,-0.0043380097,-0.0016197653,-0.055911914,0.096195154,-0.005752471,-0.10962449,-0.09992035,0.10565243,-0.0025295916,-0.0037544041,0.033287607,0.012994791,-0.11872034,0.017074468,-0.018396944,0.025831927,-0.0006355128,-0.078778155,0.024797564,-0.055231974,-0.06482739,-0.022705844,0.0056671384,0.05464251,-0.005401638,0.016218327,-0.016476894,-0.0038033964,-0.02668512,-0.041497406,-0.0028236597,-0.06055047,0.019329734,0.005411114,-0.012688582,-0.013036649,-0.023656603,-0.039496366,-0.09250302,0.067025386,-0.045178015,-0.025025899,-0.020504886,-0.01751576,0.015124797,0.03567971,-0.043404218,0.032327276,-0.012747524,0.019299032,-0.06333435,-0.0072261305,0.009354892,-0.04234204,-0.03131299,-0.061620403,0.03949043,-0.018614227,0.02503418,0.0037139687,-0.06946782,0.009151576,0.00926051,0.018303478,0.016406534,0.00229941,-0.025881842,0.083473764,0.02953495,0.042289954,-0.06101282,0.049437657,0.0036725178,-0.018911611,0.022243626,0.010440535,-0.08129568,0.04332826,0.03923571,-0.010576196,-0.04071019,0.014086865,-0.10939046,0.0072178342,-0.025664147,-0.029918043,-0.02921051,-0.006766722,0.06681509,0.0665261,0.01728261,-0.021723304,-0.004881034,-0.013079266,-0.022441959,0.019947162,0.03185336,0.030100517,0.0901681,0.0018796859,-0.01987418,0.006189921,0.03721541,-0.013382505,-0.021895291,0.00791982,-0.04924127,0.03561103,-0.07075361,-0.00041630986,0.020164678,-0.018243477,-0.09203734,0.0024213172,0.0745966,-0.030335944,-0.057905357,-0.021023655,-0.019746836,-0.01898371,0.0063270866,-0.016256046,0.008396923,0.0363118,-0.02889927,0.0596862,0.008140668,-0.014004479,-0.05097744,0.053364776,0.040891916,0.07802965,0.011184303,0.019533088,0.0052468358,-0.040722594,0.008112266,0.024513947,-0.087591246,-0.0058155996,0.011092895,-0.0042496226,-0.010356803,-0.01522891,0.05920497,0.024837159,0.0075685494,-0.0450405,-0.001033123,0.04209271,0.053872544,0.09991373,-0.0034778672,-0.014992351,-0.04573261,0.086320646,0.043222312,0.031610437,-0.10185356,-0.020917138,-0.06539131,-0.0028400994,0.0055002235,-0.040476095,-0.00767972,0.009679269,0.048844278,-0.023042412,0.007862586,0.016008034,0.020455716,0.004555717,-0.04826314,-0.0009299818,-0.062242344,-0.004741425,-0.06223675,0.024590611,0.03066244,-0.03833239,-0.08606267,-0.052456006,0.0017070969,-0.0043223086,0.008582546,-0.0026876605,-0.009257244,-0.055037346,-0.041677188,-0.0107361805,0.030559968,-0.026020553,0.04383165,0.039804988,-0.07878677,-0.008433438,0.005222155,-0.031913426,-0.0059126723,0.020170353,0.045489315,0.006626827,-0.025449276,0.03373731,-0.0017579074,0.029224971,0.007846301,-0.04094304,0.008162197,-0.012703533,0.055106487,-0.004138249,0.04596841,0.008394464,0.00015986896,0.009315489,0.012410029,-0.05361097,-0.023868784,0.0061053047,0.040129587,-0.043541413,-0.054744735,-0.023006225,0.0038274382,-0.14130479,-0.022028502,0.010673561,0.015663896,0.03450846,0.0042604976,-0.0027553649,-0.01757678,0.025382573,-0.045541815,0.0085900575,-0.012047077,0.03111388,0.0072649335,0.019606363,-0.013085244,0.0016035723,-0.06355666,0.012958973,0.023139682,-0.080212906,0.018608607,0.06854388,0.015769053,0.034184277,0.06308366,0.0026659186,0.024637897,-0.046288002,-0.032624878,0.0018600811,0.020088818,-0.02044031,0.03706634,0.04806818,0.08094513,0.01699463,-0.006161872,0.027346771,0.005251265,0.043330044,0.050777297,-0.012486895,-0.050459884,-0.027219614,-0.037046738,-0.04173758,0.015392445,0.016663909,-0.020892298,0.037404936,0.058633473,0.008935715,-0.04509525,0.010348564,0.06929554,0.026946051,0.0066818516,-0.003909352,0.03357006,-0.017642505,0.038992032,0.01812781,0.033363465,-0.013242505,-0.03327788,0.02697653,0.040985886,0.01232527,0.05510613,-0.03592407,-0.0637356,-0.010808105,0.03749438,-0.009683871,0.011355236,-0.019250892,0.02260655,-0.019856757,0.0550537,0.009764588,0.05107353,0.011169662,0.023202693,0.019463288,-0.0061873496,0.071259946,-0.11154847,-0.005293815,-0.005046947,0.041396752,0.0022143743,0.008319385,0.019336272,-0.024280254,-0.02016072,0.0020852673,0.03470724,-0.038747936,-0.031171504,0.033526734,-0.008189053,-0.0039115045,0.018545784,-0.035381302,0.0746302,0.020861216,0.016965747,0.0040722284,-0.043526262,0.020535469,-0.00011655247,0.010181666,0.012555155,0.04106565,0.062638275,-0.0178358,0.023261074,0.016484948,-0.012268076,0.05298948,0.044272263,0.008875939,0.014862683,-0.047943946,-0.020475125,0.08377175,-0.036072634,-0.02015326,0.06695473,0.065034114,0.027989164,-0.043324973,-0.004397361,0.01160795,-0.012870528,0.018256664,0.005626712,-0.057780854,-0.01331992,-0.01012117,0.05327911,-0.0046716947,0.019648487,-0.053827304,-0.042880323,0.04321885,0.01999645,0.01379652,-0.048703257,-0.011488846,0.014394368,-0.021269461,0.021991063,0.08570268,-0.03198616,-0.020121582,-0.006296673,-0.036767535,0.039316684,0.052325867,0.056043163,-0.048322,0.005430225,-0.011754003,8.815561e-05,0.0028132903,0.007386896,0.035301555,-0.024520347,0.024475578,-0.0043688077,-0.014517265,0.020014513,-0.015314921,0.05145152,0.027690392,-0.033995837,-0.04045352,0.001548775,0.04385791,-0.013367405,-0.025767738,0.035118002,0.040299788,-0.0006358136,-0.0077623394,-0.060372103,-0.011431543,0.014422202,-0.028408742,-0.019534763,0.03580289,0.007731347,0.027111206,-0.0062198415,-0.020680847,0.035214454,-0.0368784,-0.024971519,-0.044361148,0.026125656,0.0019953947,0.046188764,0.038470574,-0.02968253,0.00233639,-0.0034807231,0.009142912,-0.020083748,0.018005231,0.026676834,0.068136275,0.011188189,-0.04118465,0.008103924,0.02200397,0.043201607,-0.0024282278,0.04190489,-0.017216751,-0.016404115,-0.008205765,-0.008300525,-0.018105343,0.022553708,-0.006983613,0.007117146,0.045846928,-0.02095263,-0.036069244,0.055443425,-0.020829592,0.05639116,-0.0035832715,-0.031295992,-0.06924362,0.0319246,0.00012500848,0.017475955,0.04976915,-0.017693907,-0.05938714,-0.022414785,-0.036233034,0.03381511,-0.01883083,0.03154546,-0.0022413437,0.009385338,0.011861014,0.05246443,-0.014192783,0.019307956,0.048878096,0.047721345,-0.0055456036,0.00185976,0.06877254,-0.017071327,-0.037704103,-0.018397836,0.019131081,-0.054505855,-0.017606266,0.016172761,0.0863423,0.009180059,0.032510012,0.025094407,-0.027794985,-0.024452183,0.08638497,0.03443384,0.051557746,-0.019102035,-0.0062112636,-0.042686142,-0.019474622,-0.027329015,-0.010889394,0.005755331,0.02783673,0.016007314,-0.033102058,0.04608926,-0.011273871,-0.002516311,0.050125875,-0.04721129,0.04060444,-0.03206981,0.0233889,-0.023274086,0.03561146,0.016515896,-0.020357402,0.0018588253,-0.020588811,0.013054063,-0.026092598,-0.015421724,0.0433553,0.005311811,-0.023938667,-0.026943557,0.028381698,-0.010867301,-0.05840149,0.03811206,0.01056548,0.02299631,-0.023326647,0.03649084,0.030651886,0.010303029,-0.031227758,-0.0161585,-0.00013547501,0.028499007,0.0070442655,0.01414317,0.0012707427,-0.045167007,0.022309216,0.045141328,0.0832544,-0.021909779,-0.03197272,0.055629663,-0.039975144,0.03062499,-0.010981915,-0.019162612,0.008794015,0.022896858,-0.045856137,0.021626994,-0.05284338,-0.020231057,-0.017005833,0.01585471,0.012973774,0.014437392,-0.007931349,-0.005653094,-0.011829338,-0.0011564837,-0.058680534,-0.0054711476,-0.039527476,0.05172991,0.011423161,-0.031162532,-0.012661484,-0.009918065,0.013202038,0.046177544,-0.027210314,0.009243044,-0.03645754,-0.018419359,0.010679072,0.026840404,-0.016290143,0.028932843,0.023176564,-0.05703707,0.0018269118,0.027188838,-0.0029206455,-0.018696463,-0.01762412,0.036508873,-0.00524887,-0.0028060025,0.0013339133,0.022803914,-0.01235188,0.009744021,0.0012081394,0.003916039,-0.055940304,0.050041027,0.02004079,-0.0122464895,-0.00064768427,-0.07196428,-0.00089334074,0.0048247376,0.058361884,0.0011676146,0.027961973,0.05494566,-0.0303738,-0.007867608,0.019613722,0.016722199,0.023725899,0.0079575665,0.008711485,0.0035386018,-0.00046331342,0.011131538,-0.029771019,-0.03904114,0.009674464,0.014776839,0.042787444,-0.0034994744,-0.059349373,-0.014585168,-0.027670225,0.04529704,0.06172891,-0.03248506,-0.037200414,0.017402632,-0.016955443,0.014671196,-0.0008428769,-0.009973507,-0.0013560044,-0.016981933,0.05346251,-0.014996885,-0.04633334,-0.038616825,0.013116003,0.033986904,0.005410314,0.0114237685,-0.014627885,-0.014078216,-0.03528761,0.03125844,0.020042334,-0.02869349,0.06724435,0.012561966,-0.035653584,-0.047578424,-0.027118364,0.028193908,-0.036930252,0.017530203,0.011737293,0.026616005,-0.026233928,-0.052398406,0.0051281555,-0.023329139]
32	0	2026-06-07 13:37:07.546905	f	<h1>asdasssssssssssadasdasdasdasd</h1><img class="rounded-lg shadow-sm max-h-[500px] w-auto mx-auto my-4" src="http://localhost:8080/uploads/d6f1a5a4-9c67-4db5-b098-b13d853fe4c3_Screenshot_7-6-2026_13631_www.bing.com.jpeg" data-image-id="12"><p></p>	1111111111.00	{}	10000000.00	Iphone XXXAASS	iphone-xxxaass	{"Bß║úo h├ánh": "12 th├íng"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	1	[-0.0150367,0.006006553,-0.010399976,-0.04003599,0.037493426,-0.0055646375,-0.0007393205,0.029955313,-0.019418493,0.03368016,-0.03386834,0.01443231,0.080546215,-0.015057485,-0.013700049,-0.041429807,0.008921513,0.006159394,-0.07738968,-0.0046541533,0.012718128,0.0064073033,0.013966385,0.005026761,-0.025478156,-0.0062489156,-0.026853934,0.037234426,0.022735618,-0.03357535,-0.008505159,0.06483072,-0.049264267,-0.011565001,0.0028199132,0.022173027,-0.011377371,0.034625337,0.02213965,-0.07653141,-0.055034246,0.04103513,0.010519385,-0.019505793,0.011399705,-0.009479057,-0.011395477,0.05223977,-0.039219033,0.031462714,0.039295733,0.014293439,-0.052193414,-0.026894724,-0.03770227,-0.008372671,-0.000203037,-0.028340127,0.00054264156,-0.05702127,0.028133301,0.00085292145,-0.020433642,-0.00868516,0.013107089,-0.02584285,0.026387542,-0.0036661483,-0.07168129,0.060180042,-0.051753394,-0.07286863,-0.00967026,0.018782143,0.05864543,-0.051052496,-0.014533274,0.006408901,0.020160707,0.06198988,-0.017721232,-0.0005716724,0.0857299,0.04761794,0.03308589,-0.0028416978,-0.011480196,-0.059670422,-0.056010075,-0.028364789,0.064205974,0.014855919,0.029277854,0.047826998,0.07739761,0.0026462371,-0.089470565,-0.12583756,0.06623971,0.036118742,-0.022642815,0.011112181,-0.0051067355,-0.0740004,0.05078661,0.011063012,-0.02696072,-0.04326655,-0.019893846,0.0059912107,-0.067239314,-0.05145991,0.052084956,-0.021059088,0.0065821637,0.038846772,-0.016794775,0.04900613,-0.020972563,0.02551702,0.0005874841,-0.0038285146,-0.05481116,0.030515071,0.009675547,0.045132406,0.033830673,-0.012231667,-0.009826716,0.017285516,0.050337642,-0.06975418,-0.028322183,0.004737508,-0.06150475,-0.0061030868,0.077483065,-0.006755988,0.033329897,0.0335129,0.016068127,-0.011429325,-0.03894626,-0.015120991,-0.021210443,0.012775232,-0.026119724,0.034741554,-0.04241188,0.03218038,-0.032419853,-0.015517147,0.038240936,-0.027809387,0.01703161,-0.05225217,0.037528988,-0.013074001,0.069584884,-0.008348059,-0.008213411,-0.024426239,0.070449196,0.010153123,-0.069634266,0.081623174,0.006479964,-0.043197297,0.022332476,0.040736616,-0.049465403,-0.013653965,0.033839226,-0.11369421,0.014460852,-0.021535933,-0.076691635,0.017199984,-0.020647595,0.061325274,0.0907098,0.01976454,0.0051621944,-0.03169917,0.05392361,0.024844391,-0.026690844,0.010038273,0.050386228,0.023774808,0.045628965,-0.024942148,-0.0011411187,0.04396164,-0.019352961,-0.015075851,0.028646847,-0.01449454,0.045584954,-0.04711135,0.009104365,0.013214241,0.0015505868,-0.051188212,-0.0064160875,0.029080192,-0.06386558,-0.017080419,-0.0077682836,0.0062349983,0.005162331,0.004043897,0.0018887948,-0.062052432,-0.0043044677,0.0023345866,0.08595645,0.026801564,-0.021433832,-0.007089376,0.024993215,0.020302806,0.067368425,0.035054028,0.022043906,0.02598488,-0.051683158,-0.0054692053,0.05922498,-0.043388743,-0.0039984956,0.001802832,-0.008630052,0.033137098,-0.04408063,0.04519048,0.050499108,-0.03278578,-0.015955064,0.03794239,0.06735398,0.03546947,0.08334876,0.038072396,0.020523665,-0.018712416,0.079796515,0.025880836,-0.039342415,-0.043769,-0.0113033615,-0.06325189,0.029282128,0.019414768,-0.067259185,0.004855016,0.024808686,-0.013671539,-0.022294715,-0.0259728,0.0439233,-0.0051821335,-0.028540742,-0.0795222,-0.051082376,-0.066765286,0.012693734,-0.011725013,0.032822885,-0.028735429,0.02053949,-0.015085725,-0.044472415,-0.015989594,-0.053020485,0.004471316,-0.060744964,0.0028113937,-0.019715963,-0.026963705,0.056102946,0.01554555,-0.033553105,0.009186589,0.0044614966,-0.07522846,0.021657133,-0.00010696411,0.004371225,0.009342643,-0.0065989206,0.05666804,0.015831558,-0.02448876,0.032230854,0.023404283,0.008417289,0.029873941,0.0069625485,0.023710793,-0.004052808,0.08809191,-0.03991749,0.015142358,-0.025600234,-0.0352517,-0.018967984,-0.026754405,-0.007717145,-0.022730894,-0.010120659,0.07503238,-0.04892281,-0.057436563,-0.009443111,-0.011153254,-0.16280359,0.0030763075,-0.001369583,-0.016615652,0.03552476,0.028557463,0.0051334593,0.033868123,0.046598107,0.0050170925,-0.0171558,-0.01832045,-0.013054254,-0.03887589,0.006867802,-0.005046238,-0.03698395,-0.058560643,-0.016801657,0.043662835,-0.059049588,0.0135390125,0.05436556,0.046907824,0.05039964,0.061551087,-0.012201766,0.008954481,-0.057797857,-0.06239263,0.015192793,0.047398787,0.052068945,0.061028723,0.005309833,0.07657539,-0.0034252123,-0.03829591,-0.025629539,0.0060498575,0.038198285,0.040632777,0.0016211512,-0.058917947,0.0045132246,0.030083138,0.0020909086,0.008677728,-0.011974477,-0.04809097,0.061132673,0.036778487,-0.060777463,-0.067334235,-0.03945328,0.008362542,-0.046134926,0.033267416,-0.0014582097,-0.003987434,0.03509331,0.028936451,0.013479185,0.039803747,-0.020499948,-0.057932697,-0.028241305,0.019952865,-0.033331946,0.07755828,-0.070768565,-0.030277058,-0.054330036,0.06716443,-0.015091267,0.03403556,0.035399493,0.016056143,-0.046867333,0.08124652,-0.010892594,0.073700145,-0.025862886,0.0511285,-0.013359279,-0.011864663,0.06775111,-0.06613291,-0.009153239,-0.0025462063,0.014585797,-0.0046713017,-0.021787096,-0.036830463,-0.0102798,-0.021194344,-0.0043297056,-0.017928552,-0.049958147,-0.008190172,0.04214354,-0.03907443,0.02387082,0.0113907475,-0.00033431483,0.030857524,0.0008638786,0.05306436,0.009260158,-0.015780736,0.037616953,-0.013958176,-0.06482786,-0.014346712,0.026474457,0.05356966,-0.031067714,0.0522344,-0.051760092,0.0070025977,0.03208415,-0.011935212,0.00212159,-0.014959987,-0.02245325,-0.03776833,0.046825632,0.028439622,-0.022004994,0.0382702,0.06169644,-0.03435169,-0.052348774,0.014161085,0.01584401,-0.029064797,0.059676882,0.009355877,-0.04298124,0.0025293652,-0.0015234496,0.018008607,0.021684391,0.018845556,-0.012131294,-0.044814877,0.04801549,-0.00074368564,-0.02215845,-0.024914242,-0.0009519435,0.00997115,-0.06564245,0.0386803,0.058637556,-0.0067829615,0.014446943,-0.002186324,-0.004260274,-0.0039737187,-0.026617885,0.025313336,-0.07436459,0.0025050738,0.0073805214,-0.021647997,-0.03428603,0.029581107,0.06489446,-0.03983864,0.0015788067,-0.015506546,0.0143642975,0.05434789,0.018692503,0.053797934,0.00084380654,-0.04368989,0.00509777,-0.0017932466,0.021311158,-0.014317643,-0.027012222,0.05741492,0.07973453,0.0103342235,0.010490446,-0.05894614,-0.023391647,0.06764225,-0.044989422,-0.010328006,0.04233245,-0.007986743,0.04586607,0.006847353,0.009393698,0.005805249,-0.027390677,0.022101091,-0.04139891,0.018040802,-0.0034676492,0.010525271,0.04435264,-0.047132455,0.020242747,-0.0069392533,0.02904217,0.02772228,-0.015909944,0.0120874215,0.0163097,-0.025621293,-0.01563344,0.0027053491,0.033073626,0.06598898,0.020321803,0.07512292,0.05347795,-0.022633223,0.014525959,0.006267975,0.039068352,-0.04935099,0.0076612984,0.0034905984,-0.0057773646,-0.00015325936,-0.016204817,0.03406714,-0.03800582,0.02804045,-0.03990206,-0.014231636,-0.033935342,0.040785752,0.018205246,-0.023100367,0.011393155,-0.049684998,-0.07563122,-0.0069998293,-0.0044613513,0.023188975,-0.00473613,0.0011039051,-0.0009003593,0.0014349994,0.02253007,0.06750383,-0.017537104,0.01210253,0.047950234,0.034713693,-0.022543164,-0.0070620175,-0.014262304,-0.0074049993,-0.014186461,0.037166793,0.070342824,-0.006583232,-0.009543495,0.021816619,0.024409942,-0.0028467518,0.038155243,0.0035682747,-0.02267974,-0.0038771774,-0.00037589244,0.004627006,-0.0015247698,-0.00021072432,-0.031071091,-0.028774243,0.0028237877,0.011894648,-0.00066824286,0.010302888,-0.022484677,0.015429737,-0.044105943,0.0014292356,0.038423423,0.038912505,-0.003073631,-0.050642148,-0.016968796,-0.07018707,0.043715157,-0.050431017,-0.022036176,0.03887381,-0.042361192,-0.039490473,-0.03694781,-0.0040232935,-0.014558609,0.0076472955,0.0033149153,0.0327488,0.004860022,-0.0120326625,0.055133652,-0.027694918,-0.033632167,0.038081676,-0.005081534,-0.033388834,0.0036935194,0.034377977,0.030460818,0.024577482,0.006918987,-0.053823784,-0.012304811,0.058777317,0.006277065,-0.008147294,0.044664763,-0.07026613,-0.013757576,0.008976546,0.08708805,-0.037137344,0.0009303058,0.038439836,0.002802069,0.04206835,0.03757517,0.030476442,0.0119725885,-0.019350227,-0.045815177,-0.01736256,-0.017528519,0.022533456,-0.031128578,0.018605584,-0.0067652753,0.0035965983,0.0013738022,-0.038646977,-0.028306307,0.016952023,-0.027153647,-0.017909043,0.00014330113,0.03700952,0.022747103,-0.046631943,0.033574972,-0.025644986,0.0023957866,0.022283295,-0.03977847,0.068661496,0.007655811,0.01741142,0.029120168,-0.016490262,-0.007984553,-0.043222725,-0.010610631,-0.012906745,0.0008325193,-0.0052239867,-0.010996522,0.019723551,-0.006030782,0.03386028,0.016375687,-0.0019785967,-0.0054477314,0.016248854,0.025795689,0.05302722,-0.021092918,0.023026848,-0.03744673,0.010012936,-0.03950671,0.01848273,-0.027235974,-0.04715528,-0.009244312,-0.005600996,0.013636502,-0.02815518,-0.036112305,0.040758077,0.0107118245,0.029869152,0.026588535,0.030062992,0.0014239725,-0.009490334,0.030346792,-0.015404838,-0.04771664,0.061563276,0.015804153,-0.016084274,0.021102352,0.046662334,0.0433932,-0.021134159,-0.054862417,0.0076267775,-0.025842765,0.033787,0.10599682,-0.043191414,-0.011862832,-0.00695248,-0.017756015,-0.034868777,-0.025652817,-0.038453538,-0.007926018,-0.023527982,0.025764108,-0.041111045,-0.07136802,-0.006429785,0.02094041,0.030844154,0.0033990862,0.03551647,0.023881989,-0.022602499,-0.049748477,0.04416208,-0.001958123,0.007656202,-0.0032099013,-0.007097542,0.020813568,0.0018852411,-0.03218034,0.05724086,-0.05409678,0.053236615,0.033649646,-0.0011021548,-0.034629483,-0.049711663,0.030401697,-0.022173548]
18	0	2026-03-23 08:04:03.478548	f	<p>Th╞░╞íng hiß╗çu: Beverly Hills Polo Club</p><p>Chß║Ñt liß╗çu: 100% COTTON AMONIA DOUBLE FACE</p><p>Kiß╗âu d├íng: Regular Fit</p><p><br></p><img class="rounded-lg shadow-sm max-h-[500px] w-auto mx-auto my-4" src="http://localhost:8080/uploads/08c85787-5da9-4b38-a675-7e951de284db_vn-11134207-820l4-mifexpg9li4i45.webp" data-image-id="9"><p></p>	120000.00	{}	100000.00	├üo polo Nam Regular Fit Beverly Hills Polo Club - PMRSS25TL019	ao-polo-nam-regular-fit-beverly-hills-polo-club-pmrss25tl019	{"Xuß║Ñt xß╗⌐": "Th├íi Lan", "Chß║Ñt liß╗çu": "100% COTTON AMONIA DOUBLE FACE", "Th╞░╞íng hiß╗çu": " BEVERLY HILLS POLO CLUB (BHPC)"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	105	5	[0.00025659532,0.046326015,0.014804215,-0.017302465,0.027431639,0.00747007,-0.0088699,-0.022942193,-0.034192562,0.030736,0.00420644,-0.009550719,0.061129592,0.009942075,-0.016763348,-0.03312921,0.03668691,0.008130846,-0.05156627,-0.008369133,-0.026111865,0.036569305,0.08003386,0.02739557,-0.026422419,-0.0024398589,-0.011258431,0.05077356,-0.022808602,-0.06899848,0.024897924,0.038610324,-0.0019472803,-0.007367394,0.04428105,-0.0033252432,-0.0009221382,0.035909493,0.0019196663,-0.040334962,0.004791535,0.05121806,0.01289087,0.024629181,-0.026560407,0.006047735,0.02120801,0.039851114,-0.024782868,0.056745045,0.04915091,0.0028087317,-0.051812693,0.012727996,-0.043058243,-0.011680938,-0.050441235,-0.040197656,0.0079574045,-0.057779066,0.011020504,0.013482763,0.048439026,0.03060682,-0.05528612,0.00014780484,0.010877935,-0.004448789,-0.0527719,0.010175605,-0.020049196,-0.038368862,-0.03219406,0.00821081,0.022428498,-0.031413563,0.00020464676,0.03188309,0.0062137586,0.06341498,-0.019773772,-0.03235431,0.09230949,0.076258704,0.05510013,-0.031103414,0.029254524,-0.054713123,-0.040637437,0.010868614,0.03100461,0.04863599,0.02097823,-0.015527378,0.025927957,-0.011519711,-0.12579879,-0.10624122,0.097145,0.028919248,0.05341063,0.038057033,0.013161626,-0.06596928,0.035757605,0.028393924,-0.009292407,0.013169641,-0.012174677,-0.030223371,-0.016642371,-0.051126294,0.0037663863,-0.07557052,0.054723863,0.014037171,0.019230837,0.010116141,-0.0026632333,0.046935666,-0.017062053,-0.0059896167,-0.033501796,-0.00923919,0.04246135,-0.04511748,0.011878494,-0.024214571,-0.04103728,-0.041851904,0.04594288,-0.05792869,-0.059077073,-0.0016574695,-0.011217427,-0.029881557,0.043599147,-0.030272016,0.027802926,-0.0045080003,0.024706902,-0.071675055,-0.039792564,0.016899506,-0.024368886,-0.024727276,-0.07039097,0.056281626,-0.059158314,-0.022242872,-0.038096216,-0.041075587,0.06748389,-0.041718017,0.009548976,0.009987648,0.045681246,-0.06456089,0.07243138,0.0151611185,-0.0023403477,-0.051167548,0.025135227,0.024573915,-0.004999279,-0.00284682,0.034386404,-0.040959604,0.017766144,-0.018292096,0.02110146,-0.07754173,0.03273529,-0.12787619,0.027133575,-0.034395307,-0.03868353,0.021112828,-0.033632,0.04147247,0.054210253,0.0135695115,-0.054794062,-0.03886117,0.06015779,-0.037299994,0.04653104,0.012512868,0.053203616,0.02060026,0.043533925,-0.012446942,-0.028171992,0.014603947,0.026017927,0.01832069,0.0024596704,-0.007098398,0.04667478,-0.025480129,0.00090653833,-0.03472695,0.0013518836,-0.015272469,-0.0019925795,0.05916776,-0.049623184,-0.067882806,-0.025984881,-0.026429145,-0.000503315,0.010592799,-0.022462241,-0.06825182,-0.00647225,-0.08064215,0.081986375,0.024704644,-0.0041570147,-0.022361986,0.05828082,0.014088654,0.032595336,0.04908484,0.02475165,0.017990649,-0.024731828,-0.004297775,-0.02510584,-0.07759952,-0.025357593,0.045295175,0.02602356,0.013053045,0.01798931,0.048776485,0.056974966,-0.056938052,0.013954246,0.03238478,0.024019605,0.015133524,0.06357973,0.03899763,0.0022300722,-0.02317626,0.12717123,0.0014356246,0.02219047,-0.084295236,-0.006101574,-0.05673394,0.048844974,-0.00676592,-0.027612573,-0.015993271,-0.004813155,-0.036993086,-0.016483035,0.005736999,0.008660548,-0.034948405,0.040078092,-0.10598973,-0.024200741,-0.08594336,-0.025454408,-0.023594592,0.011288473,-0.045963246,-0.009077794,-0.06851685,-0.023238111,-0.0026475848,-0.045745652,-0.03380558,-0.013554294,-0.008788407,0.011903587,-0.047518272,-0.00044461145,0.046747785,0.004633563,0.03821331,0.009096562,-0.03201496,0.026392868,0.05576191,-0.041156836,0.011087116,0.018985378,0.023517039,0.0043757847,-0.012346826,0.025392544,0.027012642,0.025494074,0.023613475,0.008870315,0.0039397515,-0.033234652,0.05163802,-0.06731933,0.040752716,0.030269306,0.022499302,0.0072439876,-0.014213872,-0.0420719,-0.014249588,0.008334979,0.0010746625,-0.040282667,-0.031546112,-0.040068284,-0.017514756,-0.13094474,-0.008915797,0.031946693,-0.032287043,0.036946766,0.04040046,0.005034044,0.032924198,-0.033895373,0.008934725,0.011996338,-0.0062979893,0.05010296,-0.02504447,0.011001377,-0.026694342,-0.041122023,-0.05960255,0.006088526,0.0035145308,-0.056609094,0.022966923,0.08127741,0.03454228,0.007110517,0.059021767,0.016767882,0.011595546,-0.031326476,-0.07178978,-0.030131564,0.02143146,0.025055652,-0.005220052,0.028546503,0.09884464,-0.029973865,-0.06332979,0.022265157,-0.021930946,0.036488082,-0.019125123,-0.05620273,-0.046870388,-0.019168178,-0.007665604,-0.012238755,0.025416248,-0.0033950473,-0.0528966,0.02935622,0.06896241,-0.0012988664,-0.03078182,-0.0044518868,0.062335834,-0.00060808734,-0.0007511476,0.01004672,0.027148334,-0.025900872,0.019345636,0.016302686,0.0155838765,-0.019410852,-0.029613,-0.0087950975,-0.039133143,-0.018675288,0.024087433,-0.04711134,0.023474464,-0.0044024577,0.0047782157,-0.04250208,0.0016193067,0.040185954,0.041141775,-0.04377003,0.044170585,-0.008632714,0.07564178,0.014781514,0.047431365,0.0011017151,0.013605661,0.033388678,-0.06006687,0.014567715,0.015594785,0.06745842,0.03313566,0.004994673,-0.025015434,0.02394662,-0.04838083,-0.06512638,-0.015111038,-0.037825845,-0.038663615,0.017261053,0.003635033,0.023148881,0.043786295,-0.0016484656,0.021739703,-0.01600094,0.022770504,0.05323367,-0.023371372,0.054873925,0.018423982,0.006891809,0.024318658,-0.0032064046,0.04572816,-0.022392409,0.07184042,0.028510747,-0.021926498,0.044889763,0.053044084,-0.03171596,0.0007183195,-0.0003889805,0.012535067,0.008938295,-0.009872492,-0.045896024,0.042234577,0.032419227,0.023912149,-0.049467042,-0.023558445,0.0377099,0.008345674,0.004485535,-0.012918087,-0.014595119,-0.0013637427,0.051037747,0.043912362,-0.028722763,0.01568804,-0.019341009,-0.00076985726,0.022780789,0.0078380015,0.0038919228,0.0064593367,-0.021856625,0.03261292,-0.02334336,0.016459616,0.07102437,-0.01950412,0.033824664,0.027442837,-0.028663019,0.01856046,0.017523047,0.031502437,-0.02069115,0.021853013,-0.03742507,-0.034538887,0.012162999,0.013041791,0.037875082,0.008598444,-0.007816408,0.004432806,0.00439938,0.048138477,0.032819558,0.05789917,0.053235814,0.005190035,0.011676837,0.007884816,0.06569267,-0.023300767,-0.017813282,0.045184996,0.083678424,0.018630648,-0.035756428,-0.044816375,-0.04730394,0.053268813,-0.05053122,0.012565644,0.03516392,-0.024342196,0.016950332,-0.006561495,-0.016840862,0.03535522,-0.06576076,0.010957064,-0.026324114,0.019431492,0.0036909084,0.054721422,0.057531707,-0.02247452,-0.028542956,-0.0019798903,0.05273311,0.008171854,0.008316474,-0.01575675,0.04314436,-0.021335036,-0.061872605,0.04172972,0.00014204762,-0.019133396,0.019661415,0.03394641,0.03564286,-0.045442447,0.0068558063,-0.017306997,-0.010942609,-0.012890279,-0.0035387091,0.01676361,0.026096182,0.027140811,-0.0033070575,0.04763497,-0.04224797,0.018455008,-0.027690435,-0.023104023,-0.03699167,-0.009295965,-0.026557954,0.015245507,0.0059132553,-0.0397307,-0.06405584,0.018216264,0.042957947,0.004617761,-0.01157383,0.025191912,0.02497513,0.02322954,-0.011907823,0.08789498,0.017820928,0.013166219,0.046690043,0.034691323,-0.010256834,-0.017639441,0.022459058,-0.031912412,-0.06901928,0.021521946,0.0387033,-0.007200914,-0.017804312,0.03175753,0.008470617,-7.794589e-05,0.04491271,0.02376235,0.01636409,-0.04592975,0.029748432,-0.0039754095,0.008616271,0.025397906,-0.033325303,-0.05764036,0.031369485,-0.012257451,-0.0027545393,-0.007794898,-0.019680273,0.05682123,-0.016110526,0.02066886,-0.0020319205,0.046463687,0.07377342,-0.01869033,-0.011777911,-0.05106834,0.007605275,-0.005040626,0.011261767,0.013871363,-0.009800194,-0.036693234,0.008922724,-0.011936242,-0.03477068,-0.03272968,0.042586707,-0.005702976,-0.00055357866,-0.048981097,0.02829374,-0.010316451,-0.05665745,0.046876095,0.011252378,-0.00094081624,0.0022304126,0.018787082,0.05798726,0.036914647,-0.051947378,-0.0009587459,-0.03944978,0.09082031,0.022038365,-0.0021268371,-0.011117797,-0.06696381,0.0031542175,0.045120385,0.10139098,-0.049648445,-0.039291635,0.025898868,0.0068439734,0.01983577,0.019752761,0.008852165,0.026043518,-0.024190737,-0.030616613,-0.001858589,-0.016818292,0.05639129,-0.041309133,0.012302893,0.015423551,0.036227114,-0.033345997,-0.010762864,-0.022384308,0.05350178,-0.0023676062,0.029964423,-0.0011833481,0.04946246,-0.0027022487,-0.031833887,-0.043573327,-0.03283435,0.004519665,0.034915905,-0.08398146,0.058829546,-0.000296797,0.004877569,0.0076420936,0.0044275266,-0.04722789,-0.0025079143,0.025090914,-0.05552438,0.010695067,-0.001688121,-0.016214,-0.01316757,-0.016250795,-0.022011003,0.020781314,-0.006655315,0.04672161,0.050071042,0.002259695,-0.0037380126,0.026897807,-0.045866206,-0.02530498,0.040172733,-0.0029801535,-0.025417155,-0.037272174,-0.032240443,0.00037342025,0.031806022,0.042322513,-0.016434837,-0.012330136,-0.00077975524,-0.055581357,0.022139326,-0.0020517956,0.02221551,0.038883362,0.042053897,-0.0021202662,-0.026945796,-0.012569564,0.05341265,-0.025573466,-0.012562676,0.020897847,0.053354412,0.053514656,-0.027472176,-0.062127218,-0.009048602,-0.03276762,0.010878894,0.044972524,-0.027508546,-0.056076616,0.036388993,-0.0246554,0.014553932,0.013735556,-0.054797303,0.045258097,-0.053384416,0.024515731,0.01400266,-0.023849463,-0.023687275,-0.026695114,0.023036309,0.009497548,-0.0030537485,-0.037502002,-0.064756215,-0.054263145,-0.012442084,-0.02985145,-0.041373502,-0.005360261,0.005961575,-0.036763113,0.018111423,-0.023832487,0.000495373,-0.03766254,0.0051222956,0.045871086,-0.02299304,-0.0048629683,0.020691648,-0.009235798,-0.069480315]
23	0	2026-03-23 08:30:43.70724	f	<p>GI├ÇY SNEAKER UNISEX HOKA PROJECT TRANSPORT - 1162850-BYN</p><p>Bß║ín ─æang t├¼m mß╗Öt ─æ├┤i gi├áy vß╗½a mang lß║íi hiß╗çu suß║Ñt cao, vß╗½a sß╗ƒ hß╗»u phong c├ích hiß╗çn ─æß║íi v├á tß╗æi giß║ún? Gi├áy Sneaker Unisex HOKA Project Transport sß║╜ ─æ├íp ß╗⌐ng mß╗ìi mong ─æß╗úi cß╗ºa bß║ín. Thiß║┐t kß║┐ phß║ºn th├ón gi├áy bß║▒ng chß║Ñt liß╗çu Ripstop bß╗ün chß║»c, kß║┐t hß╗úp c├íc chi tiß║┐t da tß╗òng hß╗úp tß║ío ─æiß╗âm nhß║Ñn tinh tß║┐, gi├║p bß║ín nß╗òi bß║¡t giß╗»a ─æ├ím ─æ├┤ng. ─Éß║┐ ngo├ái Vibram┬« si├¬u bß╗ün t─âng ─æß╗Ö b├ím v├á ß╗òn ─æß╗ïnh, trong khi lß╗¢p ─æß╗çm EVA tß╗½ m├¡a mang lß║íi cß║úm gi├íc ├¬m ├íi, nhß║╣ nh├áng mß╗ùi khi di chuyß╗ân. Ho├án hß║úo cho nhß╗»ng ai th╞░ß╗¥ng xuy├¬n di chuyß╗ân nh╞░ng vß║½n ─æß╗ü cao sß╗▒ thß╗¥i trang v├á tiß╗çn dß╗Ñng.</p><p>TH├öNG Sß╗É</p><p>Thiß║┐t kß║┐ l├╜ t╞░ß╗ƒng cho phong c├ích sß╗æng n─âng ─æß╗Öng, ph├╣ hß╗úp cß║ú khi ─æi l├ám v├á dß║ío phß╗æ.</p><p>Th├ón gi├áy Ripstop phß╗º k├¡n, t─âng khß║ú n─âng bß║úo vß╗ç v├á chß╗æng m├ái m├▓n.</p><p>D├óy ─æai Hotmelt chß║»c chß║»n, tß║ío ─æiß╗âm nhß║Ñn ─æß╗Öc ─æ├ío cho tß╗òng thß╗â gi├áy.</p><p>Lß╗¢p phß╗º da tß╗òng hß╗úp t─âng t├¡nh thß║⌐m mß╗╣ v├á ─æß╗Ö bß╗ün cho sß║ún phß║⌐m.</p><p>M├áng phim TPU gi├║p bß║úo vß╗ç b├án ch├ón, t─âng c╞░ß╗¥ng khß║ú n─âng chß╗ïu lß╗▒c.</p><p>Bß╗ü mß║╖t chß╗æng n╞░ß╗¢c bß╗ün vß╗»ng, kh├┤ng chß╗⌐a PFC, gi├║p ─æ├┤i ch├ón lu├┤n kh├┤ tho├íng.</p><p>Trang bß╗ï c├íc chi tiß║┐t phß║ún quang gi├║p an to├án h╞ín khi di chuyß╗ân v├áo ban ─æ├¬m.</p><p>─Éß║┐ giß╗»a EVA l├ám tß╗½ 35% m├¡a mang ─æß║┐n ─æß╗Ö ─æ├án hß╗ôi, trß╗ìng l╞░ß╗úng nhß║╣ v├á ├¬m ├íi.</p><p>─Éß║┐ ngo├ái Vibram┬« Ecostep Evo si├¬u b├ím, bß╗ün, gi├║p di chuyß╗ân chß║»c chß║»n tr├¬n mß╗ìi ─æß╗ïa h├¼nh.</p><p>Kh├│a k├⌐o b├ín tß╗▒ ─æß╗Öng tiß╗çn lß╗úi, cho cß║úm gi├íc an to├án v├á dß╗à d├áng th├ío mang.</p><p>Trß╗ìng l╞░ß╗úng nhß║╣, di chuyß╗ân linh hoß║ít, kh├┤ng g├óy ├íp lß╗▒c cho b├án ch├ón.</p><p>Kiß╗âu d├íng ß╗òn ─æß╗ïnh, gi├║p giß╗» vß╗»ng b├án ch├ón v├á giß║úm nguy c╞í chß║Ñn th╞░╞íng khi vß║¡n ─æß╗Öng.</p><p>* C├üCH CH─éM S├ôC</p><p>* ─Éß╗æi vß╗¢i chß║Ñt liß╗çu da (Leather)</p><p>- Lau sß║ích bß╗Ñi bß║⌐n bß║▒ng kh─ân mß╗üm</p><p>- Sß╗¡ dß╗Ñng s├íp ─æ├ính b├│ng da ─æß╗â giß╗» ─æß╗Ö b├│ng v├á mß╗üm mß║íi</p><p>- Tr├ính tiß║┐p x├║c vß╗¢i n╞░ß╗¢c ─æß╗â ng─ân chß║Ñt liß╗çu da bß╗ï nß╗⌐t v├á bong tr├│c</p><p>* ─Éß╗æi vß╗¢i chß║Ñt liß╗çu l╞░ß╗¢i hoß║╖c canvas (Mesh &amp; Canvas)</p><p>- Lau sß║ích bß╗Ñi v├á vß║┐t bß║⌐n nhß╗Å bß║▒ng kh─ân ß║⌐m</p><p>- Sß╗¡ dß╗Ñng n╞░ß╗¢c ß║Ñm kß║┐t hß╗úp x├á ph├▓ng dß╗ïu nhß║╣ ─æß╗â l├ám sß║ích vß║┐t bß║⌐n lß╗¢n</p><p>- Ph╞íi kh├┤ d╞░ß╗¢i b├│ng r├óm</p><p>* ─Éß╗æi vß╗¢i chß║Ñt liß╗çu da lß╗Ön hoß║╖c da ─æß╗Öng vß║¡t (Suede &amp; Suede)</p><p>- Sß╗¡ dß╗Ñng cß╗ì mß╗üm ─æß╗â l├ám sß║ích bß╗Ñi v├á vß║┐t bß║⌐n (─É├ính b├án chß║úi theo mß╗Öt chiß╗üu ─æß║┐n khi vß║┐t bß║⌐n ─æ╞░ß╗úc ho├án to├án ─æ╞░ß╗úc loß║íi bß╗Å)</p><p>- Lß║Ñy kh─ân sß║ích chß║Ñm nhß║╣ l├¬n sß║ún phß║⌐m nhß║▒m h├║t ß║⌐m v├á ─æß║úm bß║úo da lß╗Ön kh├┤ng bß╗ï x├╣ bß╗ü mß║╖t</p><p>- Giß║╖t kh├┤ l├á ph╞░╞íng ph├íp tß╗æi ╞░u gi├║p bß║úo quß║ún sß║ún phß║⌐m da lß╗Ön tß╗æt h╞ín</p><p>- Sß╗¡ dß╗Ñng xß╗ït chß╗æng n╞░ß╗¢c ─æß╗â bß║úo vß╗ç chß║Ñt liß╗çu suede</p><p>- Ph╞íi kh├┤ d╞░ß╗¢i b├│ng r├óm (Kh├┤ng ph╞íi trß╗▒c tiß║┐p d╞░ß╗¢i ├ính nß║»ng mß║╖t trß╗¥i)</p><p>* ─Éß╗æi vß╗¢i chß║Ñt liß╗çu tß╗òng hß╗úp</p><p>- Lau sß║ích bß╗Ñi bß║⌐n bß║▒ng kh─ân ß║⌐m hoß║╖c b├án chß║úi mß╗üm</p><p>- Kh├┤ng sß╗¡ dß╗Ñng c├íc chß║Ñt giß║╖t tß║⌐y mß║ính</p><p>- Ph╞íi kh├┤ d╞░ß╗¢i b├│ng r├óm</p><p>Ch├¡nh s├ích ─æß╗òi trß║ú: ├üp dß╗Ñng theo ch├¡nh s├ích cß╗ºa s├án</p><p>Ch├¡nh s├ích bß║úo h├ánh: Kh├┤ng bß║úo h├ánh</p><p>H├áng sß║ún xuß║Ñt ß╗ƒ n╞░ß╗¢c thß╗⌐ 3 t├╣y tß╗½ng l├┤ h├áng (Viß╗çt Nam, Trung Quß╗æc, ß║ñn ─Éß╗Ö, Campuchia...)</p>	100000.00	{}	100000.00	Gi├áy Sneaker Unisex HOKA Project Transport - ─Éen - 1162850-BYN -LS00.	giay-sneaker-unisex-hoka-project-transport-den-1162850byn-ls00	{"Gß╗¡i tß╗½": " ─Éß╗ông Nai", "Th╞░╞íng hiß╗çu": " Hoka"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	106	4	[-0.011233391,-0.022928894,-0.0033552959,-0.05767243,0.03716749,0.00060491933,0.016940428,0.0061410847,0.027634148,-0.0035821607,-0.032838713,0.028924858,-0.0013514323,-0.025862252,-0.011552844,-0.013765572,0.00011445374,-0.015435478,-0.111184835,0.023409748,-0.023238726,-0.00819853,0.055163916,0.013790478,-0.08154049,0.0011211585,-0.0091855135,0.05414146,-0.0140789235,-0.06909049,0.014173812,0.044470504,-0.009744745,0.038452163,0.07252922,0.021670833,-0.0023449555,-0.0043857545,-0.002195927,-0.06516485,-0.005140489,0.038916998,0.00399648,0.025611816,0.009674841,-0.016080914,0.010660161,0.041098323,-0.04349592,0.054837782,0.061808854,0.050797086,-0.02092829,0.040495954,-0.026782505,0.027215553,-0.06679577,-0.02131157,0.027238628,0.04925845,0.0035935012,-0.011372287,-0.010061906,-0.018853871,0.011880428,-0.04313365,-0.014810833,0.01057329,-0.044487674,-0.004396761,-0.03463559,-0.0011091587,-0.06698032,0.034104995,0.04532809,-0.019885546,-0.027255937,0.0375955,0.0035333654,0.031230235,-0.016478378,0.0060725743,0.13526736,0.05352049,0.041926228,-0.02042484,0.011724346,-0.07470655,-0.06523236,0.014107966,0.016166694,0.035780586,0.023477262,-0.0198325,0.07010114,-0.011906735,-0.070539154,-0.089276455,0.098043345,0.0415024,0.019133376,0.0336959,0.054480974,-0.10389732,0.036952168,0.024562063,-0.020285306,0.029186258,-0.059937805,-0.008780211,-0.013240368,0.008653357,0.002986228,-0.047367815,0.028063774,0.018683063,-0.027681764,0.020255998,-0.018066209,0.0076591675,-0.005299806,0.03079762,-0.046984036,0.03988906,0.010191769,0.012705939,-0.019281382,-0.00090073945,-0.046673033,-0.03881488,0.04453238,-0.10511229,-0.020090934,0.021219004,-0.03437755,0.015571558,0.051524933,0.061648574,-0.013815865,0.007627228,0.048347533,-0.022942375,-0.038151834,-0.013258963,-0.020229751,0.02926917,-0.015077877,0.07567853,-0.0016175151,0.0009811331,-0.0016670981,-0.044661988,-0.0057412335,-0.034352176,0.009447365,-0.0045209546,0.033871677,-0.030738283,0.05635898,0.027725901,0.037320368,-0.047024306,0.025762737,-4.8690817e-05,-0.015007269,0.010254163,-0.010353915,-0.007416383,-0.029957466,0.0074909837,0.024495166,-0.0023742232,0.061336055,-0.12918113,0.020425806,-0.024981186,0.007741595,-0.04369787,0.00934582,0.01855394,0.06091864,0.046513338,-0.0057019596,-0.06310089,0.028362554,-0.028923841,-0.024542205,-0.010746903,0.07912357,0.067367926,-0.04016419,0.02576058,0.022310872,0.0617316,0.03967921,-0.052547634,0.016988177,0.0043054703,0.04568435,-0.007926299,0.028645465,0.003673933,-0.004813184,-0.04901222,-0.03087033,0.031926207,-0.04887942,-0.018013258,-0.002079177,-0.046276066,0.0394343,-0.024678651,-0.025738414,-0.044537585,0.020386249,-0.028589683,0.057695433,0.029825756,0.017744843,-0.08348431,0.048329458,0.04619334,0.07392581,0.035936013,0.050159223,0.0046011615,-0.027419321,-0.0320722,-0.03348447,-0.073529065,-0.009390885,0.001185045,-0.027579049,0.019849332,0.0130977845,0.02736851,0.013739087,-0.067848384,-0.017330337,-0.034008745,0.03720067,0.04523565,0.07708665,0.00075897685,0.012805585,-0.015705515,0.061961345,0.014247236,0.017848732,-0.008059249,-0.0199117,-0.027978329,0.0446892,-0.050848555,-0.03132475,-0.029308124,-0.008724132,0.017109523,-0.0034972173,-0.02110673,0.037764236,0.02291459,-0.011366217,-0.04852802,-0.06278087,-0.04411775,-0.0057354714,-0.041234344,0.056715753,5.767408e-06,0.004587598,-0.095416896,-0.01688781,-0.0008635232,-0.034562636,-0.0121821705,-0.055385776,0.007910575,-0.023435527,-0.037587363,0.008777377,-0.020074211,0.0012055015,0.02181277,0.04174475,-0.06636442,-0.007259324,0.010323998,-0.029565526,0.021687016,0.0635654,0.036515582,0.0064180046,-0.04671399,0.022662388,0.038999297,-0.00614928,0.010388154,-0.04419526,-0.021736208,-0.047478642,0.07365979,-0.006181982,-0.0055216607,-0.038477298,-0.010508725,-0.0074310894,-0.010228927,-0.002762963,-0.020147698,0.030081822,0.058652803,-0.059012994,-0.020175178,-0.016730094,-0.01673012,-0.15017343,0.010645117,-0.0032807407,0.02586471,0.08981606,-0.0010274627,-0.0012546822,0.017835075,0.0028320057,-0.0057202573,-0.03263882,0.029568344,-0.004516711,-0.053382203,0.033969272,-0.021311654,-0.092749014,-0.047378004,0.017174954,0.025429659,-0.0775854,0.021478677,0.031534404,0.067141704,-0.007319988,0.058899153,0.012979254,-0.03578846,-0.04653732,-0.0552195,0.03177237,0.005598195,-0.019732827,-0.0021932689,0.027154751,0.041555777,0.009709626,-0.026547588,0.006511154,-0.01844531,0.019191153,0.05005021,-0.008587579,-0.010625753,0.013583298,0.014073083,-0.0051345443,0.030514693,0.06184601,0.009626964,-0.0129507,0.04382151,-0.045127776,-0.03281037,-0.039185695,0.061628714,0.03302726,0.00020413441,-0.035992898,0.009250893,0.033758122,0.037503462,0.023374135,-0.009348883,0.008599538,-0.031482495,0.022210943,-0.003816337,0.008998295,0.06848645,-0.06549836,-0.042877123,0.044538382,0.030161018,-0.013382495,0.03688302,0.002077048,0.021876007,-0.062025893,0.020012418,-0.009182845,0.04919465,0.006143995,0.031134617,0.034822285,-0.021746762,0.07367229,-0.03715563,-0.03418847,0.03592542,0.00250478,-0.0031410437,-0.017899098,0.011831703,0.02920894,0.01027875,0.01606074,0.038884062,-0.041802656,0.0037731908,0.015912088,-0.018044993,0.027130786,0.042777702,-0.010378086,0.06155452,0.004812972,0.03999107,0.011941291,-0.044395667,-0.018005492,-0.01106882,-0.032823022,-0.026442263,0.027032278,0.033251096,-0.0023214687,0.06081535,-0.03719547,-0.016377993,0.028427111,0.00038061474,-0.037977662,-0.009428509,-0.070841275,-0.04599814,0.064699575,-0.021742126,-0.033769228,0.049122836,0.04376377,0.004705496,-0.030764457,0.0060035707,0.020002987,0.007329896,0.038589906,0.003457146,-0.06626482,0.017380215,0.025137285,-0.008156166,-0.0318953,-0.010417585,-0.06798839,-0.033939496,0.076541975,0.01401266,-0.013789758,-0.044190668,-0.029243378,0.021522608,-0.08881269,0.04191674,0.055577986,-0.050621096,0.005319407,0.020495381,0.011709602,0.0018633909,0.007077969,0.014304101,-0.059216015,0.014932072,-0.014539206,0.013313723,-0.011508963,-0.018907906,0.04583704,-0.009387717,0.018236877,0.029055895,0.010394473,-0.0044091516,0.034629874,0.06595186,0.0033998198,-0.015573356,-0.033688895,0.0060818717,0.0762854,0.002982044,-0.009159743,0.03881407,0.07225039,-0.007006911,-0.042541444,-0.030046387,-0.032677624,0.06829759,-0.034530982,0.024177793,0.06431713,-0.009602425,0.009804079,-0.06763238,-0.004005431,0.013078635,-0.052230038,0.04727924,-0.023419993,0.028183265,-0.028471416,0.03543334,0.05205524,-0.058777303,-0.046292063,0.0143899815,-0.010897206,0.0025058307,0.02100477,0.025140386,0.034789596,0.021963188,-0.027633555,0.012325125,0.027834518,0.036695868,0.004641972,0.01870757,0.014540396,-0.0070671467,-0.02065641,0.0038513546,-0.013986062,-0.010593435,-0.040813945,-0.016228123,0.033931535,0.01826587,-0.013204104,0.048985317,-0.024178607,0.02024005,-0.010403187,-0.0031866909,-0.05603824,-0.02665398,-0.0063636764,-0.009681681,-0.025065178,-0.017761568,-0.09773182,-0.004504757,-0.013777498,0.029606227,0.0077402676,0.038128804,-0.024784531,-0.007160399,-0.025051838,0.07201765,0.031224787,-0.01791274,0.030185059,0.016812127,-0.02139225,-0.0012841336,0.02025081,-0.05049532,-0.024228228,-0.020792063,0.050985258,-0.017973969,-0.012358363,0.001727024,0.03211124,-0.026457649,0.0530817,0.015128283,-0.022763215,-0.04831773,0.014765165,0.025668742,0.017434292,0.0059397034,0.002320283,-0.019631388,0.020732641,-0.05764228,-0.020827949,0.028472204,-0.0052850316,-0.010298279,-0.043487117,0.05665929,0.017461443,0.0045833704,0.008472275,-0.012295602,0.022024967,-0.05032565,0.05394613,-0.023864508,0.009866096,0.033298563,-0.0087835,-0.046723224,0.006134145,-0.03780725,-0.061605033,-0.01683271,-0.0019215189,0.038785342,-0.011308142,-0.0047159973,0.034686342,-0.012355676,-0.081381574,0.007192538,0.045859728,-0.02089377,-0.011438011,0.06072085,0.04525444,0.015340139,-0.04233939,-0.019765815,-0.013378865,0.041548643,-0.019153565,0.0026534582,-0.033831555,-0.06359072,0.013039397,0.02378881,0.05838021,-0.05883226,-0.05593464,-0.005098727,-0.022209499,0.007741523,0.013092343,-0.004939129,0.021535661,0.016459132,-0.03942436,0.019560328,0.013378191,-0.013479126,-0.053333174,0.013899229,0.039297715,-0.0001545622,-0.0454497,-0.012438322,0.0101289,-0.006281717,-0.057452645,0.0009881405,-0.041333176,0.07200018,0.018624302,-0.010132803,-0.04072485,-0.0031036634,0.023116585,0.018542236,-0.035952166,0.035730753,-0.005870038,0.019447329,0.014460022,-0.014062008,-0.017056132,-0.004168694,0.06755606,-0.04516157,-0.03753099,0.027547026,-0.0005270544,-0.00016815733,-0.018104864,0.03286279,-0.039784368,-0.004102161,-0.011146525,0.022825059,0.015093859,0.018321479,0.028699102,-0.0054077897,-0.023064505,-0.014280864,-0.0020617077,0.007908886,-0.0486961,-0.06552315,0.025012054,-0.01904938,0.06794965,-0.013848722,-0.009854736,0.014341302,-0.03372388,-0.033228196,0.09242531,0.011729757,0.017722277,-0.0051230337,0.0049568205,-0.03721441,0.000254899,0.022685794,0.028564682,-0.054931004,0.00558272,0.027941853,0.065012895,-0.010245568,-0.060458273,-0.014230131,0.0006329424,0.03034533,0.06779042,-0.045919105,-0.023821529,0.010157211,-0.03596157,-0.0019042626,-0.021527918,-0.021656724,0.008186099,-0.008307734,0.030921297,-0.021557305,-0.088093795,-0.054305505,-0.06009739,-0.021284139,0.011267929,0.0064431345,-0.05050475,-0.063973494,-0.037427302,0.035246663,0.014790587,-0.0037878368,0.00794579,-0.016753802,-0.015886692,-0.066711,0.022213545,0.021281194,-0.045942403,0.015152663,-0.006752319,-0.0027872846,-0.01339335,0.01725754,0.030791514,-0.013160748]
25	0	2026-03-23 08:39:10.808411	f	\N	4000000.00	{}	4000000.00	─Éß╗ông Hß╗ô Nam Movado Bold Fusion 3600849 Quartz 42mm - ─Éß╗ông Hß╗ô T├ón T├ón	dong-ho-nam-movado-bold-fusion-3600849-quartz-42mm-dong-ho-tan-tan	{"Th╞░╞íng hiß╗çu": " MOVADO", "Mß║╖t ─æß╗ông hß╗ô": " Kim", "Kiß╗âu ─æß╗ông hß╗ô": " Thß╗¥i trang"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	107	6	[0.026823739,0.043452848,-0.009771682,-0.016327139,0.039718293,0.020866018,0.015046476,0.0063912175,-0.031372447,0.04000632,-0.016470158,0.027196717,0.054858033,0.037026882,0.00053748774,-0.03109545,-0.004224289,0.022111436,-0.10096551,0.0009834549,-0.021328637,0.004587459,0.04750394,0.01965456,0.013135311,-0.020158723,-0.011905468,0.03524721,0.016524175,-0.036208637,-0.012949781,0.043041486,-0.014396781,-0.0076147416,0.022979256,0.035374627,0.003299346,0.067452066,0.03239625,-0.05364206,-0.047927372,0.03682165,0.009133418,0.032269813,-0.03165488,0.0071717193,-0.014013701,-0.03167812,-0.034016583,0.036348112,0.054423753,0.0667745,-0.03441729,-0.021878535,-0.05045038,0.0005646616,-0.02196041,-0.021127624,-0.022184826,-0.00092635775,0.023478225,0.013081098,0.018199027,0.01647737,0.011642295,-0.034775883,0.026808225,-0.033777367,-0.051435445,0.022981865,-0.015920587,-0.009913475,0.011655786,0.052617125,0.043995894,-0.08683655,-0.021420455,0.0090404665,0.015108086,0.03968275,-0.009112612,-0.033350304,0.07891469,0.044265877,0.0277121,0.0073693516,0.0049967486,-0.09540661,-0.069020726,0.028459491,0.08613098,0.012137197,0.03442695,-0.027849603,0.06137969,-0.0077041467,-0.081361055,-0.12132251,0.10187353,-0.00042394848,0.028775075,0.0117542045,0.00680009,-0.07433245,0.017400902,-0.0037558982,0.030280717,-0.011308249,-0.049250543,0.041251134,-0.07615095,-0.041312024,0.034552906,-0.021621395,0.01788161,-0.025704747,-0.009795883,0.008415224,0.014862178,0.030451579,-0.024873925,0.013811499,-0.059980743,0.036233757,-0.005292396,-0.013522652,-0.015453903,-0.00866516,0.0037221091,-0.058532987,0.037714217,-0.10823197,-0.0198556,0.017176995,-0.028526692,-0.008636019,0.052352775,-0.008451039,0.023017319,0.009810047,0.028554222,-0.010214735,0.0012299791,0.030220503,-0.041805968,0.010690088,-0.039491087,0.016274119,-0.12552312,0.0049859527,0.019238453,-0.031494454,-0.014535094,-0.012794248,-0.010887143,-0.026286736,0.029251149,0.015403201,0.06826975,0.0123975435,0.005246295,-0.03913026,0.06990363,0.048319444,-0.031985875,0.07311358,0.029044282,-0.047790915,0.017382085,0.050637007,-0.0050851554,-0.08806328,-0.0032237694,-0.12832594,0.015405551,-0.016983401,-0.056323137,-0.026628733,0.018458191,0.06938023,0.079932384,-0.005118879,0.0009161794,-0.011861496,0.028677765,-0.034619767,-0.016909504,-0.027042616,0.02822494,0.044791207,0.0148769105,0.017082458,-0.00733723,0.04280978,-0.003875149,-0.062712975,0.008108952,-0.04692614,0.04175837,-0.008480563,0.030035678,0.009097878,0.013137025,-0.032182,-0.033053216,0.026638906,-0.053534128,-0.0415217,-0.009142562,-0.024807017,0.03707592,0.03140839,0.03230543,-0.03931669,-0.012099802,-0.040305194,0.06234838,0.0632023,-0.01617947,-0.05372007,0.014668781,-0.008221849,0.0101550715,0.039685186,0.025325408,0.0051250714,-0.0957483,-0.0057326853,0.040934283,-0.06895818,-0.0003700927,0.038994323,-0.007026076,0.023169428,-0.021467557,0.018390633,0.031226108,-0.023236347,-0.012869827,-0.014214784,0.044175614,0.04437132,0.07152965,0.07852962,0.04137177,-0.017121067,0.076975964,0.014076756,0.028723387,-0.05068543,-0.042962387,-0.01703094,0.03561978,-0.01067197,-0.027362077,-0.041904278,0.019417156,-0.04669489,-0.011141766,0.040942688,0.05302343,0.007653052,-0.02860647,-0.07056237,-0.027306711,-0.1056832,-0.017365059,-0.015504628,0.0481858,0.022699693,0.0010775526,-0.060961783,-0.017476782,-0.013654975,-0.015623511,-0.00013764128,-0.043660372,-0.0076615377,-0.04089885,-0.032411505,0.069613084,0.03289616,-0.0046564853,0.00065339456,0.018936029,-0.0327115,0.035325516,0.0012706596,-0.024576746,-0.016471095,0.033598803,0.0568342,0.03323934,-0.020971326,0.028288499,-0.0077349413,-0.0064100972,0.0017534987,0.014276706,0.018036993,-0.033608813,0.1052762,-0.020616064,-0.008430591,0.04408298,0.0062429933,0.014551248,-0.0019902447,-0.044310916,-0.052084167,0.02161666,-0.010828727,0.0025024887,-0.0708969,-0.025882933,-0.02947527,-0.1593107,-0.0033028475,0.00040699562,0.0020025477,0.02786325,0.016704554,-0.013073051,0.02904127,0.0028882837,-0.0027453417,0.010940159,-0.018060686,-0.002116866,-0.024818981,0.061961666,-0.0023902024,0.0009784405,-0.011184019,0.0032854634,0.0411623,-0.09823414,0.05155648,0.036312606,0.067368075,0.038247135,0.031635012,0.029840382,0.02124581,-0.05798336,-0.057766095,0.01647359,0.045853294,0.020934675,0.050869677,0.03715743,0.07146918,-0.017030321,-0.039771058,0.014501519,0.001933243,0.054110836,0.031690747,-0.008391036,-0.003762103,-0.024826704,0.023034157,-0.0018604525,0.03714394,-0.024947831,-0.0065630027,0.042029403,0.06419675,-0.038559545,-0.05518266,-0.0068525793,0.036333386,0.00062147615,-0.019139668,0.012803792,-0.002071341,-0.0023823385,0.06005431,-0.016469775,0.03508465,-0.028540242,-0.05439485,-0.0403858,0.03216296,0.040196665,0.045884676,-0.053468868,-0.033426713,-0.008059285,-0.008537419,-0.029337185,-0.006069481,0.0386788,0.0212405,-0.013418108,0.046298802,-0.031144528,0.055306476,0.017715856,0.012070878,-0.00290628,0.0057440945,0.044697527,-0.08743022,-0.04927688,-0.0072847665,0.033395663,0.0016724602,0.0022551946,-0.02333486,-0.012361132,-0.023752412,-0.037561364,-0.013329844,-0.036168814,-0.009289258,0.017281678,0.004382302,0.010208159,0.01490377,-0.011960532,0.075000174,0.03992288,0.013794817,0.038550366,-0.010900921,0.06698622,-0.020715747,-0.025595207,0.0388233,-0.0037256617,-0.03618716,-0.030980874,0.057038214,0.008343506,-0.0068704435,0.035832766,0.043118134,-0.01920585,-0.01037259,-0.0063653835,-0.03508385,0.06190176,-0.0064062322,-0.026500557,0.038736198,0.058985934,-0.0019764474,-0.04189258,0.0011576319,0.06379457,0.022828927,0.0115764905,-0.021718182,-0.007266413,0.017251732,-0.0039573824,0.021354575,0.024037605,0.021954188,-0.020740688,-0.05065661,0.027646774,0.04800423,-0.037257258,-0.0025488304,-0.008313941,0.011489403,-0.028580718,0.03508617,0.08613591,-0.045285556,0.028168702,-0.0036272074,0.01675273,0.012998947,0.022419488,-0.0021885978,-0.040894855,0.045145072,-0.004011705,-0.0068221134,-0.022843884,0.04595631,-0.005968119,-0.021191536,-0.016841132,0.0077482746,-0.06667398,0.04121958,-0.0023848896,0.045094814,-0.00857562,-0.07252922,-0.008189818,0.023090892,0.035465352,-0.024504935,-0.023552569,0.050746974,0.09240375,0.029996239,-0.029634103,-0.03701842,-0.013195077,0.059190866,-0.04256207,0.0022607958,0.06473932,0.0019396637,0.039178,0.034500495,-0.0077162273,0.017973753,-0.018477641,-0.013413057,-0.0744229,0.027348073,-0.020324051,0.046268787,0.040167876,-0.030002644,-0.018910237,0.022958381,-0.0024205407,0.0025092263,0.02340714,0.024148908,0.019990792,-0.0051489472,-0.04757465,0.03944009,0.055514585,0.049423106,0.014225673,0.029269401,-0.0067644073,-0.0007742495,0.038952563,-0.004225629,0.040929902,-0.024039216,-0.037442073,0.016276145,-0.00713251,0.019970076,-0.042442556,0.03892008,0.011944452,0.040410556,-0.013465843,-0.0005621991,-0.030246714,-0.025225518,0.004886268,0.0020445164,0.017124964,-0.06519041,-0.030997625,-0.022652969,-0.019320866,0.02293476,0.0041731815,0.03943549,0.0002915893,-0.03351412,0.024021516,0.09395194,-0.01299976,0.025109274,0.0392803,0.023105208,0.038498774,-0.050402466,0.06038959,-0.0081613045,-0.049958598,0.0038195623,0.048038185,-0.021546913,-0.012111183,0.037528444,0.03987934,0.026550798,0.034571156,-0.033979304,-0.020527344,-0.055843066,0.005808397,0.007477334,0.0060167424,0.012946099,-0.0021528227,-0.035338826,-0.010100808,-0.01087808,-0.029998552,0.007818059,-0.03672976,0.0030107587,0.004643633,0.013603572,0.022953946,0.036620513,0.039110325,-0.048913598,-0.034634314,-0.069459446,0.03498859,-0.007677336,0.0077227764,0.030386647,-0.014872876,-0.007054314,0.02877135,0.017086016,0.00027713066,-0.036134146,0.0012666443,0.007368242,0.019879254,-0.014827217,0.0026869175,0.011931734,-0.06805303,0.03216912,-0.00037987783,-0.0116792135,-0.02206089,0.016491637,0.014944941,-0.0048092795,-0.030116195,-0.039631896,-0.0070122327,0.07234001,0.028505698,-0.021259265,0.05294992,-0.063632235,-0.025789905,-0.010149651,0.06976112,-0.0059788288,0.013597787,0.048407536,0.027815692,0.03016431,0.054511916,0.0030315432,0.04652043,-0.0004870493,-0.03970631,-0.002879439,-0.021085994,0.039349303,-0.038147382,-0.015284548,-0.01041041,0.039351147,-0.005179383,0.0038665526,-0.016768424,0.022930406,-0.0112064,0.020205207,-0.0060497606,0.015325586,0.015092255,-0.0686308,0.005078961,-0.022857258,-0.020348104,0.010023482,-0.0011920544,0.055045627,-0.0016360539,0.015044634,-0.027038518,-0.041723326,-0.0056908606,-0.044804677,0.041861005,-0.029436965,0.0009095573,-0.0023095275,-0.050530806,-0.019163186,0.028587405,-0.00053440296,-0.02922713,-0.003280254,-0.009390954,0.055473693,0.016376337,0.025456471,0.020175627,0.019647188,-0.008396195,0.0072140596,0.0026217983,-0.040123407,-0.0028752664,-0.03091059,-0.014597895,-0.06157762,-0.010560981,0.0052208295,-0.025615407,-0.02241906,-0.041320425,-0.016333966,0.06856703,-0.020120183,-0.0061702654,0.032388672,0.042709835,-0.028551888,-0.0037486814,0.05699291,0.008235852,-0.014685911,-0.009054447,0.0243103,0.059968296,-0.01650818,-0.073956236,0.01134596,-0.025965594,0.040580582,0.052288324,-0.012104865,-0.04832585,0.013194025,-0.04984228,0.014003985,-0.0076489095,-0.08176199,-0.043186285,-0.007609026,0.06370485,-0.032012835,-0.059718236,0.007604605,-0.049188048,0.030077547,-0.002679988,-0.0035811546,-0.027476946,-0.030676175,-0.03521001,0.06075612,0.020540787,-0.0052552293,0.012286137,-0.038163178,-0.009038351,0.015820853,0.03128689,0.0021666004,-0.028599268,0.04391829,0.05057027,0.007363221,-0.0048729144,-0.0040587056,0.015108421,-0.042169288]
15	0	2026-03-23 07:49:24.641125	f	<h1></h1><p>Giß╗¢i thiß╗çu sß║ún phß║⌐m:</p><p>- Size: 23 x 18 x0,2cm</p><p>-L├│t chuß╗Öt T1 c├│ thiß║┐t kß║┐ bß║»t mß║»t, ─æß╗Öc ─æ├ío vß╗¢i m├áu sß║»c v├┤ c├╣ng ß║Ñn t╞░ß╗úng gi├║p hß║ín chß║┐ chai v├á cß╗⌐ng cß╗ò tay khi sß╗¡ dß╗Ñng chuß╗Öt qu├í l├óu, mang mß╗Öt ─æiß╗âm nhß║Ñn c├í t├¡nh cho b├án l├ám viß╗çc, g├│c hß╗ìc tß║¡p cß╗ºa bß║ín.</p><p>- Miß║┐ng l├│t chuß╗Öt c├│ bß╗ü mß║╖t l├ám tß╗½ vß║úi v├á mß║╖t d╞░ß╗¢i l├á cao su, ├¬m ├íi gi├║p ph├ón t├ín ├íp lß╗▒c, mang ─æß║┐n cß║úm gi├íc thoß║úi m├íi cho tay kß╗â cß║ú khi khi sß╗¡ dß╗Ñng chuß╗Öt trong thß╗¥i gian d├ái.</p><p>- ─Éß║╖c biß╗çt miß║┐ng l├│t chuß╗Öt vß╗¢i k├¡ch th╞░ß╗¢c nhß╗Å gß╗ìn ph├╣ hß╗úp cho nhiß╗üu loß║íi chuß╗Öt m├íy t├¡nh nh╞░ chuß╗Öt quang, chuß╗Öt bi v├á hß║ºu hß║┐t c├íc loß║íi chuß╗Öt laser th├┤ng dß╗Ñng. T├¡nh n─âng n├áy gi├║p bß║ín sß╗¡ dß╗Ñng hiß╗çu quß║ú h╞ín v├á kh├┤ng phß║úi thay mß╗¢i khi bß║ín ─æß╗òi loß║íi chuß╗Öt m├íy t├¡nh.</p><p>#tamlotchuott1</p><p>#mienglotdichuot</p><p>#lotchuotgiare</p><p>#lotdichuot</p><p>#lotchuott1giare</p><p>#mienglotchuot</p><p>#sieure</p><p>#dichuot</p><p>#lotchuot</p>	11000.00	{}	11000.00	Miß║┐ng l├│t chuß╗Öt Logitech gi├í si├¬u rß║╗ (23 x 18cm)	mieng-lot-chuot-logitech-gia-sieu-re-23-x-18cm	{"Gß╗¡i tß╗½": "TP. Hß╗ô Ch├¡ Minh", "Game chuy├¬n dß╗Ñng": "C├│"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	3	[-0.000457643,0.01719581,-0.032455973,-0.015793992,0.067192025,-0.0358075,0.01772667,-0.009667254,0.040108997,0.007998632,-0.043346208,0.028378747,0.059914228,-0.013491784,0.045616217,-0.00070715015,0.0019811627,0.01753617,-0.12685828,0.016512942,0.042913493,0.020898752,0.042299863,0.053997144,-0.084367946,-0.074342,0.033245366,0.0061550178,0.038623795,-0.09381426,0.009593406,0.06853336,-0.008350854,-0.022372264,0.037219934,0.060852926,-0.023267344,0.04028349,-0.035200715,-0.047649723,-0.027456399,-0.006392371,0.022217194,0.034215678,0.012743523,0.016456876,-0.0009850711,0.07162298,-0.04173893,0.0075873197,0.0068766284,-0.021200323,-0.014721809,0.054137323,-0.035032555,0.011230508,-0.0236851,-0.044654768,-0.0151618095,-0.013198312,0.019355493,0.026764538,0.023382237,-0.0121099325,-0.025413388,-0.023008388,-0.024954565,-0.022984594,-0.014343522,-0.025389832,-0.055732395,0.012068546,-0.050662175,-0.018641599,-0.0078057935,-0.022642545,-0.011932014,-0.011193752,-0.015553509,0.053213816,-0.027317662,0.017462254,0.07499326,0.068007015,0.056865796,0.012852982,0.015727902,-0.06295601,-0.07678164,-0.018576492,0.015890542,-0.009213703,0.00969137,-0.019763744,0.08546208,0.010105644,-0.13090767,-0.07339382,0.10503847,0.05949457,-0.0026475042,0.018503953,0.010496244,-0.1387419,0.0567135,0.0028844653,0.0178321,-0.03189309,-0.020105885,0.030928725,-0.074968666,-0.05126575,0.040300336,0.03064319,-0.0022784919,0.042679638,-0.036284547,0.021429008,-0.0048842384,-0.036807723,0.007330372,0.022165256,-0.047055174,0.01267511,-0.00037422922,0.004970722,-0.022065565,0.0044723987,-0.03188028,-0.030711563,0.0055499617,-0.11433708,-0.06803433,0.018919414,-0.07087194,-0.023233272,0.019939417,-0.027280867,0.036813255,0.059726518,0.029069923,-0.04963527,-0.03671428,0.015342233,-0.0059055113,0.0067032534,-0.014162328,0.030317202,-0.066258,-0.01728877,-0.013512668,-0.0470028,-0.033703234,-0.031696454,0.004131253,0.022100411,0.028453058,-0.012882998,0.088428006,0.031370845,0.013860534,-0.025583178,0.012888018,0.03180029,-0.019599851,0.0044697113,-0.011167402,-0.065611295,0.05642751,0.021094562,-0.036588002,-0.04471432,0.016955629,-0.05590355,-0.013481947,-0.049300358,-0.03335307,-0.026269851,0.0172574,0.04131508,0.031429853,0.04599485,0.014879078,-0.022647874,0.020184916,-0.004669355,0.012061404,0.0032106978,0.02900799,0.034548517,-0.019286292,0.033141818,0.025707463,0.04293255,-0.056678906,-0.043338425,0.05506526,-0.0033404646,0.0366637,-0.011137817,0.02898533,-0.0069798767,-0.07029821,-0.06954763,0.012160882,0.07429387,-0.026741022,-0.046745893,0.052792687,-0.01963938,0.0052805687,-0.009341096,0.030589353,-0.044956665,0.015552767,0.00039733053,0.032769676,0.011994509,0.016913846,-0.009731397,0.018360747,0.016817542,0.09518421,0.024945786,0.051997676,0.03477751,-0.00048292204,0.024667788,-0.03185248,-0.065403566,-0.013124524,0.038660076,0.0122611895,0.039651524,0.001970139,0.07104123,0.05872205,-0.015484249,-0.008490337,0.050633516,0.02364093,0.08895944,0.06846268,0.040427726,0.030505251,-0.04658919,0.09007416,0.050714713,0.008484077,-0.05941192,-0.022793667,-0.054370433,0.014374075,0.00986071,-0.034306873,0.010232055,0.048737377,0.023035368,-0.018712508,-0.040610187,0.056240857,0.009398531,-0.01616395,-0.053566366,-0.0012303407,-0.08233698,-0.0073881284,-0.020561391,0.038262457,-0.009451116,-0.035157077,-0.04666001,0.0032600723,0.037669998,-0.03154822,-0.031896986,-0.034808747,0.018332398,-0.061046246,-0.056793634,-0.025327075,0.033320505,-0.06420392,0.041490495,0.01301795,-0.06378163,-0.0026928717,0.01306759,-0.024876624,0.00323043,0.01845383,0.047097895,-0.010890244,-0.07248445,0.022012359,0.027424473,-0.015091563,-0.00016052037,-0.040825587,0.008952152,-0.021457529,0.066999935,0.012032333,0.023107575,0.031017032,-0.015899979,0.049816787,0.008193441,0.0054227766,-0.0035524922,0.012186647,0.053992704,-0.0836264,-0.0533851,0.019795107,0.000112947244,-0.15153632,-0.01761734,0.014891591,0.024402272,0.033957634,-0.0015328767,-0.05138428,0.021962155,0.024157843,-0.009073106,-0.024946816,-0.012150968,0.0037723759,-0.02447414,0.014498005,0.007974663,0.007868444,-0.0046286066,0.00535576,-0.008898472,-0.059825253,0.043256626,0.051314,0.028394902,0.0022121803,0.023595857,0.015680261,0.054924805,-0.03150967,-0.08419811,-0.008936759,0.026233338,0.0034207995,0.023915792,0.03971524,0.023658257,0.032571927,0.003820527,0.011290212,0.0051993774,0.03420045,0.014142529,-0.00012765337,-0.041660912,0.0138851665,-0.035961747,-0.07414122,-0.013545974,0.030005643,-0.020741306,0.044028923,0.03316552,0.005847934,0.0005767396,-0.056133077,0.061775554,-0.010156221,0.04194326,0.008548013,0.0054467213,-0.009296868,0.029964574,0.034660913,-0.009203297,-0.01654148,-0.061879106,-0.0014136856,0.027138727,-0.013970739,0.054088067,-0.065492585,-0.016859949,-0.026101245,-0.007275446,-0.027563576,0.01735877,0.0059386543,0.008321568,-0.047667537,0.067347206,-0.037101403,0.026912017,-0.016413368,0.023172015,0.0030974497,-0.02978428,0.0847358,-0.065513164,-0.024817677,-0.0051632063,0.004582382,0.013629747,0.009803062,0.020099608,0.02748232,-0.014899805,0.015784215,0.016575793,-0.056844566,-0.0018648801,0.01574559,-0.055975597,0.02863573,0.023777043,0.013675678,0.026911117,0.027777001,0.025472257,-0.015203608,-0.05604292,-0.0047410545,-0.016270272,-0.051894672,0.013884852,0.053784557,0.06402015,-0.0135060465,-0.02393913,-0.0058845524,-0.00497386,0.036353495,0.0048917956,0.015607599,0.014587497,-0.03722267,0.0030406055,0.010596226,-0.009868114,-0.053135924,0.013095454,0.03982501,0.019064857,-0.03176191,-0.062104672,0.030158143,-0.04173515,-0.0016595442,-0.021969156,-0.038151637,-0.05650089,-0.01531987,0.0916608,0.012072235,0.03297138,-0.042384297,-0.033576038,0.018380888,0.023786189,-0.008586603,-0.02613722,-0.023577327,-0.039870862,-0.02157088,0.0646607,0.071848944,-0.03919347,-0.034028187,0.008582678,0.016240418,-0.018185684,0.008886335,0.016840791,-0.04236452,0.006434785,-0.03713815,-0.013134938,0.0049176337,0.009190412,0.05336054,-0.035338517,-0.025668152,0.057954792,0.0131429825,0.01580618,0.018673789,0.077222995,0.016342934,-0.038927257,-0.021791114,0.029807616,0.0474394,0.014060353,-0.039163634,0.0046775006,0.07564364,0.0119199,-0.008602203,-0.01548712,-0.019672584,0.005055464,-0.06695251,-0.028897839,0.018600132,-0.0173313,-0.015993737,0.027851783,-0.02376718,0.05749089,0.0141274035,0.013957964,-0.019586029,-0.009129976,0.030413607,0.015485823,0.022161271,0.008634949,-0.0015826556,0.010599107,-0.020766933,0.009741837,0.014823026,0.011776917,0.013175521,-0.0231182,-0.069267936,0.031436075,0.07745831,0.008129292,-0.006697056,0.060669985,-0.012229906,-0.01601975,0.020243872,0.02330499,-0.011209014,-0.0036207454,-0.0050422004,0.04811294,0.015761206,0.008389162,0.011168306,0.038229525,-0.044871774,0.10081186,-0.09238367,-0.010569445,0.0020805318,-0.011983015,-0.0011233775,0.017333955,0.01535313,0.003947623,-0.06854607,0.004083964,-0.03454325,0.009848275,-0.020768026,-0.032063324,0.032917187,-0.01040367,0.045112517,0.04520364,-0.012863374,0.0078028934,0.0045281504,-0.012581017,-0.010335481,0.021093545,0.014858252,-0.031846307,-0.014244722,0.0038761871,0.057439175,0.008556802,-0.023119818,-0.00023726987,0.033260208,-0.0051640198,-0.0073589,0.0054034097,-0.0019066128,-0.0010783608,0.0155240595,-0.009206174,0.04807488,0.017837778,-0.032496873,-0.058612537,0.04966514,-0.0051616775,0.009542504,0.07204622,0.051179465,-0.015426082,-0.010742991,0.02321551,-0.0025694147,0.013102108,0.04213687,-0.023882292,-0.009687764,-0.026110781,0.04126566,-0.01773903,-0.011982296,0.041814778,-0.021380734,-0.013341111,-0.002102464,-0.0141284475,0.014114413,0.016441861,0.05037805,0.041601088,-0.029756792,-0.035077002,0.038967766,0.00033387987,-0.056506444,0.044494137,0.006659589,0.019323636,-0.018007956,0.029708976,0.0042841686,0.0023810598,-0.004699949,-0.047309224,-0.024704244,0.03480436,0.048732053,0.023975747,-0.0028460587,-0.069102764,0.019263437,0.047305107,0.045328207,-0.03647909,-0.04019116,-0.004805606,-0.001987183,-0.021998752,-0.008524776,0.007118699,0.006668696,0.032860413,-0.06885803,0.02683795,-0.053395435,0.015646234,-0.05504935,0.039005056,0.008577142,0.03060449,0.03949751,0.0055478914,-0.012915264,0.0032819633,0.0033403109,-0.0382358,-0.063022986,0.03586637,-0.010054508,-0.06556162,-0.011614587,0.066910885,0.00871772,0.0017946555,-0.029084157,0.06842828,-0.0104545755,0.0056911823,-0.022070115,-0.009259936,0.0008398188,0.00219259,0.024972003,-0.025195412,0.01280958,0.025411747,-0.0051642233,0.0053031794,0.016958324,0.05311205,-0.011107037,0.012619595,-0.015795346,0.05476275,0.0047162883,0.036408827,0.01867274,0.010706933,-0.031389445,-0.020969594,0.00782823,0.021013703,-0.023157071,-0.055702526,0.01771453,-0.022676267,0.052457165,0.030720888,-0.014258885,0.014449634,-0.0059179226,0.02670941,0.002631229,-0.011775679,-0.005710699,-0.01518896,-0.0031460302,-0.022725396,-0.025548406,-0.009809811,-0.01785817,-0.015164205,0.021777242,0.052603148,0.04530707,0.010115097,-0.051188197,0.010858656,-0.024952801,0.050112728,0.07169548,-0.048303355,-0.034532744,0.03321719,-0.056775365,0.011272653,-0.025283903,-0.010758223,0.0020639063,-0.022275886,0.0052724164,-0.013549925,-0.03560423,-0.013188643,0.0042289947,0.041361485,0.008564051,0.051533483,-0.0048075565,-0.055836566,-0.03797827,0.027834069,0.043838363,-0.019430168,0.020234432,-0.008981178,-0.019172728,0.0088172695,-0.04640334,0.048722513,-0.032576803,0.008058208,0.017383125,0.00043312606,-0.04064228,-0.014929408,0.06630752,0.043795183]
29	0	2026-03-23 08:52:09.170252	f	\N	2000000.00	{}	2000000.00	Tai nghe gaming kh├┤ng d├óy ASUS ROG CETRA TRUE Wireless, chß╗æng n╞░ß╗¢c IPX4, c├┤ng nghß╗ç chß╗æng ß╗ôn ANC	tai-nghe-gaming-khong-day-asus-rog-cetra-true-wireless-chong-nuoc-ipx4-cong-nghe-chong-on-anc	{"Th╞░╞íng hiß╗çu": "Asus", "Kiß╗âu kß║┐t nß╗æi": " Kh├┤ng d├óy"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	108	7	[-0.0013185127,-0.010785099,-0.019737685,-0.03981848,0.06110627,-0.018856358,0.034996934,0.017356953,0.026239453,-0.030950926,-0.035348583,0.046457585,0.09369909,0.015788442,-0.04787716,-0.03731272,0.017449632,-0.021922627,-0.12719952,0.014059227,0.012486974,0.0104472665,0.025595592,0.012433119,-0.022722013,-0.015927287,0.017204802,0.019557191,0.0078979675,-0.05250303,0.06968789,0.010512911,-0.040663175,0.021972422,0.01793623,-0.026286159,0.029396132,0.015696589,0.0063320855,-0.03296438,-0.053872027,0.046236206,0.03405166,0.020390622,0.02341898,-0.031224536,0.00907598,0.039992027,-0.02801563,0.00012174954,0.041621223,-0.0019409261,-0.042676903,-0.0023920005,-0.024836676,-0.026448805,-0.010057206,-0.026257427,-0.029508933,-0.028658332,0.0610736,0.008802165,-0.006066983,0.016658429,-0.020298358,-0.041031018,0.0055548893,-0.011208378,-0.0153782265,-0.0055434555,-0.07607502,-0.06452404,0.0017843988,0.02811001,0.023264747,-0.061381403,-0.012149914,-0.028105918,0.0041910214,0.080775715,-0.03105025,-0.00036747658,0.13546619,0.02442573,0.0082219485,-0.068447545,0.04819251,-0.059435967,-0.044171173,-0.046363827,0.08863089,-0.012460816,-0.008700737,0.0136628635,0.041178085,-0.018698283,-0.07762905,-0.096331775,0.093786694,0.02197683,0.00044959894,-0.020992918,0.0030400602,-0.046484098,0.023651801,0.04553963,-0.02155241,0.018381681,-0.011643435,0.020239323,-0.017839132,-0.0573172,0.020628551,-0.008796387,-0.017954841,0.010291606,-0.03712498,0.014355394,-0.01687243,-0.010657794,0.031291727,0.015395181,-0.04719422,0.017395247,0.0244154,0.027204549,0.014272248,-0.02603043,-0.05083184,-0.03438849,0.021958174,-0.10749483,-0.028216887,0.0117224045,-0.033822946,-0.03632135,0.05523524,0.0079937,0.0469194,0.01052338,-0.009061085,-0.02280315,-0.058747023,-0.00043407475,-0.036542594,0.00567229,-0.04057369,0.062414445,-0.049007777,0.019930938,0.001509205,-0.02323527,-0.03410837,-0.04523876,0.040330175,-0.06556066,0.07481098,-0.0440853,0.0429413,-0.033811066,0.024071384,-0.025683904,0.032942273,-0.01600278,-0.025655309,-0.0024259428,-0.05104491,-0.063776314,0.02440991,0.027319256,0.0009435756,-0.034449708,0.04266696,-0.06908968,-0.0228472,-0.025004908,-0.054394305,-0.0278203,0.004278464,0.040415537,0.042678766,0.049538463,-0.022861714,-0.03559736,0.02806191,-0.003145661,0.018611526,-0.044966802,0.0025541058,0.015627753,0.007777754,-0.0038985424,0.011757154,0.051060006,0.013854637,-0.05418114,0.03691129,0.027734736,0.06501883,-0.019908119,0.0017726799,-0.0300482,-0.00040268118,-0.06526838,-0.027139371,-0.021697588,-0.025521755,-0.052769475,0.033981483,0.0024344,0.0313464,0.04481906,0.005275387,-0.05734584,-0.028892117,-0.007006968,0.012532613,0.04917199,0.015690045,-0.042457152,0.085521296,-0.0057226457,0.06210076,0.041054152,0.04372488,0.062811635,-0.032200936,0.025192501,-0.008907639,-0.046455704,0.01848587,0.016200105,-0.0061350325,0.012377593,-0.024184175,0.022927232,0.04412463,-0.032445736,0.034079485,0.0136791,0.048406187,0.063351594,0.08122603,0.0068394206,0.061276607,-0.025292886,0.036455184,0.022497693,0.015520926,-0.051088937,0.0009599403,-0.08083472,0.018613117,0.0380159,-0.06204922,-0.031088263,0.027414355,0.006291861,-0.038173124,0.0029370876,0.047560643,0.016250992,0.019307734,-0.046390668,-0.023271393,-0.12045327,-0.025706341,-0.029840622,0.08332617,0.01234847,0.03147135,-0.0362859,-0.019459913,-0.0043848,-0.053623326,-0.0013251842,-0.067755215,0.0013237166,-0.05296747,-0.027443962,0.0203199,0.046606634,-0.03040109,0.04256644,0.000101468075,-0.06343967,-0.003164035,0.05512479,0.0013849894,-0.04191994,-0.01035785,0.07289157,-0.041452907,-0.047929488,0.052626476,0.010044865,-0.013548164,0.028614378,0.004446645,-0.0047447323,-0.028999157,0.06305308,-0.030375948,-0.0142084295,-0.0034641712,-0.019481516,-0.0033444436,0.0025943443,-0.019691154,-0.025469985,0.0050925096,0.023651758,-0.038714062,-0.019774219,-0.0131103825,-0.018932372,-0.13886671,0.0050879703,0.031943943,-0.0010107365,0.027815038,-0.01869311,-0.022810392,0.021020997,0.007389223,-0.0017748828,-0.017540425,0.002907315,-0.002752128,-0.048326608,0.0029804872,0.012765343,-0.030754749,-0.044115145,-0.019639656,0.0103289,-0.043886393,0.033612624,0.07843863,0.087674454,0.036699485,0.0585955,0.018847631,0.046736065,-0.06713862,-0.07698689,0.037315965,0.025486646,0.056913525,0.0317264,0.03294426,0.08350324,-0.009122066,-0.03289797,-0.026402202,-0.042331982,0.033987135,0.019453917,0.0038788805,-0.048085477,-0.010888764,0.036686804,-0.009858075,0.030424288,-0.01877671,-0.052898064,0.07483856,0.050367974,-0.037638,-0.026172884,-0.05466756,0.049671765,0.0059435973,0.006059174,-0.023900105,-0.01642768,0.041200027,0.03355518,0.026143642,-0.01039833,7.7075434e-05,-0.05882171,0.004214454,0.012474813,-0.012635034,0.077310726,-0.034511596,-0.034732085,-0.06940386,0.038647644,0.009337684,0.0474333,0.0027662236,0.03449616,-0.058335416,0.100797124,0.0010401357,0.060661677,0.02209711,0.05872307,-0.019687122,-0.02448557,0.080690496,-0.054495733,-0.028952407,-0.01051829,0.0046299063,-0.0007714601,-0.027523994,0.011128924,-0.00486394,-0.008878122,-0.023149647,0.02221591,-0.047824275,-0.022448469,0.030610828,-0.027075576,0.008105334,-0.0006053035,0.009447991,0.019879583,-0.012844574,0.03270134,0.035346713,-0.028412186,0.013300642,0.004734755,-0.013645519,0.013829683,0.02801921,0.057399683,-0.026397146,0.03468667,0.012371292,0.019180164,0.018007226,0.031091724,0.0072577884,0.01858755,-0.08202565,-0.010758898,-0.0036796238,0.0063976697,-0.04822201,0.0493837,0.07606092,0.019553097,-0.017550733,-0.00420143,0.0003301849,0.031733487,0.013479748,-0.00782321,-0.010941945,0.020850815,0.0038587798,0.035291396,0.00010523513,-0.007490701,-0.01304279,-0.033235874,0.04242571,0.029404692,-0.030452503,-0.027042404,-0.0037167964,0.008397453,-0.049549367,0.022443779,0.065169156,-0.02316884,-3.5517518e-05,-0.05593823,-0.027822305,0.0134834,0.0004347018,0.03400642,-0.07143703,0.033750787,0.0023559034,-0.0071169217,-0.025466278,0.043756213,0.04420252,-0.026579117,-0.028282905,0.018578783,0.04696403,0.02411513,-0.00037323637,0.053317044,-0.0062392633,-0.044058446,-0.000790212,0.05961522,-0.0019257759,-0.0076676807,-0.009823819,0.017491344,0.07548353,0.0335425,0.001745951,-0.025434958,-0.029920338,0.03346386,-0.03130913,0.043410614,0.058445353,-0.010981534,0.012829586,0.00035427557,0.014691227,0.008469765,-0.01847212,0.030569827,-0.06449827,0.005974554,0.016227003,0.03253836,0.063191436,-0.06805728,0.047830246,0.033424444,0.03540891,0.001664589,0.0043636295,0.009804428,-0.022288159,-0.0092802355,-0.023449691,-0.026238913,0.039556094,0.046180923,0.0047507463,0.022902546,0.036923777,-0.037532352,-0.0047692163,0.030816777,-0.0068638697,-0.028825557,-0.04954915,0.04344481,0.010572107,0.031435393,-0.017300313,-0.0064808866,-0.007801151,0.059421398,-0.047392562,-0.004524234,-0.043301597,0.014852182,0.017914938,-0.012809947,0.01785745,0.008080773,-0.03440811,-0.032739647,-0.0058800373,0.043482535,-0.012528137,-0.008440222,0.019941436,-0.018932248,0.03319322,0.09082765,0.0027397105,-0.024442175,0.0024664348,0.025533972,0.009083953,-0.0028902625,-0.019710448,-0.036263514,-0.022879487,0.018187342,0.050408196,0.012886362,-0.018498002,0.01519018,0.03780937,-0.023086656,0.0051344545,0.009609954,-0.004811786,0.0046350462,-0.006133316,-0.030393032,-0.0004612976,-0.019315442,-0.012307961,-0.0059877425,0.0096187275,0.01266627,-0.0020409722,0.008702188,-0.018156301,0.010726053,-0.019207943,0.023132423,0.02520706,0.020194478,0.020957949,-0.05586129,0.005492332,-0.04312361,0.042765062,-0.057680648,-0.028814668,0.010609012,-0.035047267,-0.042091552,-0.03381552,-0.031602286,0.018350689,0.02700736,0.013749445,0.0056737303,-0.022872895,-0.009162834,0.051066414,-0.033408184,-0.06966025,0.031471863,0.0009459483,-0.040029768,-0.022991138,0.009666869,0.024320414,0.021192905,-0.014019607,-0.020174447,-0.025462572,0.032515954,0.0011355256,0.019618254,0.0055925525,-0.07927991,0.026677543,0.034796417,0.07071962,-0.047400795,-0.022555003,-0.0042647654,0.03301395,-0.0072965077,-0.01659757,0.048086304,0.0014336307,0.054019865,-0.09323422,-0.003098623,-0.05670911,0.0022451838,-0.028680246,0.016495628,-0.024800811,-0.0032683217,-0.0010733969,-0.03255995,-0.004707328,0.047591094,0.0033625388,-0.037585385,-0.024327213,0.04162377,0.04856376,-0.022699745,-0.02494411,0.0067985966,0.033392247,0.018511187,-0.045385595,0.10395118,0.045135595,0.021108633,-0.036311828,-0.00024579887,0.018928723,-0.054965664,-0.010422942,-0.011228094,0.017959533,0.009820393,0.005257891,0.019112911,-0.011648975,0.058421236,0.012937752,0.007250992,-0.039661717,0.06789594,-0.025046106,0.014640299,-0.018093672,0.0374751,-0.07176739,-0.013130224,0.0055857147,0.010580005,-0.044384137,-0.084334835,0.014041253,-0.017902624,0.020145431,-0.00093785423,0.01382786,0.029301828,-0.0099881515,-0.0027163108,0.0115213115,0.040623702,0.0111978715,0.04566855,0.004394683,-0.007686054,-0.024112152,-0.004002211,-0.00082652486,-0.026603442,0.019830825,0.05954962,0.0547126,-0.02803245,-0.038126208,0.015093768,-0.035722356,0.04580071,0.042072393,5.061343e-05,-0.018930322,0.03785435,-0.0682339,-0.004165616,-0.040081304,-0.06220737,0.008640548,-0.0011172693,-0.0070100552,-0.017898668,-0.053171903,0.015793856,-0.012712151,-0.016312132,0.025976332,0.030962111,-0.027144464,-0.010909241,-0.03183224,0.061721437,0.029466432,0.0031792175,0.036246303,-0.02668823,0.008846562,-0.007385205,-0.011438112,0.035271913,-0.019234633,0.051189963,0.050151687,0.013884884,-0.036388595,-0.037037116,0.03886117,-0.029584553]
19	0	2026-03-23 08:10:23.791934	f	<p>T├¬n sß║ún phß║⌐m: ├üo S╞í Mi Nam Kß║╗ Trß║»ng Aristino Slim Fit ASS619EDP01</p><p>M├ú sß║ún phß║⌐m:&nbsp;ASS619EDP01</p><p>Kiß╗âu d├íng: Slim Fit</p><p>Thiß║┐t kß║┐:</p><p>├üo s╞í mi phom slim fit ├┤m vß╗½a vß║╖n, t├┤n d├íng gß╗ìn g├áng, mang lß║íi cß║úm gi├íc thoß║úi m├íi v├á linh hoß║ít cho ng├áy d├ái n─âng ─æß╗Öng.</p><p>Tr├¬n nß╗ün chß║Ñt liß╗çu cao cß║Ñp l├á hoß║í tiß║┐t ─Éan L├ít ─æ╞░ß╗úc lß║Ñy cß║úm hß╗⌐ng tß╗½ nghß╗ü m├óy tre ─æan truyß╗ün thß╗æng, tß║ío n├¬n vß║╗ chß╗ën chu hiß╗çn ─æß║íi nh╞░ng vß║½n ─æß║¡m chß║Ñt v─ân ho├í Viß╗çt Nam.</p><p>Chß╗» k├╜ Aristino th├¬u sß║»c n├⌐t ß╗ƒ tay ├ío l├á ─æiß╗âm nhß║Ñn ho├án thiß╗çn, khß║│ng ─æß╗ïnh dß║Ñu ß║Ñn th╞░╞íng hiß╗çu v├á ─æß║│ng cß║Ñp cß╗ºa qu├╜ ├┤ng hiß╗çn ─æß║íi.</p><p>Chß║Ñt liß╗çu:</p><p>49.4% Rayon thß║Ñm h├║t tß╗æt, chß╗æng nh─ân v├á mang lß║íi bß╗ü mß║╖t mß╗üm mß║íi, dß╗à chß╗ïu.</p><p>47% MicroFiber cho bß╗ü mß║╖t vß║úi b├│ng mß╗ïn, sß║»c n├⌐t, giß╗» phom tß╗æt, hß║ín chß║┐ nh─ân nh├áu.</p><p>3.6% Spandex tß║ío ─æß╗Ö co gi├ún gi├║p linh hoß║ít v├á thoß║úi m├íi khi chuyß╗ân ─æß╗Öng.</p><p>M├áu sß║»c: Xanh t├¡m than kß║╗ trß║»ng</p><p>Size: 38/39/40/41/42/43</p><p>Sß║ún xuß║Ñt: Viß╗çt Nam</p><p>H╞░ß╗¢ng dß║½n bß║úo quß║ún v├á giß║╖t ß╗ºi:</p><p>Giß║╖t ß╗ƒ nhiß╗çt ─æß╗Ö kh├┤ng qu├í 30┬░C.</p><p>Kh├┤ng sß╗¡ dß╗Ñng chß║Ñt tß║⌐y mß║ính.</p><p>L├á/ß╗ºi ß╗ƒ nhiß╗çt ─æß╗Ö thß║Ñp.</p><p>Ph╞íi n╞íi tho├íng m├ít, tr├ính ├ính nß║»ng trß╗▒c tiß║┐p ─æß╗â giß╗» chß║Ñt l╞░ß╗úng vß║úi v├á m├áu sß║»c.</p><p>L╞░u ├╜:&nbsp;H├¼nh ß║únh chß╗ë mang t├¡nh chß║Ñt minh hß╗ìa. Sß║ún phß║⌐m thß╗▒c tß║┐ c├│ thß╗â kh├íc vß╗ü m├áu sß║»c do ├ính s├íng khi chß╗Ñp ß║únh hoß║╖c m├án h├¼nh hiß╗ân thß╗ï.</p>	560000.00	{}	450000.00	├üo S╞í Mi Nam cß╗Öc tay Kß║╗ Trß║»ng Aristino d├íng Slim Fit, chß║Ñt liß╗çu mß╗üm mß╗ïn, hß║ín chß║┐ nh─ân ASS619EDP01	ao-so-mi-nam-coc-tay-ke-trang-aristino-dang-slim-fit-chat-lieu-mem-min-han-che-nhan-ass619edp01	{"Mß║½u": "Sß╗ìc caro", "Phong c├ích": "C╞í bß║ún", "Chß║Ñt liß╗çu": "Cotton"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	105	5	[0.003733886,0.026861291,0.004293992,-0.024353467,0.034974992,0.014627856,-0.011996014,0.012135159,0.005461635,0.043091793,-0.015471729,0.00082693086,0.06283198,0.006782308,0.00844173,-0.03810399,-0.017533865,-0.00963872,-0.084931575,-0.011293359,-0.021448886,-0.0110263545,0.053724833,-0.015663156,-0.04261698,-0.030531954,0.032223266,0.040094495,0.040368646,-0.06362448,0.03175311,0.031757966,-0.01002169,0.021582566,0.015056904,0.025557807,-0.032363426,0.042362843,0.0009752114,-0.0386453,-0.026340736,0.050530314,0.0073246737,0.07370427,-0.027746988,-0.019648198,0.0058849356,0.03492717,-0.025064632,0.050235532,0.063961804,0.015071086,-0.028085347,0.010822157,-0.017986165,-0.05619061,-0.025949571,-0.019536823,0.03463308,-0.07190175,0.010238736,-0.043964118,-0.033599023,-0.00402135,0.0038988274,0.016056456,-0.0007636558,0.010597469,-0.020006776,-0.05108883,-0.04688882,-0.005781806,-0.036668215,0.0058539803,0.06090771,-0.004370022,0.009627224,0.018393708,0.01585804,0.06065073,0.00825173,0.032630295,0.122046396,0.051299803,0.044192806,-0.036480207,-0.025160559,-0.05625479,-0.062238935,0.0041322056,0.007973491,0.03969969,0.016104758,0.021570666,0.09093604,0.0021899408,-0.09349826,-0.12378699,0.08842545,-0.005943899,0.010054066,0.06001244,0.034996018,-0.073996164,0.0327917,0.007686249,0.007213773,0.044748183,-0.043742858,-0.018083872,-0.062531255,-0.055867527,0.066177025,0.018993778,0.023915738,0.024583919,0.009593291,-0.018698169,-0.038183365,0.015426232,-0.013225323,-0.0120410435,-0.085529946,0.051756877,0.025033297,-0.030622354,-0.0055615767,-0.013475205,-0.05828351,6.5074564e-05,0.040395323,-0.061498106,-0.05584435,0.022096764,-0.030190442,-0.013260512,0.058454953,-0.047667842,0.019638125,0.014941539,0.045361236,-0.033129293,-0.07220325,0.0128842415,-0.027207652,-0.0112443585,-0.054285906,0.009216979,-0.056586795,-0.0021084545,-0.031058012,-0.04782053,0.013611682,-0.0034319256,0.019953538,0.0075129094,0.05090901,-0.050685663,0.061487727,0.010592752,0.026362251,-0.037951525,0.06888824,0.013689635,-0.011981071,0.03117807,0.05916928,-0.0952285,0.045602895,0.029917605,-0.015441513,-0.053719636,0.0059429896,-0.092662156,-0.017975662,-0.052169565,-0.051688418,-0.0018260577,0.018989302,0.06551424,0.045294877,0.034180723,-0.01683523,-0.019679196,0.018781988,-0.023340518,0.009617222,0.009216141,0.04550049,0.037044454,-0.016994068,0.025596725,0.01140392,0.022512764,0.015612288,0.0012174523,0.03728318,0.02673935,0.079471156,-0.018452594,0.032845616,-0.028186668,0.003821023,-0.05869714,-0.0067389156,0.03686391,-0.05021752,-0.04881018,-0.027829586,-0.02463859,0.023743939,0.02934221,0.00510686,-0.027500426,0.011163855,-0.015067551,0.0064349915,0.04243969,0.01749984,-0.055109248,0.04971236,-0.0094144195,0.063949674,0.03490943,0.018876884,0.007025789,0.0011742421,-0.007370339,0.020411726,-0.084185325,-0.030437646,0.044802878,0.017474147,0.06941979,-0.021156233,0.013127679,0.034892257,-0.041627403,0.01737042,0.035636853,0.01942426,0.05408474,0.07760951,0.011986657,0.01186355,-0.024531713,0.10729543,0.022408094,0.012577155,-0.064071424,-0.02022253,-0.04323177,0.036461264,0.0035848722,-0.050906777,-0.03886434,0.02734954,-0.013789369,0.005299237,-0.03288726,0.011768451,-0.019209538,0.017287102,-0.10733888,-0.019953359,-0.07147284,-0.023649802,-0.045119993,0.04075649,0.012824567,-0.03143882,-0.06372225,-0.044548206,0.02392541,-0.029510096,0.0029346775,-0.025549676,-0.008104734,-0.010777285,-0.030882243,0.033924013,0.03522134,-0.022955207,0.0420414,0.0061694286,-0.037038207,-0.029184656,0.04104694,-0.040148493,0.027491055,0.015607798,0.015841782,0.021532126,-0.018218912,0.057000812,-0.0028712912,0.006973745,0.06499693,-0.03020251,0.014373789,0.002010386,0.04639894,-0.013549736,0.01959302,0.0072232066,-0.008294983,-0.033462472,0.015272075,-0.0338693,-0.018224385,0.036553226,0.012340264,-0.054177985,-0.06561087,-0.025412295,-0.024618132,-0.15805842,-0.014734034,0.011573505,-0.008013244,0.015145667,0.0064521665,0.0070923595,0.05293589,-0.030384278,-0.017285267,0.03717367,-0.018808171,0.040569026,-0.0058625075,0.026026515,-0.0336723,-0.041184522,-0.05253246,0.011312327,0.024836963,-0.08247078,-0.00968697,0.07571772,0.046449255,0.043014847,0.079316586,0.01606033,0.051928803,-0.010208317,-0.046532284,-0.042037454,0.043226365,-0.022965962,0.025702955,0.059344836,0.06976547,-0.018657617,-0.034096777,-0.050699383,-0.052336045,0.040660355,0.029226549,0.01229322,-0.051919412,-0.043467216,0.033137824,0.010871417,-0.0150041515,0.05335929,-0.019102104,0.053289875,0.047794595,-0.033569936,-0.035786428,-0.00838895,0.04864301,0.004297396,0.0069837677,-0.014459496,0.021506311,-0.010817634,0.018135468,0.02668526,-0.010394766,-0.0006688987,-0.07405167,0.027545702,0.020459455,-0.033365667,0.032754008,-0.06172335,-0.016493535,-0.025316892,0.027477369,-0.006646686,0.038429208,0.02177728,0.079019815,-0.021192307,0.052043024,0.0009157909,0.059626937,0.026233094,0.014402691,0.029156286,0.031503003,0.06280114,-0.10123614,-0.012734035,-0.005589696,0.006036829,0.0042237295,-0.0199098,0.039619304,-0.007520176,0.009858028,-0.011115406,0.025363889,-0.036680765,-0.027878916,0.0037942817,-0.026394548,0.018457092,0.040922493,-0.022092832,0.042339586,-0.027816083,0.016904728,0.025571773,-0.046136923,0.031119306,0.044634037,-0.011040212,0.007156173,0.031632345,0.055140022,-0.028119186,0.06302437,0.048593707,-0.010765452,0.031117847,0.008184384,0.00980706,0.033426896,-0.015558213,0.017560525,0.008739281,-0.0014179591,-0.027958632,0.013477573,0.06508318,-0.03122348,-0.054854117,-0.013103,0.04558085,0.01838648,0.019253338,0.014020614,-0.07325501,-0.012269682,0.014512331,0.026410362,-0.005411334,0.0106605375,-0.04503936,-0.081881925,0.00346406,-0.020375442,0.00036717686,-0.042404972,-0.012672069,0.019213403,-0.047077116,0.03812476,0.049782794,-0.0029435488,0.0122127915,-0.00064287044,-0.00089134206,0.00776205,0.021495476,0.047081646,-0.05798347,0.012323397,-0.040964395,-0.0027484188,-0.008033483,0.012482328,0.023922132,0.030590372,-0.01770363,0.006000384,-0.0042696237,0.012177336,-0.010457961,0.061241075,0.027595686,-0.03723951,0.034583967,0.03314792,0.05482237,0.036825154,-0.016595615,0.023681758,0.06724016,0.034894984,-0.010204347,-0.022278657,-0.04467118,0.03548107,-0.01890019,-0.043303132,0.058697864,0.0032633164,0.024479972,-0.008546545,0.0052794972,0.025634483,-0.007560334,-0.004214219,-0.009296552,0.008351245,0.02411339,0.04690577,0.06245719,-0.02089685,-0.0137157,0.033136833,0.024589062,0.0012601346,0.028763907,-0.010785323,0.006417358,-0.0018086565,-0.08624713,-0.019543517,0.014489205,-0.0032171397,-0.026578551,0.030770821,0.036805324,-0.025943652,0.011978793,-0.00865801,-0.037175037,0.009736331,-0.0048049274,-0.026420273,0.018975426,-0.02452922,-0.035391357,0.09916011,-0.044453055,0.03968464,-0.04685791,0.0066414257,-0.050026402,0.030427855,-0.0009778766,0.022647811,0.008233794,-0.037633535,-0.05479765,0.00072620995,-0.0006669944,-0.010735776,-0.0071918373,0.016709315,0.05568212,-0.008665148,0.0064591994,0.065217495,0.024585927,0.033685382,0.008012775,0.016370812,-0.005968606,0.016372994,0.027967343,-0.048902623,-0.025086638,0.028208686,0.043910887,-0.025923092,-0.0434906,0.02702541,0.0072052605,-0.010486706,0.020247849,-0.0020191777,0.012713723,-0.04091824,0.01234795,0.019991666,0.06388615,-0.010926999,-0.024266168,-0.07774229,-0.031122366,-0.006625786,0.010190016,0.048806235,-0.01193681,0.0065618665,-0.015762558,0.043393932,0.0101450905,0.03457351,0.042142846,-0.07986183,0.012077197,-0.06596672,0.003244259,-0.05202842,-0.02360633,0.01473295,-0.011185785,-0.030787129,-0.01744563,-0.010256096,-0.0030231974,-0.012126061,0.05174392,0.01638604,-0.03690348,-0.039751217,-0.012836204,-0.026417948,-0.03391143,0.03180563,0.0131950285,0.013213273,-0.0141657535,0.03244284,0.061460108,0.015016885,-0.051533815,-0.044986397,-0.017022245,0.059943046,-0.00332674,-0.0032661024,-0.034581907,-0.030138182,0.015099555,0.056147013,0.06003182,-0.039883513,-0.020005068,0.05172578,0.03202503,-0.008811677,0.015666319,0.039551266,-0.026271751,0.033440355,-0.04125303,0.028838566,0.012251733,0.014013815,-0.028266355,-0.016434839,-0.019719891,0.028687105,-0.022188853,-0.023442786,-0.018653655,0.0051125074,-0.029702915,-0.019713352,-0.0189732,0.039832767,0.0074118073,-0.018164568,-0.0064072725,0.01350771,0.00075922604,0.009040391,-0.005582963,0.03535841,-0.047124013,0.0140203,0.016296035,0.0032086712,-0.033774592,-0.010047963,0.0116983745,-0.018792558,-0.01078491,0.030901598,-0.018293371,0.004050047,-0.025228757,0.017396,0.013814293,0.00049356674,-0.023968522,0.063263215,-0.012581566,0.028709732,0.012050948,-0.025966302,-0.017655537,-0.0040112487,0.0067439466,-0.024054134,-0.02378971,-0.071657285,0.003933579,-0.021220606,0.065575846,-0.014905986,-0.062469423,0.048983496,-0.055341538,-0.023214273,0.04840591,-0.002835127,0.017540095,0.01177314,-0.012526336,0.011001785,-0.010550497,0.03827606,0.023188613,0.00979223,0.0033692739,0.04145971,0.060968444,0.0271426,-0.031272,0.0057360325,-0.04087837,0.006394537,0.056363635,-0.017374238,-0.052708834,0.0021975238,-0.018545741,0.018418318,0.01559795,-0.007876323,0.0032684898,-0.05937508,0.005132744,-0.018051397,-0.052971084,-0.046161495,-0.030751223,-0.024977554,-0.00082437607,-0.004001831,-0.03878718,-0.035541058,-0.050770875,0.052259207,0.0023004776,-0.046689175,0.06478745,0.031489197,-0.019499682,-0.0039456384,0.011218219,0.04683389,-0.035846293,-0.014763662,0.030502135,0.027750816,-0.05967452,-0.025951413,0.026372768,-0.062176127]
20	0	2026-03-23 08:15:06.44349	f	<p>≡ƒîƒ T├¬n sß║ún phß║⌐m: ├üo S╞í Mi D├ái Tay Nam GIOVANNI D├íng Regular GLS0381-1</p><p>≡ƒîƒ M├┤ tß║ú sß║ún phß║⌐m:</p><p>├üo S╞í Mi Nam D├ái Tay GIOVANNI. Vß╗¢i n├⌐t hiß╗çn ─æß║íi, thanh lß╗ïch, GIOVANNI mang tß╗¢i chiß║┐c ├ío s╞í mi d├ái tay tr╞ín basic cho nam giß╗¢i. ─É╞░ß╗úc ho├án thiß╗çn ho├án to├án tß╗½ sß╗úi Cotton tß╗▒ nhi├¬n tß║ío cß║úm gi├íc nhß║╣, mß╗üm mß║íi, tho├íng m├ít khi mß║╖c. Kß║┐t hß╗úp c├╣ng vß╗¢i c├┤ng nghß╗ç Garment Dipping mang lß║íi lß╗¢p ho├án thiß╗çn kh├┤ng cß║ºn l├á ß╗ºi gi├║p bß║ín lu├┤n c├│ ─æ╞░ß╗úc vß║╗ ngo├ái lß╗ïch l├úm trong suß╗æt ng├áy d├ái nhiß╗üu hoß║ít ─æß╗Öng.</p><p>≡ƒîƒ Chi tiß║┐t sß║ún phß║⌐m:</p><p>M├áu sß║»c: Xanh n╞░ß╗¢c biß╗ân, Xanh navy ─æß║¡m</p><p>Kiß╗âu d├íng: Regular</p><p>Chß║Ñt liß╗çu: 100% Cotton</p><p>Chß║Ñt liß╗çu Cotton l├á sß╗úi b├┤ng cao cß║Ñp nhß║Ñt vß╗¢i rß║Ñt nhiß╗üu ╞░u ─æiß╗âm nh╞░: thß║Ñm h├║t mß╗ô h├┤i tß╗æt, th├┤ng tho├íng, chß╗æng m├ái m├▓n hiß╗çu quß║ú, dß╗à nhuß╗Öm m├áu c├╣ng khß║ú n─âng chß╗æng lß║íi sß╗▒ x├óm nhß║¡p cß╗ºa c├íc vß║┐t bß║⌐n v├á nß║Ñm mß╗æc.</p><p><br></p><p>Bß║úng size theo c├ón nß║╖ng tham khß║úo (Form Regular)</p><p>S (46): 58-64kg</p><p>M (48):  65-74kg</p><p>L (50): 75-81kg</p><p>XL (52): 82-88kg</p><p><br></p>	400000.00	{}	120000.00	├üo S╞í Mi D├ái Tay Nam GIOVANNI Chß║Ñt liß╗çu 100% Cotton Chß╗æng nh─ân D├íng Regular GLS0381-1	ao-so-mi-dai-tay-nam-giovanni-chat-lieu-100-cotton-chong-nhan-dang-regular-gls03811	{"Mß║½u": " Sß╗ìc caro", "Phong c├ích": " C╞í bß║ún, C├┤ng sß╗ƒ", "Chß║Ñt liß╗çu": "Cotton"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	105	5	[-0.022137275,0.0060180807,0.01139705,-0.005833869,0.025042212,-0.009297578,-0.020423867,0.007863392,0.0061311605,0.011416193,-0.0057428814,0.011950684,0.031181434,-0.025344525,0.027735503,-0.01687057,0.017047273,0.04886117,-0.06544213,-0.009981252,0.043070957,-0.038838252,0.04197216,0.026118595,-0.059820324,-0.028362986,-0.00613736,0.025366187,0.027145708,-0.10157031,0.013427229,0.037898257,0.0034518074,0.017834196,0.01456956,0.035074297,0.02097384,0.023053559,-0.01928188,-0.044807654,-0.007853538,0.004327459,-0.0023297921,0.04978687,-0.0012726703,-0.038748257,0.0222169,0.053993497,0.0008651454,0.06277793,0.055144656,0.031041961,-0.015617523,0.050591137,0.026271457,-0.016164748,-0.020429421,-0.031746987,0.07702258,-0.033904277,0.000258466,-0.03805586,-0.026004935,0.0045417473,0.008099703,0.009644512,-0.010505813,0.04423491,-0.05371476,0.0014084475,-0.027035363,-0.026160762,-0.013958284,0.041741654,0.005482875,0.011625292,-0.035336085,0.01287616,-0.020394156,0.014563105,-0.01756968,0.029759167,0.11482409,0.08035498,0.015300491,-0.03537802,-0.009665027,-0.06276064,-0.08451343,0.017299272,0.017507352,0.053316917,0.016341738,-0.027465664,0.061465055,-0.0042898324,-0.102438964,-0.14339575,0.0017650609,0.012349641,0.043618903,0.017295009,0.027859893,-0.08640793,0.04008038,0.015351004,-0.028439188,0.00060008006,-0.05360451,0.0007861022,-0.067949116,-0.08819149,0.031024875,-0.032165088,0.019005861,0.034404635,-0.017057372,-0.00846862,-0.026167898,0.0054808813,-0.026047204,-0.023211967,-0.047788013,0.032265812,0.03154435,-0.040119253,0.03181275,0.0012733474,-0.021199657,-0.0062128226,0.052937444,-0.052175857,-0.043950696,0.055079438,-0.017619567,-0.0062887263,0.022000425,-0.014343835,-0.0073554716,0.009094352,0.0018363144,-0.06431941,-0.0074378992,0.017250383,-0.021389425,-0.017470531,-0.025762489,0.041417833,-0.030863304,0.014011074,-0.0025395881,-0.06382544,0.042150714,0.0026186497,0.030721862,0.028130451,0.006127892,-0.050828885,0.092349514,0.00397455,0.010332507,-0.044548277,0.059499685,0.0145565625,-0.025147272,0.027859962,0.02612726,-0.05567385,0.06279582,0.011770218,0.005486593,-0.060036756,-0.0012147819,-0.15655458,0.03790433,-0.024188558,0.0004002847,-0.027860899,-0.0036306132,0.021307992,0.05943713,0.06113586,-0.061865997,-0.02265089,0.035469335,0.006017924,-0.0024088502,0.0016593481,0.05077793,0.032794744,-0.014683097,0.036475997,0.0024154077,0.039202172,-0.0045557255,-0.0410084,0.035571605,-0.04104194,0.034872454,-0.041007128,0.014418481,0.003946466,0.016776683,-0.06637492,-0.012975759,0.03964511,-0.022189384,-0.07316582,-0.00564278,-0.05014707,-0.0036056896,-0.01700564,-0.02088936,-0.06510212,0.027875884,-0.04883742,0.068030335,0.033217154,0.00016217635,-0.0050683157,0.019584313,0.012201121,0.09046727,0.043795116,0.019865032,0.019445429,-0.025998792,-0.040648833,-0.0017331102,-0.10388654,0.0049995463,-0.0009963016,0.007941791,0.07422904,0.028656729,0.0971659,0.03092138,-0.06708145,0.010043383,0.0365745,0.031651817,0.055055447,0.058756996,0.016018799,-0.013847414,-0.048330765,0.095954314,-0.0037216893,-0.009323963,-0.083308436,-0.0095072575,-0.0476127,0.03872869,-0.013358102,-0.030526547,0.013017395,0.021557678,0.01382906,-0.05825956,0.021579493,0.029406408,-0.013833641,-0.023611287,-0.07084565,-0.0017537787,-0.06310066,-0.015671887,-0.01949811,0.006159211,-0.027459646,-0.01839452,-0.06678751,-0.055866584,0.0049577714,-0.015311839,0.0010814335,-0.05655748,0.0027698153,-0.018046608,-0.05007652,0.037417747,0.010170519,-0.031785287,0.023152422,0.041039784,-0.027987637,0.005927889,0.011332312,-0.062229555,0.02813003,-0.0018570508,-0.017282523,0.009375611,-0.028041473,0.03253074,0.024327252,0.011419501,-0.008023132,0.0003876483,0.01402869,0.003864935,0.07900293,0.0027964741,0.074481696,-0.007244019,-0.00096369704,0.038413886,0.02742387,-0.010393144,-0.016544871,0.02996504,0.019489143,-0.08793407,-0.071573794,-0.046331923,-0.01771067,-0.13358703,-0.019824348,0.010673644,-0.025417572,0.016346958,0.019990778,0.0075084358,0.030494506,-0.031150797,-0.018308822,0.053884223,-0.011296989,0.041244455,-0.042510927,0.035144508,-0.029500235,-0.05622123,-0.056624044,0.017607322,0.034920305,-0.079102226,-0.012482114,0.04727178,0.049255297,-0.014405827,0.055818483,0.036589168,0.021324847,-0.030405186,-0.08510533,0.0110239815,0.0069133565,-0.013800747,0.006959583,0.050872095,0.082312934,-0.003707942,-0.008629589,-0.019382847,-0.039140258,0.03262794,0.047168322,-0.009323206,-0.07204988,0.021041276,-0.020104375,-0.023850579,0.020395488,0.06902079,-0.027386712,0.05783198,0.07665013,0.020347117,-0.045327853,0.04391033,0.042194437,-0.0038187336,0.030315477,0.014563895,-0.004585335,0.006116481,0.05987277,0.042065933,0.010573792,0.015224727,-0.0136681665,-0.022422882,0.012788601,-0.026766336,0.06807579,-0.035894405,-0.0120946,-0.00729382,0.011913142,0.012699168,0.008396848,0.005281669,-0.00026489206,-0.0124577135,0.051686015,-0.018617854,0.02662409,-0.003392908,0.0011613957,-0.009591733,-0.0024997503,0.06889857,-0.06504413,-0.0022764811,-0.004564394,0.056419365,0.024840288,-0.002098285,0.029228842,0.024555452,-0.0040599597,0.009301944,0.013541946,-0.0075567137,-0.023711223,0.0026149293,-0.040925168,0.0019267814,0.020773463,-0.03360371,0.030240314,0.016611502,-0.0010118334,0.022576604,-0.035620995,0.012433448,-0.003909844,0.006222012,-0.0022183084,0.030349465,0.03447718,-0.019404663,0.030435301,-0.0041365945,-0.034057043,0.019918105,0.0244825,0.015755257,-0.014286872,-0.011824934,0.0072266385,0.011894536,-0.013537331,-0.05576591,0.028886193,0.041754257,0.018638376,-0.05775998,0.0037798476,0.015456432,-0.009419159,0.004573058,-0.005944582,-0.06793686,-0.0014028061,0.010247062,0.076304235,-0.0018134249,0.006526101,-0.009330294,-0.014166089,0.041520767,0.005434589,-0.005522849,-0.019603087,-0.029949795,-0.00074708334,-0.03458984,-0.021513378,0.08763817,0.016082166,0.016836409,0.043928962,-0.002377392,0.022839459,0.02086108,0.039781574,-0.056948453,0.013587061,-0.06944451,-0.022219446,-0.0012371507,0.001838435,0.03051731,0.035425656,0.0016914071,0.005168492,0.018780211,0.022798453,0.029569577,0.07609965,0.056091476,-0.011482519,-0.007729393,-0.004661283,0.061982926,-0.0055917897,-0.02305215,0.03937049,0.085667685,-0.03755475,-0.012034966,-0.05935203,-0.032778338,0.03481276,-0.01957752,-0.031558488,0.033982635,0.012196508,0.011406934,0.0047138315,-0.023505056,0.024374085,-0.05486521,-0.017176958,-0.018672876,0.02557039,0.014262878,0.03454614,0.059059624,-0.011752688,0.0039622434,-0.029650325,0.034303397,0.0024476256,-0.0019771094,0.03602553,0.044737518,-0.017859548,-0.04330358,-0.00973528,-0.013376008,-0.022930019,-0.043983966,0.0055156844,-0.0030099037,-0.011728669,0.0030817983,0.0018994675,-0.007724348,0.023854706,0.02192335,0.007689717,0.0239403,0.020039434,-0.050344598,0.05741305,-0.043511245,0.046058487,-0.0048890915,-0.023387382,-0.061666865,-0.0052791056,-0.023732265,0.022595068,0.010549498,-0.027039928,-0.07725912,0.031026876,0.0152391065,-0.007978845,-0.021905676,-0.013063306,0.024459777,0.020150425,0.016285209,0.07636735,0.020085549,-0.018638818,0.010779947,0.017001731,0.011922509,0.039011136,0.058827218,-0.049904395,-0.020120375,0.0153240105,0.05628476,-0.02861774,-0.02444839,0.0046920795,0.032974843,0.030127754,0.03682447,0.044117562,0.0023488493,-0.037733737,0.038788658,0.0011668369,-0.004751941,-0.017620211,-0.017329287,-0.055897143,-0.039318834,0.02058571,-0.018701188,0.019106258,0.0078116716,0.008455545,-0.030144071,0.00029057846,-0.016933259,-0.018947192,0.004012778,-0.050508674,-0.009506906,-0.05866152,0.016546132,0.010159555,0.0071794474,0.019983143,0.00915381,-0.018677229,-0.021288505,-0.02682084,-0.026367199,0.00071569416,0.02655174,0.030845648,-0.03053825,-0.04051867,0.02714529,-0.03613198,-0.091754936,0.048000887,0.038048048,0.023801206,0.038768742,0.048387162,0.02607474,0.051688742,-0.023464108,0.009515888,-0.0400678,0.030973777,0.0135282995,0.017872782,-0.043131124,-0.056338783,0.020415295,0.07473051,0.07320255,-0.024307696,-0.025398044,0.0041230074,-0.051150963,0.03620104,0.034657914,0.04516647,0.02426907,-0.013580182,-0.058038827,0.019661382,-0.02717873,0.008743558,-0.046229612,0.022049008,-0.007721789,0.005650981,-0.015001214,-0.013115018,-0.0118982615,0.010801332,-0.045489296,0.026896857,-0.06068577,0.059492107,-0.0041855103,-0.021197675,-0.00016985378,-0.023373745,-0.005944463,0.04440354,-0.051943455,0.021992724,-0.025978975,0.009747454,0.0393706,0.006964424,-0.033875693,0.013017259,0.018982487,-0.058686703,0.009091453,0.038881723,0.033485506,-9.652544e-05,-0.036891036,0.042236242,0.0038600822,0.021329207,0.002186836,0.023877842,0.029361386,0.023852576,0.04003106,-0.045444433,0.019831035,-0.0016044884,-0.024603099,-0.025801716,-0.027395533,-0.050504666,0.012896879,0.0051920046,0.056409374,-0.03108477,-0.033735063,0.043067604,-0.06413342,0.023989601,0.01697787,-0.0019505095,0.02005024,0.01136335,0.024905808,-0.0008671408,-0.018226644,0.03775799,-0.0018091776,-0.022462359,-0.006032667,0.057891753,0.07048394,0.011986233,-0.05318666,0.00077148,-0.07603475,0.0016561684,0.059735242,-0.03895774,-0.035316683,0.04680582,-0.027174957,0.02784044,0.035123244,-0.002360024,-0.018797517,-0.04118521,0.039337095,-0.046963874,-0.007953956,-0.035958514,-0.015988838,0.015318001,0.017657353,0.024526108,-0.028070118,-0.05447796,-0.05368728,0.044194993,-0.000997123,-0.006205399,0.008610847,0.0024701583,-0.055915866,-0.02378952,0.014345687,0.07101511,-0.01560747,0.010910453,0.0047551654,-0.00018685614,-0.022271086,-0.004407998,0.039045658,-0.026851837]
17	0	2026-03-23 07:55:32.882894	f	<p>ΓÇ£Giß║úi PH├ôNG NHIß╗åT NHANH CH├ôNG ΓÇ¥: Gi├í ─æß╗í laptop c├│ thß╗â n├óng cao chiß╗üu cao cß╗ºa laptop m├á kh├┤ng cß║ún cß╗¡a tho├ít kh├¡, t─âng l╞░u th├┤ng kh├┤ng kh├¡ gi├║p laptop kh├┤ng bß╗ï qu├í n├│ng.</p><p><br></p><p>ΓÇ£C├│ THß╗é ─ÉIß╗ÇU CHß╗êNH HAI angle ΓÇ¥: B├án ph├¡m riser c├│ thß╗â ─æiß╗üu chß╗ënh theo c├íc g├│c ─æß╗Ö kh├íc nhau, ph├╣ hß╗úp vß╗¢i c├íc ─æß╗Ö cao y├¬u cß║ºu kh├íc nhau, bß║úo vß╗ç cß╗ò v├á vai cß╗ºa bß║ín kh├┤ng bß╗ï ─æau.</p><p><br></p><p>ΓÇ£Thiß║┐t Kß║╛ Gß║ñP V├Ç KH├öNG THß╗é THIß║╛U ΓÇ¥: Gi├í ─æß╗í m├íy t├¡nh x├ích tay c├│ thß╗â gß║¡p lß║íi chß╗ë c├│ 7mm (0,28 inch) khi gß║Ñp lß║íi, dß╗à d├áng bß╗Å v├áo t├║i ─æß╗▒ng m├íy t├¡nh x├ích tay cß╗ºa bß║ín, c├│ thß╗â x├ích tay khi ─æi v─ân ph├▓ng hoß║╖c c├┤ng t├íc.</p><p><br></p><p>ΓÇ£T╞░╞íng TH├ìCH Rß╗ÿNG R├âI ΓÇ¥: Gi├í ─æß╗í m├íy t├¡nh x├ích tay cß╗ºa ch├║ng t├┤i t╞░╞íng th├¡ch vß╗¢i hß║ºu hß║┐t c├íc k├¡ch th╞░ß╗¢c cß╗ºa m├íy t├¡nh x├ích tay, c├│ thß╗â ─æiß╗üu chß╗ënh ─æß╗Ö rß╗Öng t├╣y ├╜. n├│ c┼⌐ng c├│ thß╗â ─æ╞░ß╗úc sß╗¡ dß╗Ñng rß╗Öng r├úi cho m├íy t├¡nh x├ích tay, b├án ph├¡m, m├íy t├¡nh bß║úng v├á ─æiß╗çn thoß║íi di ─æß╗Öng</p>	50000.00	{}	18000.00	2 Ch├ón ─Éß║┐ Laptop Mini C├│ Thß╗â Gß║¡p Lß║íi, B├án Ph├¡m M├íy T├¡nh Di ─Éß╗Öng N├óng Vß╗¢i 2 G├│c C├│ Thß╗â ─Éiß╗üu Chß╗ënh, Ch├ón ─Éß║┐ Notebook V├┤ H├¼	2-chan-de-laptop-mini-co-the-gap-lai-ban-phim-may-tinh-di-dong-nang-voi-2-goc-co-the-dieu-chinh-chan-de-notebook-vo-hi	{"Gß╗¡i tß╗½": "Bß║»c Ninh"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	102	3	[-0.017450225,0.0085879415,-0.052090324,0.0017967682,0.033324417,-0.0015324791,0.06764421,0.032093946,0.019692564,0.017630909,-0.009034634,0.037951488,0.064291894,-0.007894273,0.008635769,-0.012590683,0.011616972,0.02838981,-0.091163136,-0.004729716,0.027793398,0.022604845,0.029499771,0.03589088,-0.091567285,-0.03493444,0.012361486,0.012496833,-0.0049966155,-0.096462004,0.014027927,0.058082603,-0.0048857667,0.0023081189,-0.0006010615,0.05916585,-0.047704622,0.038582176,0.009200378,-0.01932771,-0.057187293,0.010943781,0.0291382,0.025831923,0.032789927,0.04894432,0.012912571,0.0746219,-0.011638456,0.021530436,0.077503406,0.013735869,-0.018976588,0.067858994,-0.030648284,-0.008368686,-0.053577524,-0.023713566,-0.03111582,0.013505926,0.011229185,-0.004187814,0.0018152992,-0.017025035,-0.022720357,-0.029760735,-0.00037338768,-0.01986392,-0.013743699,0.0058407155,-0.055251725,-0.02036709,-0.06507165,0.02919078,-0.013657683,-0.00510108,0.014847312,-0.019593354,-0.008651635,0.053579748,-0.0029238432,0.024155675,0.06003638,0.07438026,0.045356546,-0.020553472,0.017618714,-0.06418176,-0.051039703,-0.012983185,0.021031728,-0.008106646,0.0058792797,-0.022956815,0.09647701,0.031524014,-0.0882247,-0.07190165,0.12289208,0.057025023,0.019155767,-0.008600766,0.049542494,-0.14394686,0.07568664,-0.028070252,-0.0054592867,0.027130354,-0.058915656,0.048333608,-0.039117433,-0.05585169,0.011572997,0.044974178,-0.02926885,0.0030140176,-0.014793991,0.008546545,-0.04670877,-0.022984788,0.013846168,-0.0017630548,-0.039522715,-0.0030788865,0.012105826,-0.029054819,-0.010346801,-0.012384585,0.0036495186,-0.04170139,0.028092302,-0.0770036,-0.052433267,0.015929101,-0.068355605,-0.017780503,0.029924812,-0.05286113,0.039525524,0.031154398,0.038357172,-0.087229274,0.00553959,-0.012280776,0.035385232,0.009051563,-0.0072388495,0.016465172,-0.09353365,0.003710039,-0.046809237,-0.02163912,-0.03224034,0.0026550628,0.002419568,0.0025315112,0.006016466,-0.040868085,0.096214525,0.030339295,0.06552743,-0.040259186,0.031330444,0.0284091,1.1536041e-06,0.008623731,0.004994306,-0.05095969,0.024968587,0.03302335,-0.0115341,-0.048295714,0.0039858753,-0.092513986,-0.018201666,-0.0034087684,0.0027081491,-0.05708207,-0.026421783,0.04121847,0.025143377,0.03582498,0.017540969,-0.03585103,0.004319124,0.008131586,-0.005333687,0.024650969,0.07176303,0.051974412,-0.0004087686,0.019271303,-0.0013424021,0.05262481,-0.015930926,-0.017561931,0.013028013,-0.0108923875,0.06424878,-0.02068924,0.0064810137,-0.007306942,-0.012354753,-0.105491936,0.015655307,0.041364584,-0.0053911884,-0.010992547,0.018528624,-0.022644078,0.029866118,0.018885024,-0.038132794,0.008769473,0.020413997,-0.027016519,0.040377475,0.017014591,0.0384802,-0.028821634,0.0066514458,0.007133696,0.067124054,0.016196547,0.03802224,0.002539031,0.018608984,0.009698189,-0.001254253,-0.086146325,-0.018834587,0.018728452,-0.04333601,0.049730055,0.008640546,0.04817947,0.026489876,-0.009435092,0.018785093,0.04096396,0.022225888,0.09107595,0.100390434,0.050631106,0.00959256,-0.06188555,0.080268085,0.041248105,-0.012209189,-0.034669843,-0.020006336,-0.07225899,0.014124331,-0.0109244445,-0.06542305,0.010701813,0.026561558,0.034736555,-0.022307113,-0.05332509,0.0513927,0.0023458244,0.01701294,-0.06732669,0.013058059,-0.07687696,-0.016880851,-0.023574358,0.01888941,-0.020310743,-0.032237817,-0.031045744,-0.005663545,0.014234555,-0.0017657196,0.019771261,-0.029213956,0.041847453,-0.042944964,-0.07231171,0.007247798,0.049224883,-0.047825024,0.045818135,-0.00013988034,-0.07740154,0.016512841,0.029001376,-0.04097058,0.020155348,-0.0058453176,0.040470045,-0.025139902,-0.01745489,0.05767458,0.029810596,-0.0012549466,0.024021175,-0.027471721,-0.0025319005,0.0041181454,0.052750457,0.022068389,-0.0018474525,0.00418723,-0.026929738,-0.0016382716,0.01076521,-0.02691214,-0.016077867,0.019234426,0.039154023,-0.081996776,-0.03775838,-0.0028608674,-0.012252746,-0.20509245,-0.0016611298,-0.0106465705,0.018628346,0.039333228,-0.023517821,-0.052992724,0.03558798,0.0016848231,-0.022949457,-0.035840217,-0.047380533,-0.035805617,-0.016943833,0.020024454,0.016565926,-0.016368285,0.018951459,-0.0093012955,-0.0034186025,-0.075861126,0.022677328,0.054224387,0.05555525,0.00068263,0.041011356,0.0003491677,0.037044782,-0.03770375,-0.0792405,0.03231544,0.006837418,-0.013409465,0.028861513,0.031771954,0.030534191,0.012942223,-0.0012242603,0.010724408,0.02972591,0.031257693,0.05776318,-0.018889064,-0.018776193,-0.029443694,-0.0039294017,-0.037124272,0.008801095,0.00056540425,-0.045422826,0.024273742,0.01405876,-0.015379679,-0.049208384,-0.042389654,0.04874044,-0.003931048,0.011585271,0.03158782,-0.0073048794,-0.019658374,0.023456123,0.02589637,-0.0049735997,-0.0105228415,-0.025180612,0.021420768,-0.0062771677,0.0037269318,0.07208713,-0.054508295,-0.034447484,-0.0436536,0.08051709,-0.0052653058,-0.0041366597,0.01968595,-0.018546872,-0.065829344,0.053960573,0.002460133,0.023771096,-0.016787775,0.020880317,0.021310885,0.00052484043,0.07065021,-0.05110455,-0.01529371,-0.0096524125,-0.015058762,0.0028155332,0.010236972,0.018314611,0.030620717,-0.029180128,0.011827127,-0.016469782,-0.057451356,-0.014681554,-0.004854769,-0.046142783,-0.0245928,0.0043224953,-0.014743532,0.032259613,0.002490125,0.018206451,-0.011036209,-0.030536281,-0.02436896,-0.005552138,-0.05101715,0.06443664,0.014958681,0.08351678,-0.016405057,-0.019838313,-0.019391412,0.011978892,0.027020885,0.0019525167,0.0072940416,0.039667577,-0.04572088,-0.02848628,0.030248296,0.0033006147,-0.04662363,0.052685905,0.0572349,0.022669673,-0.041249197,-0.06608121,0.015326895,-0.06261545,-0.008948989,-0.018277915,-0.03929255,-0.029239412,0.01453015,0.100952595,0.013522801,0.03935958,-0.047143802,-0.025775226,0.0033780052,0.009717814,-0.022965154,-0.015468207,0.021823889,-0.03576607,-0.04041765,0.021785136,0.048915375,-0.024602475,-0.044434585,0.029025344,0.010423578,-0.016340569,0.013052195,0.025661549,-0.022316683,0.009914038,0.008840065,-0.023720328,-0.030909048,0.01988937,0.021552496,-0.0098832445,-0.011079756,0.027173284,0.0065045143,0.06576779,0.043185182,0.048622087,0.0043467623,-0.03311514,-0.06605619,-0.00737721,0.0549777,0.020912115,-0.06559487,-0.028964957,0.059818547,0.021974009,-0.0083008725,-0.00016596042,-0.009308839,0.055293348,-0.045740712,-0.029449387,0.055633496,-0.030751398,0.0025100622,-0.0004771741,-0.009714088,-0.0066575417,-0.03346618,0.02906673,0.0038195425,0.005803408,0.029119994,0.0142316725,0.011629867,-0.024089718,0.030326743,0.015254491,-0.03355278,-0.008076418,-0.014645338,0.02118134,-4.0033545e-05,-0.03701756,-0.05570804,0.037340272,0.027472379,0.019202288,-0.020627545,0.051682476,0.006070429,-0.017239911,0.023170643,0.009889808,-0.051635742,-0.028078632,-0.0014172267,0.04522486,0.01792561,-0.036070004,-0.006470851,0.054459956,-0.04930326,0.10207285,-0.023200346,-0.03957582,-0.014679826,-0.0004477689,0.013726048,0.00761489,0.0055065244,0.010073473,-0.06730523,-0.01141978,0.0066656666,0.01674983,-0.017878272,-0.046907637,0.05765406,-0.020113878,0.007022618,0.03790077,0.0005389707,-0.014845473,0.029090704,0.039895806,0.0040430664,-0.0040113516,-0.006547041,-0.04104122,-0.014258458,-0.012418904,0.044144243,0.011681339,0.0148307,-0.0022975898,0.03756668,0.012040034,0.005821087,-0.011451819,-0.020258406,-0.047775235,0.025492918,-0.0142314555,0.048667707,0.038755007,-0.03237022,-0.048096906,0.020137426,-0.04657778,0.0060723005,0.01340643,0.06538636,-0.015334557,-0.054257326,-0.00091226737,0.053741846,-0.002074728,-0.016834732,-0.050487544,-0.029956942,-0.03240854,0.03988243,-0.019987836,-0.017415192,0.020580571,-0.012280636,-0.0029621907,-0.034413945,-0.0021994638,0.029558767,0.009704547,0.026955364,0.011153963,-0.024869308,0.02184388,0.029874552,-0.023039153,-0.04424008,0.025841124,0.022322487,0.010939833,0.0115771275,0.03056147,0.027329588,-0.0019562442,0.0008764677,-0.029051503,-0.036412757,0.066711605,0.030258909,0.009486172,-0.021132933,-0.043071307,0.008418,0.04819236,0.051678568,-0.009014905,-0.05435938,0.024497077,0.03152932,0.032151535,0.0027875316,0.014855067,-0.040189207,0.07094055,-0.09431395,0.02738865,-0.015439354,0.016079705,-0.03473731,0.020960106,0.025959767,-0.009181114,-0.024516482,-0.013585059,0.002663372,0.020018697,-0.0050248746,-0.0070957565,-0.038421698,0.03296151,0.0063352566,-0.060211003,-0.024271091,-0.014638437,0.01668471,-0.0028053373,-0.03945437,0.067480125,-0.01875369,-0.002996324,-0.029649846,-0.015180641,0.016461315,-0.014612769,0.00923468,-0.021160789,0.028330494,0.06878501,-0.00027569215,0.0048252256,0.018202106,0.022387665,0.0039811693,-0.018851459,0.0087572355,0.028219257,-0.026514007,0.027112147,-0.005723365,0.013100207,-0.0116967615,-0.013271344,0.010965116,0.014043995,-0.033575684,-0.022361886,0.014061085,-0.03732966,0.03974612,0.031287313,0.0075903423,-0.012410834,-0.018440463,0.044317164,0.029880926,0.00017429481,0.013261826,-0.007720505,-0.0068803895,-0.013744543,-0.03936925,0.031188278,-0.010227189,-0.04412043,0.020837102,0.037580445,0.075750954,-0.021025078,-0.056733064,0.028810456,-0.039870627,0.054445315,0.09462187,-0.03414292,-0.031254925,0.015078997,-0.03541747,-0.0025104764,-0.014978516,-0.024756245,-0.02083012,-0.049030643,-0.0012195918,0.0033803463,-0.036376543,-0.009255845,0.01652314,0.0010873802,0.023084112,0.032125987,0.008487455,-0.0079946425,-0.027329093,0.03201662,0.030707948,-0.024850525,0.033167187,-0.013042738,-0.01861779,0.029872663,-0.01884686,0.030954495,-0.01511889,0.012790603,-0.010238223,0.017816452,-0.077669665,-0.027213259,0.07389077,-0.011328108]
22	0	2026-03-23 08:27:08.452175	f	<h1>Gi├áy Thß╗â Thao Nam Salomon X Ward Leather GTX Vintage Khaki / Black L47182100</h1><p>l├á mß║½u mß╗¢i vß╗¢i nhß╗»ng ─æ╞░ß╗¥ng n├⌐t cß╗ò ─æiß╗ân sß╗¡ dß╗Ñng bß╗Ö phß║¡n ─æ├íy v├á khung ─æ╞░ß╗úc thiß║┐t kß║┐ tß╗æt tß╗½ gi├áy chß║íy ─æß╗ïa h├¼nh b├ín chß║íy nhß║Ñt v├á bß╗ò sung th├¬m phß║ºn tr├¬n.</p><p><br></p><p>─Éß╗æi vß╗¢i ─æ├┤i gi├áy X WARD LEATHER GORE-TEX ho├án to├án mß╗¢i, ch├║ng t├┤i ─æ├ú lß║Ñy khung ─æß║┐ v├á chasis ─æ├ú ─æ╞░ß╗úc chß╗⌐ng minh tß╗½ mß╗Öt trong nhß╗»ng ─æ├┤i gi├áy chß║íy trail b├ín chß║íy nhß║Ñt v├á th├¬m v├áo phß║ºn tr├¬n mß╗¢i vß╗¢i c├íc ─æ╞░ß╗¥ng n├⌐t cß╗ò ─æiß╗ân, chß║Ñt liß╗çu cao cß║Ñp v├á khß║ú n─âng chß╗æng n╞░ß╗¢c GORE-TEX. Mang lß║íi sß╗▒ ß╗òn ─æß╗ïnh, thoß║úi m├íi v├á ─æß╗Ö bß╗ün tß╗æi ─æa khi bß║ín kh├ím ph├í thi├¬n nhi├¬n.</p><p><br></p><p>Tß╗æt nhß║Ñt cho: Tuyß║┐n ─æ╞░ß╗¥ng mß╗Öt ng├áy, Nhiß╗üu hoß║ít ─æß╗Öng, ─Éß╗ïa h├¼nh hß╗ùn hß╗úp</p><p>Chiß╗üu cao: Thß║Ñp</p><p>─Éß╗ïa h├¼nh ngo├ái trß╗¥i: ─Éß╗ïa h├¼nh hß╗ùn hß╗úp</p><p>Khß║ú n─âng chß╗æng n╞░ß╗¢c: GORE-TEX</p><p>Trß╗ìng l╞░ß╗úng: 345 g</p><p>M├ú SKU: L47182100</p><p></p>	1000000.00	{}	1000000.00	Gi├áy Thß╗â Thao Nam Salomon X Ward Leather GTX Vintage Khaki / Black L47182100	giay-the-thao-nam-salomon-x-ward-leather-gtx-vintage-khaki-black-l47182100	{"Loß║íi Kh├│a": " Kh├│a d├óy", "T├¬n tß╗ò chß╗⌐c chß╗ïu tr├ích nhiß╗çm sß║ún xuß║Ñt": "Salomon", "─Éß╗ïa chß╗ë tß╗ò chß╗⌐c chß╗ïu tr├ích nhiß╗çm sß║ún xuß║Ñt": "Salomon"}	ACTIVE	0	0	2026-06-07 13:55:44.32138	106	4	[-0.02526732,-0.032510843,-0.002250422,-0.039182834,0.051404465,0.017538492,0.0020410847,-0.008614731,-0.023783768,-0.042023186,-0.021731898,0.024035871,0.021348154,-0.062448394,-0.009048235,-0.027461616,-0.003995485,-0.022426669,-0.094558574,0.017905235,-0.012242076,-0.024269247,0.020895349,0.00213816,-0.034158625,-0.025728485,0.01933606,0.0504368,-0.023204101,-0.08163873,0.025456252,0.03257269,0.006111142,0.024704054,-0.027687151,-0.00028785688,0.014959814,0.016627694,-0.033556864,-0.043057136,-0.016898993,0.030454688,0.0068126447,0.040811077,0.008593194,-0.017105125,-0.017804602,0.040983588,-0.040869977,0.03497699,0.052080065,0.00663071,-0.0034410844,0.015859442,0.00220431,0.001209433,-0.011158023,-0.09087407,0.014065778,-0.040976953,-0.013442512,-0.01507343,0.011083145,0.010535016,0.0112615945,-0.041508276,-0.008765822,0.024817819,-0.04197228,-0.0030699954,-0.027647523,0.018266376,-0.052064057,0.008981136,0.03681953,-0.052014213,-0.036662124,0.017101197,0.062753804,0.048193216,-0.0098137995,0.020273294,0.11185949,0.057022456,0.024884975,0.006319472,0.02784159,-0.043035302,-0.014595458,-0.0061195353,0.0628349,0.0010132365,-0.020922186,0.010486464,0.062388103,-0.00019507698,-0.08589648,-0.09084552,0.09255446,0.047355756,0.038577028,0.022098998,0.06715001,-0.09329116,0.05002916,0.029644595,0.009505966,0.0068086497,-0.06961978,0.0154325925,-0.018604666,-0.044846866,-0.0035039512,-0.07849484,0.05179873,0.021830335,-0.0016670867,-0.013890658,-0.020732224,0.046261977,-0.0016690388,-0.018495606,-0.08001457,0.013956253,-0.0116456095,0.028651396,-0.00574084,-0.020636126,-0.06220033,-0.06946397,0.03503285,-0.06959761,-0.0052731913,0.00699728,-0.044621836,-0.0054931473,0.044150554,-0.03329354,0.020147776,-0.024165282,0.023027975,-0.022331538,-0.027716495,0.016745236,-0.0375463,0.007190047,-0.017560644,0.050074916,-0.03389645,0.013943396,-0.0061839647,-0.033132967,-0.022697289,-0.03531343,0.0026635784,-0.0071935575,0.054348182,-0.017126828,0.07290722,0.053867426,0.029147867,0.010636891,0.06909057,-0.005608548,-0.02226854,0.020946253,0.005929187,-0.03129913,-0.01647909,0.009926889,-0.023179654,-0.017957455,0.011663211,-0.085260406,0.018287795,-0.053014807,-0.013216655,0.0072441082,0.020003414,0.06488705,0.0644633,0.07992847,-0.037180368,-0.020087758,0.050011516,-0.00092380214,-0.02175564,-0.011884087,0.07822856,0.09690211,-0.02856632,0.036138278,0.060863923,0.016631966,-0.00010691198,-0.081019364,0.055995304,-0.019209562,0.04712132,-0.06101238,0.023848936,0.020466333,-0.039225996,-0.023250192,-0.030909745,0.051741373,-0.06059759,-0.06118626,0.016676256,-0.038645465,-0.023347594,-0.025763905,0.053959128,-0.05467645,0.030826874,-0.016546763,0.040613938,0.013667571,0.015349145,0.0029673486,0.03312012,0.0145802,0.061694745,0.03419105,0.05522387,0.006038827,-0.013739737,0.01518488,-0.043131385,-0.06619667,-0.031865835,0.010973506,-0.005894048,0.03191011,-0.0065218518,0.045581486,0.032087795,-0.03643477,0.0059545217,0.0050454517,0.08665109,0.04945626,0.08495977,-0.005093701,-0.041309144,-0.035156317,0.054398626,0.062093113,0.00021548463,-0.055403326,-0.013686152,-0.012046937,0.06946851,-0.015169094,-0.022832494,-0.03403843,0.032673974,-0.018570082,-0.062977105,0.013710638,0.02045855,0.0032602972,-0.01110543,-0.050448876,-0.039080314,-0.077455424,3.308255e-05,-0.028289042,0.066119626,0.023843158,-0.03487225,-0.0626123,-0.030480783,0.0032990149,-0.022294417,0.0068274797,-0.058637932,-0.002860756,0.01903033,-0.052347917,0.011019509,0.020934127,-0.03837072,-0.0012072987,0.03340432,-0.018551875,-0.03493329,0.05399601,-0.05478765,-0.0051001306,0.04605276,0.038290206,0.029898578,-0.017126841,0.04319189,0.020085309,-0.0138787,0.04017386,-0.012268648,0.023868399,-0.03008781,0.01539154,-0.009414637,0.024307141,0.025064658,-0.027289115,-0.022573376,-2.0908094e-05,-0.028081471,0.009053401,0.0040542907,0.015736964,-0.0595435,-0.006108005,-0.016193355,0.0038868259,-0.113436975,-0.034552168,0.014300987,0.037378985,0.040839054,0.002670483,-0.028991247,0.02916978,0.026968015,0.03254442,-0.023431694,0.020891726,0.0011297964,-0.08151892,-0.006652294,0.004093751,-0.06525766,-0.046641737,-0.015888054,-0.0032957988,-0.099436834,0.014658997,0.058678523,0.09683815,0.016214795,0.04722561,-0.00017280693,0.024868881,-0.021073699,-0.031602025,0.047594685,-0.0036951802,-0.006939792,0.018709961,0.021424279,0.08432401,0.019924888,0.013206764,0.016147986,-0.0044927243,0.03969296,0.037766185,0.013047801,-0.054721463,0.025570085,0.03387679,0.009971873,0.025188744,0.01762649,-0.025691492,0.02688669,0.04812719,-0.052588265,-0.04630276,-0.0122517655,0.05883537,0.0047286493,0.0127206445,-0.019112144,0.0052988227,-0.017792799,0.03717516,-0.00094289286,-0.040532697,-0.0068874136,0.005960815,-0.027593298,-0.022869471,0.004418682,0.05837143,-0.03464909,-0.03744678,-0.021233372,0.002598739,-0.04516447,0.03703006,0.00061544933,0.054405436,-0.045932364,0.009875837,-0.009295051,0.028729431,-0.007243197,0.02415029,0.024758436,-0.015518111,0.06595661,-0.055565346,0.0035363866,0.02489323,0.02311204,0.0010183185,-0.051194485,-0.0044129826,0.019009812,0.004541727,0.025927465,0.012464495,-0.05241685,0.00024480428,0.029674262,-0.015126895,0.024866797,0.06885949,-0.013605184,0.013105039,-0.020143673,0.057874262,0.009460923,-0.024982052,0.0046460507,0.009213671,-0.036161315,0.040625583,0.01969861,0.06422226,-0.015303,0.02938113,-0.006081993,-0.015994497,0.02714312,0.022460131,-0.008629195,-0.009833331,-0.049291663,-0.038165476,0.073499404,-0.007630159,-0.06837034,0.052509703,0.027862556,0.015650962,-0.04734116,-0.005512381,0.031656723,0.010217927,0.053082135,0.0028405034,-0.089667626,-0.02571791,0.010737803,0.016728774,-0.027272148,-0.013012731,-0.021753581,-0.06300981,0.0672317,0.0026113333,0.025704017,-0.019138215,-0.06702627,0.023038315,-0.043512154,0.06893341,0.030223334,-0.021290595,0.016882772,-0.022780774,-0.026260892,0.01636915,0.010102713,0.049262945,-0.05455845,0.018218767,-0.018948436,-0.00017192855,0.0024826103,-0.02776553,0.025632488,-0.035957064,0.016727826,0.037729423,0.003009511,0.021111414,0.06539385,0.054268584,-0.005226872,-0.038659163,-0.0072037266,-0.007810264,0.026924461,0.004307691,-0.00398238,0.02065485,0.06726352,0.030112924,-0.019507132,-0.011530697,-0.031104876,0.04033132,-0.01741258,0.02161668,0.0550214,0.005160648,0.00635929,-0.046252426,0.02528315,0.011452707,-0.027678482,0.03407,-0.011477066,0.031391222,0.03503156,0.074859306,0.10656301,-0.017464641,-0.0071916147,-0.0017336973,0.011096334,-0.00196856,-0.0011247123,0.015821813,0.029612036,-0.026097367,-0.052088507,0.011559932,0.07270445,0.042781293,-0.008191541,0.024613231,-0.0077944547,-0.047154654,0.03669949,0.012737658,-0.03140347,0.007844862,0.007385566,0.022298627,0.042292356,0.024079353,0.025242304,0.01029948,-0.008033523,0.045411658,-0.04104895,-0.044257306,-0.032944083,0.0126014035,-0.04650005,-0.020687813,0.013600607,-0.035558663,-0.03763346,-0.029245187,0.03390636,0.014694613,-0.026457448,-0.0023208652,0.002920029,-0.047297277,0.0057200096,0.054387644,0.00020233958,0.045876786,0.037716486,0.011447979,-0.00088509603,-0.008394037,0.06074685,-0.031079568,-0.013282787,0.016369445,0.036137518,-0.00635174,-0.03205238,-0.010773189,0.036325775,-0.0125563415,0.026364155,0.03570505,-0.0023575036,-0.016355705,0.037050325,0.009497651,0.015681015,-0.0047962824,0.005310909,-0.011330838,0.058013644,0.02772935,-0.046225194,0.032414578,-0.017292943,0.020322207,-0.037193354,0.011404747,0.052020002,-0.01309055,0.011864444,-0.04873129,0.03450533,-0.05288476,0.039115746,-0.060382374,0.0104639,0.018530266,-0.04803011,-0.04766286,0.017051032,0.011268746,-0.023039497,0.025561066,0.009359453,0.07871331,-0.009529863,-0.013275323,0.01826522,-0.014974497,-0.050484035,0.030139495,-0.00630422,-0.01369075,0.013018037,0.058163818,0.048166394,-0.0030316892,-0.03786368,-0.01202556,-0.023344528,0.05581935,0.013278893,-0.014864623,-0.040148098,-0.036926277,0.07106407,-0.0008512429,0.071560346,-0.053308286,-0.05807337,-0.03299928,-0.011631936,0.020726124,0.023948675,0.029173523,0.048896194,0.020016273,-0.042369965,0.0425637,-0.030908016,-0.019609721,-0.04903997,-0.019239785,0.043491248,0.020711243,-0.017317206,0.016263267,-0.048183102,0.05137923,-0.02237005,-0.010761276,-0.034221094,0.037200626,0.022426724,-0.023417939,-0.02835042,-0.00028396625,0.036648035,0.0043511274,-0.049138576,0.06855659,0.025067914,0.049266938,0.0052893027,-0.05850695,-0.0033828549,0.031924102,0.042541277,-0.055873435,-0.012439191,0.0448889,-0.02885164,0.017464943,0.0025943967,0.031557936,-0.021810642,-0.023539737,-0.0326208,0.055002924,0.009458272,0.026984533,0.0138062,-0.018783478,-0.035220947,0.03842402,0.0017065059,-0.012902142,-0.002007809,-0.051552795,0.028274115,-0.015331313,0.024443319,-0.0018180808,0.0037166502,0.023411151,-0.009378573,-0.013301259,0.08240249,0.0022902181,-0.016313914,0.015745448,0.002819647,0.0017821008,-0.047404405,0.011464987,0.0014826711,-0.06151054,0.015124755,0.05819307,0.026159083,0.026944939,-0.04658159,0.00961336,-0.011759582,0.054555375,0.08396351,-0.024199238,-0.08440414,0.005733716,-0.0060182186,-0.0108517455,-0.0034120583,-0.0376924,0.012657559,-0.00782242,-0.0018890387,-0.00983099,-0.07374431,-0.037549276,-0.013602024,0.012871355,0.011270226,0.03622151,-0.009813558,-0.04926594,-0.033458572,0.06469475,0.001771087,-0.04126754,0.02094221,-0.055349022,-0.004793379,-0.026452413,0.06161934,0.029374061,-0.013117274,0.03327067,0.016482214,-0.018673932,-0.0056909905,0.0061777295,0.032588392,-0.045203038]
\.


--
-- Data for Name: sale_campaign_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_campaign_categories (id, created_at, category_id, sale_campaign_id) FROM stdin;
1	2026-03-21 09:49:27.103469	1	1
2	2026-03-21 10:05:40.705268	1	2
3	2026-03-21 10:20:45.331217	1	4
4	2026-06-07 13:15:02.125172	1	5
5	2026-06-07 13:43:53.121789	1	6
\.


--
-- Data for Name: sale_campaign_discount_tiers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_campaign_discount_tiers (id, discount_percent, max_price, min_price, sort_order, sale_campaign_id) FROM stdin;
1	10	1000000.00	1000.00	0	1
2	15	1000000.00	1000.00	1	1
3	20	1000000.00	1000.00	2	1
4	20	100000000.00	100000.00	0	2
5	10	100000000.00	100000.00	0	4
6	20	10000000.00	500000.00	0	5
7	20	5000000.00	100000.00	0	6
\.


--
-- Data for Name: sale_campaign_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_campaign_items (id, discount_percent, sale_price, sold_count, sort_order, stock_limit, sale_campaign_id, variant_id) FROM stdin;
1	20	10232000.00	0	0	46	2	4
2	20	10232000.00	0	1	45	2	3
3	20	10232000.00	0	2	12	2	5
4	20	28552000.00	0	3	10	2	2
5	20	28552000.00	0	4	12	2	1
6	20	30799200.00	0	5	10	2	7
7	20	30799200.00	0	6	12	2	6
8	10	11511000.00	0	0	46	4	4
9	10	11511000.00	0	1	45	4	3
10	10	11511000.00	0	2	12	4	5
11	10	32121000.00	0	3	10	4	2
12	10	32121000.00	0	4	12	4	1
13	10	34649100.00	0	5	10	4	7
14	10	34649100.00	0	6	12	4	6
15	20	960000.00	0	0	12	5	61
16	20	8000000.00	0	1	12	5	62
17	20	8000000.00	0	2	11	5	63
18	20	960000.00	0	0	12	6	61
\.


--
-- Data for Name: sale_campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_campaigns (id, banner_url, created_at, deleted, description, end_time, name, slug, start_time, status, updated_at) FROM stdin;
1	\N	2026-03-21 09:49:27.035389	f	Great summer deals	2026-04-30 23:59:59	Summer Sale 2026	summer-sale-2026	2026-03-21 00:00:00	CANCELLED	2026-03-21 10:03:56.219721
2	\N	2026-03-21 10:05:40.700585	f	Giß║úm gi├í h├¿ 2026	2026-04-21 03:05:00	Giß║úm gi├í h├¿ 2026	gim-gi-h-2026	2026-03-21 03:06:00	CANCELLED	2026-03-21 10:06:09.391719
4	\N	2026-03-21 10:20:45.32644	f	\N	2026-07-21 03:20:00	Giß║úm gi├í h├¿ 26	gim-gi-h-26	2026-03-21 03:21:00	ACTIVE	2026-03-21 10:20:47.721499
5	\N	2026-06-07 13:15:02.110478	f	\N	2026-07-04 06:14:00	Black Fridayyyyyyyyyyy	black-fridayyyyyyyyyyy	2026-06-08 06:14:00	SCHEDULED	2026-06-07 13:15:05.987863
6	\N	2026-06-07 13:43:53.114452	f	\N	2026-06-26 06:43:00	Black Fridayggfdgdgdg	black-fridayggfdgdgdg	2026-06-07 06:46:00	ACTIVE	2026-06-07 13:43:56.307484
\.


--
-- Data for Name: variant_option_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_option_values (id, price_modifier, option_value_id, variant_id) FROM stdin;
3	0.00	2	1
4	0.00	1	2
5	0.00	5	3
6	0.00	3	4
7	0.00	4	5
8	0.00	6	6
9	0.00	7	7
10	0.00	8	8
11	0.00	9	9
12	0.00	10	10
13	0.00	11	11
14	0.00	12	12
15	0.00	13	13
16	0.00	14	14
18	0.00	15	15
19	0.00	16	16
20	0.00	17	17
21	0.00	18	18
22	0.00	19	19
23	0.00	20	20
24	0.00	21	20
25	0.00	20	21
26	0.00	22	21
27	0.00	20	23
28	0.00	23	23
31	0.00	20	25
32	0.00	24	25
33	0.00	25	26
34	0.00	26	26
35	0.00	25	27
36	0.00	28	27
37	0.00	25	28
38	0.00	27	28
43	0.00	31	29
44	0.00	30	29
45	0.00	32	30
46	0.00	29	30
47	0.00	32	31
48	0.00	30	31
49	0.00	33	32
50	0.00	29	32
51	0.00	33	33
52	0.00	30	33
53	0.00	34	37
54	0.00	35	38
55	0.00	36	39
56	0.00	37	40
57	0.00	38	41
58	0.00	40	42
59	0.00	41	44
61	0.00	42	45
62	0.00	43	47
63	0.00	44	48
65	0.00	45	49
66	0.00	47	50
67	0.00	46	51
68	0.00	48	52
69	0.00	51	54
70	0.00	50	55
71	0.00	49	56
72	0.00	53	59
73	0.00	52	60
74	0.00	54	61
75	0.00	56	62
76	0.00	57	63
77	0.00	58	64
78	0.00	59	65
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: description_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.description_images_id_seq', 12, true);


--
-- Name: flash_sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flash_sale_items_id_seq', 2, true);


--
-- Name: flash_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flash_sales_id_seq', 1, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 65, true);


--
-- Name: product_option_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_option_values_id_seq', 59, true);


--
-- Name: product_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_options_id_seq', 26, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 65, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 32, true);


--
-- Name: sale_campaign_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_campaign_categories_id_seq', 5, true);


--
-- Name: sale_campaign_discount_tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_campaign_discount_tiers_id_seq', 7, true);


--
-- Name: sale_campaign_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_campaign_items_id_seq', 18, true);


--
-- Name: sale_campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_campaigns_id_seq', 6, true);


--
-- Name: variant_option_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variant_option_values_id_seq', 78, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: description_images description_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.description_images
    ADD CONSTRAINT description_images_pkey PRIMARY KEY (id);


--
-- Name: flash_sale_items flash_sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_pkey PRIMARY KEY (id);


--
-- Name: flash_sales flash_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sales
    ADD CONSTRAINT flash_sales_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_option_values product_option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT product_option_values_pkey PRIMARY KEY (id);


--
-- Name: product_options product_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: sale_campaign_categories sale_campaign_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_categories
    ADD CONSTRAINT sale_campaign_categories_pkey PRIMARY KEY (id);


--
-- Name: sale_campaign_discount_tiers sale_campaign_discount_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_discount_tiers
    ADD CONSTRAINT sale_campaign_discount_tiers_pkey PRIMARY KEY (id);


--
-- Name: sale_campaign_items sale_campaign_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_items
    ADD CONSTRAINT sale_campaign_items_pkey PRIMARY KEY (id);


--
-- Name: sale_campaigns sale_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaigns
    ADD CONSTRAINT sale_campaigns_pkey PRIMARY KEY (id);


--
-- Name: flash_sales uk5vmdq5jtlly1uxe1mtdn270hx; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sales
    ADD CONSTRAINT uk5vmdq5jtlly1uxe1mtdn270hx UNIQUE (slug);


--
-- Name: flash_sale_items uk_flash_sale_variant; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT uk_flash_sale_variant UNIQUE (flash_sale_id, variant_id);


--
-- Name: sale_campaign_categories uk_sale_campaign_category; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_categories
    ADD CONSTRAINT uk_sale_campaign_category UNIQUE (sale_campaign_id, category_id);


--
-- Name: sale_campaign_items uk_sale_campaign_variant; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_items
    ADD CONSTRAINT uk_sale_campaign_variant UNIQUE (sale_campaign_id, variant_id);


--
-- Name: sale_campaigns ukngkcpm5d7agj1q4m9f0j61dcl; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaigns
    ADD CONSTRAINT ukngkcpm5d7agj1q4m9f0j61dcl UNIQUE (slug);


--
-- Name: products ukostq1ec3toafnjok09y9l7dox; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT ukostq1ec3toafnjok09y9l7dox UNIQUE (slug);


--
-- Name: categories ukoul14ho7bctbefv8jywp5v3i2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT ukoul14ho7bctbefv8jywp5v3i2 UNIQUE (slug);


--
-- Name: product_variants ukq935p2d1pbjm39n0063ghnfgn; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT ukq935p2d1pbjm39n0063ghnfgn UNIQUE (sku);


--
-- Name: variant_option_values variant_option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_option_values
    ADD CONSTRAINT variant_option_values_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_flash_sale_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_deleted ON public.flash_sales USING btree (deleted);


--
-- Name: idx_flash_sale_end_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_end_time ON public.flash_sales USING btree (end_time);


--
-- Name: idx_flash_sale_item_flash_sale; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_item_flash_sale ON public.flash_sale_items USING btree (flash_sale_id);


--
-- Name: idx_flash_sale_item_variant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_item_variant ON public.flash_sale_items USING btree (variant_id);


--
-- Name: idx_flash_sale_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_slug ON public.flash_sales USING btree (slug);


--
-- Name: idx_flash_sale_start_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_start_time ON public.flash_sales USING btree (start_time);


--
-- Name: idx_flash_sale_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_status ON public.flash_sales USING btree (status);


--
-- Name: idx_product_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_category_id ON public.products USING btree (category_id);


--
-- Name: idx_product_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_deleted ON public.products USING btree (deleted);


--
-- Name: idx_product_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_slug ON public.products USING btree (slug);


--
-- Name: idx_product_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_status ON public.products USING btree (status);


--
-- Name: idx_product_status_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_status_user ON public.products USING btree (status, user_id);


--
-- Name: idx_product_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_user_id ON public.products USING btree (user_id);


--
-- Name: idx_sale_campaign_category_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_category_campaign ON public.sale_campaign_categories USING btree (sale_campaign_id);


--
-- Name: idx_sale_campaign_category_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_category_category ON public.sale_campaign_categories USING btree (category_id);


--
-- Name: idx_sale_campaign_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_deleted ON public.sale_campaigns USING btree (deleted);


--
-- Name: idx_sale_campaign_end_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_end_time ON public.sale_campaigns USING btree (end_time);


--
-- Name: idx_sale_campaign_item_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_item_campaign ON public.sale_campaign_items USING btree (sale_campaign_id);


--
-- Name: idx_sale_campaign_item_variant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_item_variant ON public.sale_campaign_items USING btree (variant_id);


--
-- Name: idx_sale_campaign_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_slug ON public.sale_campaigns USING btree (slug);


--
-- Name: idx_sale_campaign_start_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_start_time ON public.sale_campaigns USING btree (start_time);


--
-- Name: idx_sale_campaign_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_status ON public.sale_campaigns USING btree (status);


--
-- Name: idx_sale_campaign_tier_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_campaign_tier_campaign ON public.sale_campaign_discount_tiers USING btree (sale_campaign_id);


--
-- Name: sale_campaign_items fk2rmlbtla2f1tnwmhk1vd8slta; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_items
    ADD CONSTRAINT fk2rmlbtla2f1tnwmhk1vd8slta FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: description_images fk7g796lyqg0nsf37f4p90vrl1r; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.description_images
    ADD CONSTRAINT fk7g796lyqg0nsf37f4p90vrl1r FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: flash_sale_items fk86yyoqeiisx1rsodorhrao4bt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT fk86yyoqeiisx1rsodorhrao4bt FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: product_options fk8vv4f8fru80wxocwgxwsrow61; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT fk8vv4f8fru80wxocwgxwsrow61 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: variant_option_values fk9b9ufkyxmc7sh370irn5b3hx6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_option_values
    ADD CONSTRAINT fk9b9ufkyxmc7sh370irn5b3hx6 FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: variant_option_values fkc9eay2np5s77aow2qo9k36drc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_option_values
    ADD CONSTRAINT fkc9eay2np5s77aow2qo9k36drc FOREIGN KEY (option_value_id) REFERENCES public.product_option_values(id);


--
-- Name: sale_campaign_discount_tiers fkdcwf0ovselkmvwnbjaflhv3is; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_discount_tiers
    ADD CONSTRAINT fkdcwf0ovselkmvwnbjaflhv3is FOREIGN KEY (sale_campaign_id) REFERENCES public.sale_campaigns(id);


--
-- Name: sale_campaign_categories fkh19ybnjas1kvt0i3uc6hafkm5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_categories
    ADD CONSTRAINT fkh19ybnjas1kvt0i3uc6hafkm5 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: sale_campaign_categories fkj3m6nb980xhaiedm22l4k0hsn; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_categories
    ADD CONSTRAINT fkj3m6nb980xhaiedm22l4k0hsn FOREIGN KEY (sale_campaign_id) REFERENCES public.sale_campaigns(id);


--
-- Name: flash_sale_items fkmr5agn0eu29xqqog30yspa3e3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT fkmr5agn0eu29xqqog30yspa3e3 FOREIGN KEY (flash_sale_id) REFERENCES public.flash_sales(id);


--
-- Name: product_option_values fkmre6ippw97evhwrbl15ushuw; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT fkmre6ippw97evhwrbl15ushuw FOREIGN KEY (option_id) REFERENCES public.product_options(id);


--
-- Name: products fkog2rp4qthbtt2lfyhfo32lsw9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkog2rp4qthbtt2lfyhfo32lsw9 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: product_variants fkosqitn4s405cynmhb87lkvuau; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkosqitn4s405cynmhb87lkvuau FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: sale_campaign_items fkot6hm3v41sabtmfrbf6eitfj2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_campaign_items
    ADD CONSTRAINT fkot6hm3v41sabtmfrbf6eitfj2 FOREIGN KEY (sale_campaign_id) REFERENCES public.sale_campaigns(id);


--
-- Name: product_images fkqnq71xsohugpqwf3c9gxmsuy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fkqnq71xsohugpqwf3c9gxmsuy FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 7VcoyZhEsqy8VvzgDmAibM6W7MXNlB5RDXHucu6QVLowPrvitxClGUBO7OydNAF

