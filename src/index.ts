import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE_URL = "https://onlinekommentar.ch/api";

interface Commentary {
  id: string;
  title: string;
  language: string;
  date: string;
  legislative_act: {
    id: string;
    title: string;
  };
  legal_domain?: {
    id: string;
    name: string;
  };
  authors: {
    id: string;
    name: string;
  }[];
  editors?: {
    id: string;
    name: string;
  }[];
  html_link: string;
  content?: string;
}

// Create an MCP server
const server = new McpServer({
  name: "online-kommentar-server",
  version: "1.0.0",
});

// Tool to search for commentaries
server.registerTool(
  "search_commentaries",
  {
    title: "Search Commentaries",
    description: "Searches for legal commentaries based on a query and filters.",
    inputSchema: {
      search: z.string().describe("The full-text search query."),
      language: z.enum(["en", "de", "fr", "it"]).optional().describe("Content language."),
      legislative_act: z.string().optional().describe("Filter by legislative act ID."),
      sort: z.enum(["title", "-title", "date", "-date"]).optional().describe("Sort order."),
      page: z.number().optional().describe("Page number for pagination."),
    },
  },
  async (args: { search: string; language?: "en" | "de" | "fr" | "it"; legislative_act?: string; sort?: "title" | "-title" | "date" | "-date"; page?: number; }) => {
    const { search, language, legislative_act, sort, page } = args;
    const queryParams = new URLSearchParams({
        ...(search && { search }),
        ...(language && { language }),
        ...(legislative_act && { legislative_act }),
        ...(sort && { sort }),
        ...(page && { page: page.toString() }),
    });

    try {
        const response = await fetch(`${API_BASE_URL}/commentaries?${queryParams.toString()}`, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = (await response.json()) as { data: Commentary[] };
        const commentaries = data.data;
        const resultText = commentaries.length > 0
            ? commentaries.map(c => `ID: ${c.id}\nTitle: ${c.title}\nDate: ${c.date}\nURL: ${c.html_link}`).join("\n\n")
            : "No commentaries found for the given criteria.";

        return {
            content: [{ type: "text", text: resultText }],
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return {
            content: [{ type: "text", text: `Error searching commentaries: ${errorMessage}` }],
            isError: true,
        };
    }
  }
);

// Tool to get a commentary by ID
server.registerTool(
  "get_commentary_by_id",
  {
    title: "Get Commentary by ID",
    description: "Retrieves a specific commentary by its ID.",
    inputSchema: {
      id: z.string().describe("The ID of the commentary to retrieve."),
    },
  },
  async ({ id }: { id: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/commentaries/${id}`, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    content: [{ type: "text", text: `Commentary with ID '${id}' not found.` }],
                    isError: true,
                };
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = (await response.json()) as { data: Commentary };
        const commentary = data.data;
        
        // Let's format the output nicely for the user
        const authors = commentary.authors.map(a => a.name).join(', ');
        const editors = commentary.editors ? commentary.editors.map(e => e.name).join(', ') : 'None listed';
        const resultText = `
Title: ${commentary.title}
ID: ${commentary.id}
Language: ${commentary.language}
Publication Date: ${commentary.date}
Legislative Act: ${commentary.legislative_act.title}
Legal Domain: ${commentary.legal_domain?.name || 'Not specified'}
Authors: ${authors}
Editors: ${editors}
URL: ${commentary.html_link}
Content:
${commentary.content || 'Full content not available in summary.'}
        `.trim();

        return {
            content: [{ type: "text", text: resultText }],
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return {
            content: [{ type: "text", text: `Error retrieving commentary: ${errorMessage}` }],
            isError: true,
        };
    }
  }
);

async function main() {
    console.error("Starting Online Kommentar MCP Server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Server connected to transport.");
}

main().catch(err => {
    console.error("Server failed to start:", err);
    process.exit(1);
}); 