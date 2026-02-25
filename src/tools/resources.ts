import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceCreateSchema, ResourceUpdateSchema, IdSchema } from "../schemas/index.js";
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
  entityName: "ressource",
  entityNamePlural: "ressources",
  apiPath: "/resources",
  prefix: "boond_resources",
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

const RESOURCE_TABS: TabDefinition[] = [
  {
    name: "information",
    tab: "information",
    title: "Informations générales d'une ressource",
    description: `Récupère les informations générales d'une ressource (coordonnées, adresse, état civil, photo, tags, manager...).

Args:
  - id (string): ID de la ressource

Returns: Données personnelles et administratives de la ressource.`,
  },
  {
    name: "technical",
    tab: "technical",
    title: "Compétences techniques d'une ressource",
    description: `Récupère le profil technique d'une ressource (compétences, expériences, formations, certifications, langues, CV...).

Args:
  - id (string): ID de la ressource

Returns: Données techniques et compétences de la ressource.`,
  },
  {
    name: "financial",
    tab: "financial",
    title: "Données financières d'une ressource",
    description: `Récupère les informations financières d'une ressource (salaire, TJM, coût journalier, frais, avantages, historique de rémunération...).

Args:
  - id (string): ID de la ressource

Returns: Données financières et de rémunération de la ressource.`,
  },
  {
    name: "actions",
    tab: "actions",
    title: "Actions liées à une ressource",
    description: `Récupère les actions (appels, emails, RDV, notes) associées à une ressource.

Args:
  - id (string): ID de la ressource

Returns: Liste des actions liées à la ressource.`,
  },
  {
    name: "contracts",
    tab: "contracts",
    title: "Contrats d'une ressource",
    description: `Récupère les contrats de travail d'une ressource (CDI, CDD, freelance, dates, conditions, avenants...).

Args:
  - id (string): ID de la ressource

Returns: Liste des contrats de la ressource.`,
  },
  {
    name: "documents",
    tab: "documents",
    title: "Documents d'une ressource",
    description: `Récupère les documents attachés à une ressource (CV, pièces d'identité, contrats signés, certifications...).

Args:
  - id (string): ID de la ressource

Returns: Liste des documents de la ressource.`,
  },
];

export function registerResourceTools(server: McpServer): void {
  registerSearchTool(server, OPTS);
  registerGetTool(server, OPTS);

  registerCreateTool(server, OPTS, ResourceCreateSchema, (params) => {
    const { ...attrs } = params;
    return buildJsonApiBody("resource", attrs);
  });

  registerUpdateTool(server, OPTS, ResourceUpdateSchema, (params) => {
    const { id, ...attrs } = params;
    return buildJsonApiBody("resource", attrs, id as string);
  });

  registerDeleteTool(server, OPTS);

  // Register one tool per resource tab
  for (const tab of RESOURCE_TABS) {
    server.registerTool(
      `boond_resources_${tab.name}`,
      {
        title: tab.title,
        description: tab.description,
        inputSchema: IdSchema,
        annotations: TAB_TOOL_ANNOTATIONS,
      },
      async (params: IdInput) => {
        const response = await apiRequest(`/resources/${params.id}/${tab.tab}`);
        const text = formatDetailResponse(response);
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );
  }
}
