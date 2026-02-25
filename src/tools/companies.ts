import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CompanyCreateSchema, CompanyUpdateSchema, IdSchema } from "../schemas/index.js";
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
  entityName: "société",
  entityNamePlural: "sociétés",
  apiPath: "/companies",
  prefix: "boond_companies",
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

const COMPANY_TABS: TabDefinition[] = [
  {
    name: "information",
    tab: "information",
    title: "Informations générales d'une société",
    description: `Récupère les informations générales d'une société (coordonnées, SIRET, site web, secteur, taille, tags...).

Args:
  - id (string): ID de la société

Returns: Données générales de la société.`,
  },
  {
    name: "actions",
    tab: "actions",
    title: "Actions liées à une société",
    description: `Récupère les actions (appels, emails, RDV, notes) associées à une société.

Args:
  - id (string): ID de la société

Returns: Liste des actions liées à la société.`,
  },
  {
    name: "documents",
    tab: "documents",
    title: "Documents d'une société",
    description: `Récupère les documents attachés à une société (contrats cadre, accords, présentations...).

Args:
  - id (string): ID de la société

Returns: Liste des documents de la société.`,
  },
];

export function registerCompanyTools(server: McpServer): void {
  registerSearchTool(server, OPTS);
  registerGetTool(server, OPTS);

  registerCreateTool(server, OPTS, CompanyCreateSchema, (params) => {
    const { ...attrs } = params;
    return buildJsonApiBody("company", attrs);
  });

  registerUpdateTool(server, OPTS, CompanyUpdateSchema, (params) => {
    const { id, ...attrs } = params;
    return buildJsonApiBody("company", attrs, id as string);
  });

  registerDeleteTool(server, OPTS);

  // Register one tool per company tab
  for (const tab of COMPANY_TABS) {
    server.registerTool(
      `boond_companies_${tab.name}`,
      {
        title: tab.title,
        description: tab.description,
        inputSchema: IdSchema,
        annotations: TAB_TOOL_ANNOTATIONS,
      },
      async (params: IdInput) => {
        const response = await apiRequest(`/companies/${params.id}/${tab.tab}`);
        const text = formatDetailResponse(response);
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );
  }
}
