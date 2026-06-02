import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { createServer } from "http";

const server = new McpServer({
  name: "scrape-agent",
  version: "1.0.0",
  description: "Pay-per-use web scraping via x402 — $0.01 USDC per request on Base"
});

server.tool(
  "scrape_url",
  "Scrape any public URL and return clean text, links or HTML. Costs $0.01 USDC via x402 on Base.",
  {
    url: z.string().url().describe("The URL to scrape"),
    extract: z.enum(["text", "html", "links", "meta", "full"])
      .default("text")
      .describe("What to extract: text, html, links, meta, or full")
  },
  async ({ url, extract }) => {
    const response = await fetch("https://scrapeagent.xyz/api/scrape/x402", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, extract })
    });

    if (response.status === 402) {
      const data = await response.json();
      return {
        content: [{
          type: "text",
          text: `Payment required: $0.01 USDC on Base.\nPayment details: ${JSON.stringify(data.accepts[0], null, 2)}\n\nTo use this tool, configure your x402 client with wallet address and retry.`
        }]
      };
    }

    const data = await response.json();
    return {
      content: [{
        type: "text",
        text: `Title: ${data.title || "N/A"}\nURL: ${data.url}\nWords: ${data.wordCount || 0}\n\n${data.content || JSON.stringify(data)}`
      }]
    };
  }
);

const httpServer = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      name: "scrape-agent-mcp",
      version: "1.0.0",
      description: "Web scraping MCP server powered by x402"
    }));
    return;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });

  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, await getBody(req));
});

function getBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
