# MCP Tool Selection Strategy and Decision Framework

## Purpose

This prompt provides strategic decision-making frameworks for optimal MCP tool selection and sequencing in AI collaboration workflows. Demonstrates systematic approaches for matching tools to task requirements, optimizing tool combinations, and building efficient workflows for different types of development and analysis work.

Focus areas include task classification methods, tool capability mapping, workflow optimization patterns, and strategic tool sequencing for maximum efficiency and quality outcomes.

## Core Principles

### 1. Task-Driven Tool Selection
- **Primary Task Analysis**: Classify work as information gathering, content creation, modification, analysis, or integration
- **Capability Mapping**: Match required capabilities to available tool functionality and strengths
- **Context Requirements**: Assess what context is needed and which tools provide optimal context gathering
- **Deliverable Alignment**: Select tools that produce the specific outputs and formats required

### 2. Sequential Workflow Optimization
- **Logical Progression**: Order tool usage in logical sequences that build context and enable effective work
- **Parallel Opportunities**: Identify tools that can be used simultaneously for efficiency gains
- **Verification Points**: Plan validation and quality checking at appropriate workflow stages
- **Iterative Refinement**: Design workflows that support iteration and continuous improvement

### 3. Integration and Synergy Focus
- **Tool Complementarity**: Combine tools that complement each other's strengths and compensate for limitations
- **Data Flow Optimization**: Design workflows where tool outputs become effective inputs for subsequent tools
- **Context Persistence**: Use memory tools to maintain context and knowledge across complex workflows
- **Quality Amplification**: Sequence tools to progressively improve quality and accuracy of outputs

### 4. Efficiency and Resource Management
- **Minimal Tool Overhead**: Avoid unnecessary tool usage that doesn't add value to workflow outcomes
- **Context Reuse**: Leverage previously gathered context to minimize redundant information gathering
- **Error Prevention**: Select tools and sequences that reduce likelihood of errors and quality issues
- **Scalable Patterns**: Design tool usage patterns that scale effectively for larger and more complex tasks

## Implementation Guidelines

### For Information Gathering Tasks
- Start with semantic search for existing knowledge and patterns within current context
- Use file search and directory listing to understand project structure and available resources
- Apply focused reading tools for deep analysis of specific files and documentation
- Integrate web research for external information and best practices validation

### For Content Creation Tasks
- Begin with research phase using search and analysis tools to gather requirements and patterns
- Use creation tools with appropriate templates and standards for consistency and quality
- Apply testing and validation tools to ensure created content meets requirements and standards
- Document creation decisions and rationale using memory tools for future reference

### For Analysis and Problem-Solving Tasks
- Use sequential thinking tools for complex problem decomposition and analysis
- Apply multiple search and reading tools to build comprehensive understanding of problem context
- Integrate analysis tools with testing and validation tools for comprehensive problem resolution
- Document analysis findings and solutions using memory and file creation tools

## Available Tools Reference

### Core Development Tools
- **`create_file`**: Create new files with specified content and directory structure
- **`replace_string_in_file`**: Edit existing files by replacing specific text with new content
- **`read_file`**: Read file contents with specified line ranges for analysis
- **`list_dir`**: List directory contents to understand project structure
- **`file_search`**: Search for files using glob patterns across the workspace

### Information Gathering Tools
- **`semantic_search`**: Natural language search across workspace for relevant code and documentation
- **`grep_search`**: Fast text search with regex support for finding specific patterns
- **`fetch_webpage`**: Retrieve and analyze content from web URLs for research
- **`get_search_view_results`**: Access VS Code search view results for context

### Analysis and Debugging Tools
- **`get_errors`**: Retrieve compile and lint errors for code quality validation
- **`run_in_terminal`**: Execute shell commands for testing, building, and validation
- **`get_terminal_output`**: Retrieve output from previously executed terminal commands
- **`get_changed_files`**: Get git diff information for changed files in repository

### MCP Task Management Tools
- **`mcp_tasklist_create_list`**: Create organized task lists for project management
- **`mcp_tasklist_create_task`**: Add individual tasks with metadata and priorities
- **`mcp_tasklist_update_task`**: Modify task status, priority, and details
- **`mcp_tasklist_list_tasks`**: View and filter task collections with pagination
- **`mcp_tasklist_move_task`**: Reorganize tasks between different lists

### MCP Memory and Knowledge Tools
- **`mcp_memory_create_entities`**: Create knowledge entities for persistent information storage
- **`mcp_memory_add_observations`**: Add observations to existing entities for knowledge building
- **`mcp_memory_search_nodes`**: Search knowledge graph for relevant information
- **`mcp_memory_read_graph`**: Read entire knowledge graph for comprehensive understanding
- **`mcp_memory_open_nodes`**: Access specific knowledge nodes by name

