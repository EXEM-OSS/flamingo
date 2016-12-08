-- Table: public.fl_workflow

DROP TABLE IF EXISTS fl_workflow CASCADE;

CREATE TABLE fl_workflow
(
  id bigserial,
  workflow_id character varying NOT NULL,
  workflow_name character varying NOT NULL, -- Workflow Name
  description character varying DEFAULT ''::character varying, -- Description
  variable text,
  workflow_xml text NOT NULL,
  designer_xml text NOT NULL, -- Designer XML
  create_dt timestamp with time zone DEFAULT now(), -- Workflow Variable
  status character varying NOT NULL,
  tree_id bigint NOT NULL,
  username character varying NOT NULL,
  CONSTRAINT "FL_WORKFLOW_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE fl_workflow
  OWNER TO flamingo;
COMMENT ON TABLE flamingo.fl_workflow
  IS 'flamingo workflow table';
COMMENT ON COLUMN flamingo.fl_workflow.workflow_name IS 'Workflow Name';
COMMENT ON COLUMN flamingo.fl_workflow.description IS 'Description';
COMMENT ON COLUMN flamingo.fl_workflow.designer_xml IS 'Designer XML';
COMMENT ON COLUMN flamingo.fl_workflow.create_dt IS 'Workflow Variable';

-- Table: public.fl_tree

DROP TABLE IF EXISTS fl_tree CASCADE;

CREATE TABLE fl_tree
(
    id bigserial,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    tree character varying COLLATE pg_catalog."default" NOT NULL,
    node character varying COLLATE pg_catalog."default" NOT NULL,
    root boolean,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    parent_id bigint,
    CONSTRAINT fl_tree_pkey PRIMARY KEY (id),
    CONSTRAINT "fl_tree_PARENT_ID_fkey" FOREIGN KEY (parent_id)
        REFERENCES public.fl_tree (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE fl_tree
    OWNER to flamingo;

INSERT INTO fl_tree (id, name, tree, node, root, username)
VALUES (1, '/', 'WORKFLOW', 'FOLDER', true, 'admin');