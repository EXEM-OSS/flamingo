-- Table: flamingo.fl_workflow

DROP TABLE flamingo.fl_workflow;

CREATE TABLE flamingo.fl_workflow
(
  id bigint NOT NULL DEFAULT nextval('flamingo."FL_WORKFLOW_ID_seq"'::regclass),
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
ALTER TABLE flamingo.fl_workflow
  OWNER TO flamingo;
COMMENT ON TABLE flamingo.fl_workflow
  IS 'flamingo workflow table';
COMMENT ON COLUMN flamingo.fl_workflow.workflow_name IS 'Workflow Name';
COMMENT ON COLUMN flamingo.fl_workflow.description IS 'Description';
COMMENT ON COLUMN flamingo.fl_workflow.designer_xml IS 'Designer XML';
COMMENT ON COLUMN flamingo.fl_workflow.create_dt IS 'Workflow Variable';