### MCP Analysis Tools
- **`mcp_sequentialthi_sequentialthinking`**: Complex problem decomposition and multi-step reasoning
- **`mcp_fetch_fetch`**: Advanced web content retrieval with markdown extraction

### MCP GitHub Integration Tools
- **`mcp_github_get_file_contents`**: Retrieve files from GitHub repositories
- **`mcp_github_create_pull_request`**: Create pull requests with automated workflows
- **`mcp_github_list_pull_requests`**: List and filter pull requests
- **`mcp_github_get_pull_request`**: Get detailed pull request information
- **`mcp_github_create_or_update_file`**: Create or update files in GitHub repositories
- **`mcp_github_search_repositories`**: Search GitHub for relevant repositories and code

### MCP Browser Automation and Testing Tools (Playwright)
- **`mcp_playwright_browser_navigate`**: Navigate to URLs for web application testing and automation
- **`mcp_playwright_browser_snapshot`**: Capture accessibility snapshots of web pages for analysis
- **`mcp_playwright_browser_click`**: Perform click interactions on web page elements
- **`mcp_playwright_browser_type`**: Type text into input fields and editable elements
- **`mcp_playwright_browser_hover`**: Hover over elements to trigger hover states and interactions
- **`mcp_playwright_browser_select_option`**: Select options from dropdown menus and select elements
- **`mcp_playwright_browser_press_key`**: Press keyboard keys for navigation and interaction
- **`mcp_playwright_browser_wait_for`**: Wait for specific conditions, text, or time intervals
- **`mcp_playwright_browser_evaluate`**: Execute JavaScript code within the browser context
- **`mcp_playwright_browser_take_screenshot`**: Capture visual screenshots of pages or elements
- **`mcp_playwright_browser_drag`**: Perform drag and drop operations between elements
- **`mcp_playwright_browser_file_upload`**: Upload files through file input elements
- **`mcp_playwright_browser_handle_dialog`**: Handle browser dialogs, alerts, and prompts
- **`mcp_playwright_browser_tab_new`**: Open new browser tabs for multi-tab workflows
- **`mcp_playwright_browser_tab_close`**: Close browser tabs to manage tab lifecycle
- **`mcp_playwright_browser_tab_list`**: List all open tabs for tab management
- **`mcp_playwright_browser_tab_select`**: Switch between different browser tabs
- **`mcp_playwright_browser_navigate_back`**: Navigate to previous page in browser history
- **`mcp_playwright_browser_navigate_forward`**: Navigate to next page in browser history
- **`mcp_playwright_browser_resize`**: Resize browser window for responsive testing
- **`mcp_playwright_browser_network_requests`**: Monitor network requests for performance analysis
- **`mcp_playwright_browser_console_messages`**: Retrieve browser console messages for debugging
- **`mcp_playwright_browser_install`**: Install browser binaries when needed for automation
- **`mcp_playwright_browser_close`**: Close browser instances to clean up resources

### Specialized Development Tools
- **`create_new_workspace`**: Generate new project structures and configurations  
- **`create_new_jupyter_notebook`**: Create interactive Jupyter notebooks for data analysis
- **`test_search`**: Find test files associated with source code files
- **`list_code_usages`**: Find references and usages of functions, classes, and variables
- **`install_extension`**: Install VS Code extensions for enhanced development capabilities

## MCP Tool Integration

### Strategic Tool Selection Patterns

```bash
# Information gathering workflow
semantic_search --query "authentication implementation patterns security"
file_search --query "**/*auth*.{js,ts}" # Find existing auth code
read_file --filePath "/src/auth/AuthService.js" --startLine 1 --endLine 50
fetch_webpage --urls "https://auth0.com/docs/security" --query "authentication security best practices"

# Content creation workflow
create_file --filePath "/docs/auth-architecture.md" --content "# Authentication Architecture Specification"
mcp_memory_create_entities --entities '[{"name": "AuthDecisions", "entityType": "TechnicalKnowledge"}]'
run_in_terminal --command "npm run validate:docs" --explanation "Validate documentation quality"

# Problem-solving workflow
mcp_sequentialthi_sequentialthinking --thought "Analyzing authentication performance issues: database queries, token validation, session management"
get_errors --filePaths ["/src/auth/AuthController.js"]
replace_string_in_file --filePath "/src/auth/AuthController.js" --oldString "// optimization needed" --newString "// optimized implementation"

# Web application testing workflow
mcp_playwright_browser_navigate --url "https://localhost:3000/login"
mcp_playwright_browser_snapshot # Capture page state for analysis
mcp_playwright_browser_type --element "email input" --ref "#email" --text "test@example.com"
mcp_playwright_browser_type --element "password input" --ref "#password" --text "testpassword"
mcp_playwright_browser_click --element "login button" --ref "#login-btn"
mcp_playwright_browser_wait_for --text "Welcome"
mcp_playwright_browser_take_screenshot --filename "login-success.png"
```

