import express from 'express';
import cors from 'cors';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(cors()); // Autorise le Frontend React à appeler l'API
app.use(express.json());

// --- DONNÉES STATIQUES ---
const products = [
  { id: 'p1', name: 'Montre Luxe', price: 199, image: '⌚' },
  { id: 'p2', name: 'Sac Designer', price: 85, image: '👜' },
  { id: 'p3', name: 'Casque Audio', price: 45, image: '🎧' }
];

// 1. CONFIGURATION MCP
const mcpServer = new Server({ name: "sahar-shop", version: "1.0.0" }, { capabilities: { tools: {} } });

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "get_products", description: "Liste les produits", inputSchema: { type: "object" } },
    { name: "create_cart_link", description: "Génère un lien panier", inputSchema: { 
        type: "object", properties: { ids: { type: "string" } } 
    } }
  ]
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_products") return { content: [{ type: "text", text: JSON.stringify(products) }] };
  if (request.params.name === "create_cart_link") {
    // Remplacer par l'URL finale du client (ex: GitHub Pages)
    const url = `https://sahar-client-shop.github.io/?items=${request.params.arguments.ids}`;
    return { content: [{ type: "text", text: `Lien généré : ${url}` }] };
  }
});

// 2. API POUR LE FRONTEND REACT
app.get('/api/products', (req, res) => res.json(products));

// 3. TRANSPORT SSE (POUR OPENAI)
let transport;
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await mcpServer.connect(transport);
});
app.post("/messages", (req, res) => transport.handlePostMessage(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur Backend sur le port ${PORT}`));