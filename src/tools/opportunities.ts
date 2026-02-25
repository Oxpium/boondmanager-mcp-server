import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OpportunityCreateSchema, OpportunityUpdateSchema, IdSchema } from "../schemas/index.js";
import type { IdInput } from "../schemas/index.js";
import {
  registerSearchTool,
  registerGetTool,
  registerCreateTool,
  registerUpdateTool,
  registerDeleteTool,
  buildJsonApiBody,
} from "./crud-factory.js";
import { apiRequest, formatDetailResponse } from "../services/boond-client.js";

const OPTS = {
  entityName: "opportunité",
  entityNamePlural: "opportunités",
  apiPath: "/opportunities",
  prefix: "boond_opportunities",
};

const TAB_TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

interface TabDefinition {
  name: string;
  tab: string;
  title: string;
  description: string;
}

const OPPORTUNITY_TABS: TabDefinition[] = [
  {
    name: "information",
    tab: "information",
    title: "Informations générales d'une opportunité",
    description: `Récupère les informations générales d'une opportunité (client, dates, montant, probabilité, état...).

Args:
  - id (string): ID de l'opportunité

Returns: Données générales de l'opportunité.`,
  },
  {
    name: "actions",
    tab: "actions",
    title: "Actions liées à une opportunité",
    description: `Récupère les actions (appels, emails, RDV, notes) associées à une opportunité.

Args:
  - id (string): ID de l'opportunité

Returns: Liste des actions liées à l'opportunité.`,
  },
  {
    name: "documents",
    tab: "documents",
    title: "Documents d'une opportunité",
    description: `Récupère les documents attachés à une opportunité (propositions commerciales, cahiers des charges...).

Args:
  - id (string): ID de l'opportunité

Returns: Liste des documents de l'opportunité.`,
  },
];

export function registerOpportunityTools(server: McpServer): void {
  registerSearchTool(server, OPTS);
  registerGetTool(server, OPTS);

  registerCreateTool(server, OPTS, OpportunityCreateSchema, (params) => {
    const { companyId, contactId, ...attrs } = params;
    const body = buildJsonApiBody("opportunity", attrs);
    const relationships: Record<string, unknown> = {};
    if (companyId) relationships.company = { data: { id: companyId, type: "company" } };
    if (contactId) relationships.contact = { data: { id: contactId, type: "contact" } };
    if (Object.keys(relationships).length > 0) {
      (body as Record<string, Record<string, unknown>>).data.relationships = relationships;
    }
    return body;
  });

  registerUpdateTool(server, OPTS, OpportunityUpdateSchema, (params) => {
    const { id, ...attrs } = params;
    return buildJsonApiBody("opportunity", attrs, id as string);
  });

  registerDeleteTool(server, OPTS);

  // Register one tool per opportunity tab
  for (const tab of OPPORTUNITY_TABS) {
    server.registerTool(
      `boond_opportunities_${tab.name}`,
      {
        title: tab.title,
        description: tab.description,
        inputSchema: IdSchema,
        annotations: TAB_TOOL_ANNOTATIONS,
      },
      async (params: IdInput) => {
        const response = await apiRequest(`/opportunities/${params.id}/${tab.tab}`);
        const text = formatDetailResponse(response);
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );
  }
}