### Tool Combination Strategies

**Research and Analysis Combination**:
```bash
# Comprehensive understanding workflow
semantic_search --query "microservices communication patterns"
grep_search --query "api|service|endpoint" --includePattern "src/**/*.js" --isRegexp true
read_file --filePath "/docs/architecture.md" --startLine 1 --endLine 100
mcp_memory_add_observations --observations '[{"entityName": "ArchitectureKnowledge", "contents": ["Current system uses REST APIs with synchronous communication"]}]'
```

**Implementation and Validation Combination**:
```bash
# Quality-focused development workflow
create_file --filePath "/src/services/PaymentService.js" --content "// Payment processing service implementation"
run_in_terminal --command "npm test PaymentService" --explanation "Execute payment service tests"
get_errors --filePaths ["/src/services/PaymentService.js"]
replace_string_in_file --filePath "/src/services/PaymentService.js" --oldString "// TODO: implement validation" --newString "// comprehensive validation implemented"
```

**End-to-End Testing and Validation Combination**:
```bash
# Comprehensive web application testing workflow
mcp_playwright_browser_navigate --url "https://staging.example.com"
mcp_playwright_browser_take_screenshot --filename "initial-state.png" --fullPage true
mcp_playwright_browser_click --element "navigation menu" --ref "[data-testid='nav-menu']"
mcp_playwright_browser_hover --element "dropdown item" --ref "[data-testid='dropdown-item']"
mcp_playwright_browser_console_messages # Check for JavaScript errors
mcp_playwright_browser_network_requests # Monitor API calls and performance
```

## Examples

### Example 1: Feature Research and Implementation
```bash
# Research phase - understand requirements and patterns
semantic_search --query "user profile management CRUD operations validation"
file_search --query "**/user*.{js,jsx,ts,tsx}" 
read_file --filePath "/src/components/UserProfile.jsx" --startLine 1 --endLine 50

# Implementation phase - create feature components
create_file --filePath "/src/features/profile/ProfileManager.js" --content "// User profile management functionality"
create_file --filePath "/src/features/profile/ProfileForm.jsx" --content "// Profile editing form component"

# Validation phase - test and refine
run_in_terminal --command "npm test ProfileManager" --explanation "Test profile management functionality"
get_errors --filePaths ["/src/features/profile/ProfileManager.js"]
```

### Example 2: Bug Investigation and Resolution
```bash
# Investigation phase - understand the problem
get_errors --filePaths ["/src/api/UserController.js"]
grep_search --query "error|exception|catch" --includePattern "src/api/**/*.js" --isRegexp true
semantic_search --query "user controller error handling database connection"

# Analysis phase - deep dive into issues
mcp_sequentialthi_sequentialthinking --thought "Analyzing user controller errors: database connections, validation logic, error handling patterns"
read_file --filePath "/src/api/UserController.js" --startLine 45 --endLine 80

# Resolution phase - implement fixes
replace_string_in_file --filePath "/src/api/UserController.js" --oldString "catch (error) {\n  console.log(error);" --newString "catch (error) {\n  logger.error('User operation failed:', error);\n  return res.status(500).json({ error: 'Internal server error' });"
run_in_terminal --command "npm test UserController" --explanation "Validate error handling fixes"
```

### Example 3: Architecture Analysis and Documentation
```bash
# Analysis phase - understand current architecture
list_dir --path "/src"
semantic_search --query "architecture patterns component structure"
grep_search --query "import|require|from" --includePattern "src/**/*.js" --isRegexp true

# Documentation phase - capture architectural knowledge
mcp_memory_create_entities --entities '[{"name": "SystemArchitecture", "entityType": "TechnicalDocumentation"}]'
create_file --filePath "/docs/system-architecture.md" --content "# Current System Architecture Analysis"
mcp_memory_add_observations --observations '[{"entityName": "SystemArchitecture", "contents": ["Modular architecture with feature-based organization"]}]'
```

### Example 4: End-to-End Web Application Testing
```bash
# Setup phase - prepare testing environment
mcp_playwright_browser_install # Ensure browser is available
mcp_playwright_browser_navigate --url "https://localhost:3000"
mcp_playwright_browser_resize --width 1920 --height 1080

# User flow testing - simulate complete user journey
mcp_playwright_browser_snapshot # Capture initial state
mcp_playwright_browser_click --element "sign up button" --ref "[data-testid='signup-btn']"
mcp_playwright_browser_type --element "email field" --ref "#email" --text "newuser@test.com"
mcp_playwright_browser_type --element "password field" --ref "#password" --text "SecurePass123"
mcp_playwright_browser_click --element "submit button" --ref "[type='submit']"
mcp_playwright_browser_wait_for --text "Welcome to your dashboard"

# Validation phase - verify functionality and capture results
mcp_playwright_browser_take_screenshot --filename "user-dashboard.png"
mcp_playwright_browser_console_messages # Check for errors
mcp_playwright_browser_network_requests # Analyze API calls
create_file --filePath "/test-results/signup-flow-results.md" --content "# Sign-up Flow Test Results"
```

