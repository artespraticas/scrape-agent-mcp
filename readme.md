# 🕷️ Scrape Agent MCP

A Model Context Protocol (MCP) server that provides pay-per-use web scraping 
via the x402 payment protocol. Scrape any public URL for $0.01 USDC on Base — 
no API key, no subscription needed.

## What it does

Exposes a `scrape_url` tool that AI assistants (Claude, Cursor, etc.) can use 
to scrape any public URL and get back clean text, links, or HTML.

## Installation

Add to Claude Desktop via Smithery:

[![smithery badge](https://smithery.ai/badge/artespraticas/scrape-agent-mcp)](https://smithery.ai/servers/artespraticas/scrape-agent-mcp)

Or add manually to your MCP config:
```json
{
  "mcpServers": {
    "scrape-agent": {
      "url": "https://scrape-agent-mcp.vercel.app"
    }
  }
}
```

## Usage

Once installed, ask your AI assistant:
> "Scrape https://example.com and give me the main content"

The tool handles x402 payment automatically.

## Pricing

- **$0.01 USDC** per scrape request
- Payment via x402 protocol on Base mainnet
- Payment address: `0x0d4897bf4222deddf8a5b31fa7d8021c369f40d1`

## Tool: scrape_url

| Parameter | Type | Required | Description |
|---|---|---|---|
| url | string | ✅ | The URL to scrape |
| extract | string | ❌ | text, html, links, meta, or full (default: text) |

## Links

- 🌐 **Website:** https://scrapeagent.xyz
- 📖 **API Docs:** https://scrapeagent.xyz/openapi.json
- 🔗 **Smithery:** https://smithery.ai/servers/artespraticas/scrape-agent-mcp
- ⚡ **x402 Protocol:** https://x402.org
