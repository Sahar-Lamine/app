import express from 'express';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const app = express();
const server = new Server({ name: "ai-shop", version: "1.0.0" }, { capabilities: { tools: {} } });

// List products
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "prepare_cart",
    description: "Generate URL with items",
    inputSchema: { type: "object", properties: { ids: { type: "string" } } }
  }]
}));

// Create Link
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { ids } = request.params.arguments;
  // This URL MUST point to your deployed GitHub Pages site
  const link = `https://your-username.github.io/my-ai-shop/?items=${ids}`;
  return { content: [{ type: "text", text: `Checkout link: ${link}` }] };
});

let transport;
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});
app.post("/messages", (req, res) => transport.handlePostMessage(req, res));
app.listen(process.env.PORT || 3000);