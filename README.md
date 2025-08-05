# Online Kommentar MCP Server

A Model Context Protocol (MCP) server that provides access to Swiss legal commentaries from [onlinekommentar.ch](https://onlinekommentar.ch). This server allows you to search and retrieve detailed legal commentaries on Swiss federal law through Claude Desktop or other MCP-compatible clients.

<a href="https://glama.ai/mcp/servers/@self-tech-labs/onlinekommentar-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@self-tech-labs/onlinekommentar-mcp/badge" alt="Online Kommentar Server MCP server" />
</a>

## Features

- **Search Commentaries**: Full-text search across legal commentaries with filtering options
- **Retrieve Individual Commentaries**: Get detailed content for specific legal articles
- **Multi-language Support**: Search in English, German, French, and Italian
- **Advanced Filtering**: Filter by legislative act, sort by title or date
- **Pagination Support**: Navigate through large result sets

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Claude Desktop (for MCP integration)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/self-tech-labs/onlinekommentar-mcp.git
   cd onlinekommentar-mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

## Usage with Claude Desktop

### Configuration

Add the following configuration to your Claude Desktop MCP settings file:

**On macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**On Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "online-kommentar": {
      "command": "node",
      "args": ["/path/to/onlinekommentar-mcp/build/index.js"]
    }
  }
}
```

Replace `/path/to/onlinekommentar-mcp` with the actual path to your project directory.

### Restart Claude Desktop

After adding the configuration, restart Claude Desktop to load the MCP server.

## Available Tools

### 1. Search Commentaries

Search for legal commentaries using various filters.

**Parameters**:
- `search` (required): Full-text search query
- `language` (optional): Content language (`en`, `de`, `fr`, `it`)
- `legislative_act` (optional): Filter by legislative act ID
- `sort` (optional): Sort order (`title`, `-title`, `date`, `-date`)
- `page` (optional): Page number for pagination

**Example queries**:
- "Search for commentaries about intellectual property"
- "Find German commentaries about data protection"
- "Search for articles related to criminal law, sorted by date"

### 2. Get Commentary by ID

Retrieve detailed information about a specific commentary using its ID.

**Parameters**:
- `id` (required): The unique identifier of the commentary

**Example**:
- "Get commentary details for ID: 6d8aee6b-86d0-43f2-8110-2d5b7360dd18"

## Examples

### Search Example

```
Search for commentaries about "constitutional rights" in English
```

This will return a list of relevant commentaries with their IDs, titles, publication dates, and URLs.

### Detailed Commentary Example

```
Get the full content of commentary ID: 7058f7a5-19d8-444e-a901-7bb635ded375
```

This will return comprehensive information including:
- Full title and publication details
- Authors and editors
- Legislative act information
- Complete commentary content
- Legal text being commented on

## Development

### Project Structure

```
onlinekommentar-mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── build/                # Compiled JavaScript output
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled server (for testing)

### API Integration

The server integrates with the onlinekommentar.ch API:
- Base URL: `https://onlinekommentar.ch/api`
- Endpoints:
  - `/commentaries` - Search commentaries
  - `/commentaries/{id}` - Get specific commentary

## Technical Details

### MCP Protocol

This server implements the Model Context Protocol specification, providing:
- Tool registration for search and retrieval functions
- Proper error handling and response formatting
- JSON schema validation for parameters

### Data Structure

Commentary objects include:
- Unique identifiers
- Multilingual titles and content
- Author and editor information
- Legislative act associations
- Publication dates and metadata
- Direct links to online versions

## Troubleshooting

### Common Issues

1. **Server not appearing in Claude Desktop**:
   - Check the configuration file path and syntax
   - Ensure the build directory exists and contains compiled JavaScript
   - Restart Claude Desktop after configuration changes

2. **Build errors**:
   - Verify Node.js version (14+ required)
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript compilation errors

3. **API connection issues**:
   - Verify internet connectivity
   - Check if onlinekommentar.ch is accessible
   - Review error messages in Claude Desktop logs

### Debugging

To debug the MCP server:

1. Check Claude Desktop logs for error messages
2. Test the API endpoints directly using curl:
   ```bash
   curl "https://onlinekommentar.ch/api/commentaries?search=test"
   ```
3. Verify the build output in the `build/` directory

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is open source. Please refer to the license file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the MCP protocol documentation

## Acknowledgments

- [onlinekommentar.ch](https://onlinekommentar.ch) for providing the legal commentary API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the integration framework
- Swiss legal community for comprehensive commentary resources

---

**Note**: This tool provides access to Swiss legal commentaries for informational purposes. Always consult qualified legal professionals for legal advice.