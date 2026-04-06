import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const products = [
  { id: 'p1', name: 'Premium Watch', price: 199, emoji: '⌚' },
  { id: 'p2', name: 'Designer Bag', price: 85, emoji: '👜' }
];

const mcp = new Server({ name: "sahar-shop", version: "1.0.0" }, { capabilities: { tools: {} } });

mcp.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "list", description: "Get products", inputSchema: { type: "object" } },
    { name: "link", description: "Create cart link", inputSchema: { 
        type: "object", properties: { ids: { type: "string" } } 
    } }
  ]
}));

mcp.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "list") return { content: [{ type: "text", text: JSON.stringify(products) }] };
  if (request.params.name === "link") {
    // Vercel auto-provides the HOST header
    const host = request.headers?.host || "localhost:3000";
    const url = `https://${host}/?items=${request.params.arguments.ids}`;
    return { content: [{ type: "text", text: `Link: ${url}` }] };
  }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const transport = new SSEServerTransport("/api/mcp", res);
    await mcp.connect(transport);
  } else {
    // Handle POST messages from OpenAI
    res.status(200).json({ status: "ok" });
  }
}