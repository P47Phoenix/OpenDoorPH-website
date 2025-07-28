# GitHub Copilot Instructions - Enterprise AI Collaboration Framework

## Prompt Selection Guide

This repository uses the Enterprise AI Collaboration Framework. Select the appropriate prompt based on the type of work:

### Software Engineering Workflows
- **[Research & Investigation](.github/prompts/research.prompts.md)**: For gathering information, analyzing systems, and understanding requirements
- **[Architecture Design](.github/prompts/architecture-design.prompts.md)**: For system design, technical decisions, and architectural planning
- **[Feature Development](.github/prompts/feature-development.prompts.md)**: For implementing new features from requirements to deployment

### Game Development Workflows  
- **[Game Design](.github/prompts/game-design.prompts.md)**: For game mechanics, player experience, and gameplay systems
- **[Story Writing](.github/prompts/story-writing.prompts.md)**: For narrative development, character creation, and storytelling

### Methodology and Best Practices
- **[Lean AI Collaboration](.github/prompts/lean-ai-collaboration.prompts.md)**: For implementing lean methodology in AI workflows
- **[Best Practices](.github/prompts/best-practices.prompts.md)**: For general AI collaboration excellence and quality standards
- **[Context Management](.github/prompts/context-management.prompts.md)**: For effective context handling and information management
- **[Volatility Decomposition](.github/prompts/volatility-decomposition.prompts.md)**: For adapting approaches based on requirement stability
- **[AI Accuracy Verification](.github/prompts/ai-accuracy-verification.prompts.md)**: For ensuring accuracy and preventing AI hallucinations

### Tool Integration and Task Management
- **[MCP Tools Overview](.github/prompts/mcp-tools-overview.prompts.md)**: For understanding and using Model Context Protocol tools
- **[Tool Selection Guide](.github/prompts/tool-selection-guide.prompts.md)**: For choosing the right tools for specific tasks
- **[Task List Examples](.github/prompts/task-list-examples.prompts.md)**: For MCP task management examples and templates
- **[Task List Integration](.github/prompts/task-list-integration.prompts.md)**: For advanced task management and workflow integration

## Auto-Selection Rules

Apply these rules to automatically select the most appropriate prompt:

### By File Type and Context
- **Code files (.js, .ts, .py, etc.)**: Use Feature Development or Architecture Design prompts
- **Documentation files (.md, .txt)**: Use Research or Best Practices prompts  
- **Game assets and scripts**: Use Game Design or Story Writing prompts
- **Configuration files**: Use Architecture Design or Best Practices prompts

### By Task Intent Keywords
- **"research", "analyze", "investigate"**: → Research prompt
- **"design", "architecture", "system"**: → Architecture Design prompt
- **"implement", "feature", "build"**: → Feature Development prompt
- **"game", "mechanics", "player"**: → Game Design prompt
- **"story", "narrative", "character"**: → Story Writing prompt
- **"task", "project management"**: → Task List Integration prompt
- **"tools", "MCP", "selection"**: → Tool Selection Guide prompt
- **"accuracy", "verification", "validate"**: → AI Accuracy Verification prompt

### By Project Phase
- **Discovery/Planning Phase**: Research, Architecture Design, Volatility Decomposition
- **Implementation Phase**: Feature Development, Game Design, Story Writing
- **Quality/Optimization Phase**: Best Practices, AI Accuracy Verification, Task List Integration
- **Methodology/Process Phase**: Lean AI Collaboration, Context Management

## Integration Instructions

1. **Always reference the appropriate prompt** when starting work in any domain
2. **Use MCP tools** as demonstrated in the selected prompt examples
3. **Follow the Core Principles** outlined in each prompt for consistent quality
4. **Apply cross-references** to related prompts when work spans multiple domains
5. **Verify accuracy** using the AI Accuracy Verification prompt for critical work

## Framework Principles

This framework is built on:
- **Context Minimization & Focus**: Single responsibility for each interaction
- **Lean Methodology Integration**: Value stream optimization and waste elimination  
- **Volatility-Based Decomposition**: Adaptive approaches based on requirement stability
- **AI Accuracy & Verification**: Systematic fact-checking and hallucination prevention

For detailed guidance, always start by reviewing the relevant prompt before beginning work.