## Quality Standards

### Tool Selection Quality
- **Appropriate Matching**: Tools selected based on task requirements and capability alignment
- **Efficient Sequencing**: Tool usage ordered logically to build context and enable effective work
- **Resource Optimization**: Minimal tool overhead with maximum value delivery for workflow objectives
- **Integration Effectiveness**: Tools work together synergistically rather than in isolation

### Workflow Quality Standards
- **Context Building**: Systematic approach to gathering and maintaining necessary context throughout workflow
- **Validation Integration**: Quality checking and verification integrated at appropriate workflow stages
- **Documentation Excellence**: Key decisions and findings captured for future reference and team collaboration
- **Iterative Improvement**: Workflows designed to support refinement and continuous quality enhancement

## Common Patterns

### Effective Tool Sequences
- **Discovery Pattern**: Search → Read → Analyze → Document for understanding existing systems
- **Implementation Pattern**: Research → Create → Test → Refine for building new functionality
- **Problem-Solving Pattern**: Identify → Analyze → Solve → Validate for resolving issues
- **Integration Pattern**: Understand → Plan → Implement → Verify for system integration work
- **Web Testing Pattern**: Navigate → Snapshot → Interact → Validate → Document for comprehensive web application testing

### Advanced Optimization Techniques
- **Context Reuse**: Leverage previously gathered information to minimize redundant tool usage
- **Parallel Processing**: Use multiple tools simultaneously when tasks are independent
- **Quality Cascading**: Design workflows where each tool improves quality of subsequent tool inputs
- **Error Prevention**: Sequence tools to catch and prevent issues before they compound
- **Visual Validation**: Combine browser automation with screenshot capture for comprehensive UI testing

## Common Pitfalls and Solutions

### Pitfall: Tool Overuse
**Problem**: Using too many tools without clear value addition to workflow outcomes
**Solution**: Focus on essential tools that directly contribute to task objectives; avoid tool usage for its own sake

### Pitfall: Poor Context Building
**Problem**: Not gathering sufficient context before using creation or modification tools
**Solution**: Start with research and analysis tools; build comprehensive understanding before implementation

### Pitfall: Inadequate Validation
**Problem**: Not using testing and verification tools to ensure quality and correctness
**Solution**: Integrate validation tools at multiple workflow stages; don't assume correctness without verification

### Pitfall: Sequential Inefficiency
**Problem**: Using tools in suboptimal order that requires redundant work or context rebuilding
**Solution**: Plan tool sequences that build logically; leverage outputs of early tools as inputs for later tools

## Related Prompts
- **[MCP Tools Overview](mcp-tools-overview.prompts.md)**: Comprehensive guide to individual MCP tool capabilities and usage patterns
- **[Best Practices](best-practices.prompts.md)**: General AI collaboration principles that inform effective tool selection
- **[Task List Integration](task-list-integration.prompts.md)**: Use task management to organize and track complex tool workflows
- **[Lean AI Collaboration](lean-ai-collaboration.prompts.md)**: Apply lean principles to eliminate waste in tool usage and workflow design

## Best Practices

### Do's
- Start with task analysis to understand requirements before selecting tools
- Build comprehensive context using search and analysis tools before creating or modifying content
- Use validation and testing tools to ensure quality and correctness throughout workflows
- Plan tool sequences that build logically and leverage previous tool outputs effectively
- Document important findings and decisions using memory tools for future reference

### Don'ts
- Don't use tools without clear understanding of how they contribute to task objectives
- Avoid starting with creation tools before gathering sufficient context and requirements
- Don't skip validation and quality checking steps in favor of speed
- Avoid inefficient tool sequences that require redundant work or context rebuilding
- Don't work in isolation without leveraging collaborative features of memory and documentation tools

## Verification Checklist

- [ ] Task requirements analyzed with appropriate tool capabilities identified
- [ ] Context gathering completed using search and analysis tools before implementation
- [ ] Tool sequence planned to build logically with minimal redundancy and maximum efficiency
- [ ] Validation and quality checking integrated at appropriate workflow stages
- [ ] Documentation and knowledge capture planned for important findings and decisions
- [ ] Integration opportunities identified for tools that complement each other effectively
- [ ] Efficiency optimization applied to minimize tool overhead while maximizing value delivery
- [ ] Error prevention strategies incorporated through appropriate tool selection and sequencing
