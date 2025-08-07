# Research and Investigation Workflows

## Purpose

This prompt provides systematic AI collaboration guidance for information gathering, analysis, and insight generation across software engineering and game development projects. Combines research methodology expertise with AI tool integration to produce comprehensive, actionable insights through structured investigation workflows.

Focus areas include research planning, information source evaluation, data synthesis, validation strategies, and knowledge capture using volatility-based approaches to match research depth with project requirements and timeline constraints.

## Core Principles

### 1. Research Strategy Alignment
- Match research depth and methodology to project volatility and requirements
- Define clear research objectives with measurable success criteria
- Use systematic approaches while maintaining flexibility for emerging insights
- Balance comprehensive coverage with practical time and resource constraints

### 2. Information Quality Validation
- Apply multi-source verification for all critical research findings
- Use authoritative sources and cross-reference validation for accuracy
- Implement systematic bias detection and mitigation strategies
- Document source credibility and information currency for ongoing validation

### 3. Structured Analysis Integration
- Use systematic analysis frameworks to organize and synthesize findings
- Apply iterative refinement to improve research quality and relevance
- Integrate expert validation and peer review for critical research outcomes
- Create actionable insights that directly support project decision-making

### 4. Knowledge Capture and Persistence
- Document research methodology and findings for future reference and reuse
- Create searchable knowledge repositories for team access and collaboration
- Implement version control for research artifacts and evolving insights
- Establish knowledge sharing patterns to maximize research value across projects

## Implementation Guidelines

### For Research Planning
- Define research scope, objectives, and success criteria before beginning investigation
- Select appropriate research methodology based on project volatility and requirements
- Identify key information sources and validation strategies upfront
- Plan for iterative refinement and scope adjustment based on emerging findings

### For Information Gathering
- Use systematic source identification and evaluation criteria for credibility assessment
- Apply diverse search strategies to ensure comprehensive coverage of relevant information
- Implement parallel investigation streams for efficiency and cross-validation
- Document source metadata and evaluation criteria for transparency and reproducibility

### For Analysis and Synthesis
- Apply structured analysis frameworks to organize and interpret research findings
- Use comparative analysis to identify patterns, trends, and critical insights
- Implement systematic validation of conclusions against source evidence
- Create clear, actionable recommendations based on research findings

## MCP Tool Integration

### Research Workflow Implementation

```bash
# Research planning and organization
mcp_memory_create_entities --entities '[{
  "name": "ResearchProject",
  "entityType": "Investigation",
  "observations": ["scope defined", "sources identified", "methodology selected"]
}]'

# Complex analysis and synthesis
mcp_sequentialthi_sequentialthinking --thought "Analyzing research findings to identify patterns and actionable insights"

# Information gathering and validation
semantic_search --query "software architecture patterns microservices"
fetch_webpage --urls ["https://example.com/research-source"] --query "specific technical details"
```

### Knowledge Management Patterns

**Research Organization**:
- Use `mcp_memory_create_entities` to track research projects, sources, and key findings
- Apply `mcp_memory_create_relations` to map relationships between research areas and insights
- Use `semantic_search` to find relevant existing research within project documentation

**Validation and Analysis**:
- Use `mcp_sequentialthi_sequentialthinking` for complex research analysis and synthesis
- Apply `fetch_webpage` for authoritative source validation and current information gathering
- Use `github_repo` search for technical implementation patterns and best practices research

## Examples

### Example 1: Technology Research for Architecture Decision
```
User: "Research microservices architecture patterns for our e-commerce platform"
AI Response: Defining research scope for microservices analysis...
[Uses semantic_search to check existing project documentation]
[Applies fetch_webpage to gather current industry best practices]
[Uses sequential thinking to analyze trade-offs and recommendations]
```

### Example 2: Competitive Analysis Research
```
User: "Investigate competitor game monetization strategies"
AI Response: Establishing systematic competitive analysis framework...
[Uses memory tools to track competitor profiles and strategies]
[Applies structured analysis to identify patterns and opportunities]
[Creates actionable insights for product strategy decisions]
```

### Example 3: Technical Feasibility Investigation
```
User: "Research real-time multiplayer implementation options"
AI Response: Planning comprehensive technical feasibility study...
[Uses github_repo search for implementation examples and patterns]
[Applies multi-source validation for performance and scalability data]
[Creates detailed technical assessment with recommendations]
```

## Quality Standards

### Research Effectiveness Metrics
- **Source Quality**: Credibility and authority assessment for all research sources
- **Coverage Completeness**: Systematic evaluation of research scope and thoroughness
- **Insight Actionability**: Practical utility of research findings for project decisions
- **Validation Rigor**: Multi-source verification and cross-reference accuracy checking

### Analysis Quality Validation
- **Methodology Consistency**: Systematic application of research methods and frameworks
- **Bias Identification**: Active detection and mitigation of research and confirmation bias
- **Conclusion Support**: Strong evidence chains linking findings to recommendations
- **Reproducibility**: Clear documentation enabling research validation and extension

## Common Patterns

### Effective Research Strategies
- **Layered Investigation**: Start with broad overview, progressively narrow focus to specific needs
- **Parallel Source Validation**: Use multiple independent sources for critical information validation
- **Iterative Refinement**: Adjust research scope and methodology based on emerging findings
- **Expert Integration**: Incorporate domain expert input for complex technical assessments

### Knowledge Synthesis Approaches
- **Comparative Analysis**: Systematically compare options, approaches, and trade-offs
- **Pattern Recognition**: Identify recurring themes and insights across diverse information sources
- **Gap Analysis**: Explicitly identify information gaps and areas requiring additional investigation
- **Decision Support Focus**: Frame research findings to directly support project decision-making needs

## Common Pitfalls and Solutions

### Pitfall: Research Scope Creep
**Problem**: Research expanding beyond original objectives without clear value justification
**Solution**: Define clear research boundaries and success criteria; regularly evaluate scope against project needs

### Pitfall: Source Quality Neglect
**Problem**: Accepting information without adequate credibility and currency validation
**Solution**: Implement systematic source evaluation criteria and multi-source verification requirements

### Pitfall: Analysis Paralysis
**Problem**: Continuing research indefinitely without reaching actionable conclusions
**Solution**: Set research time boundaries and decision deadlines; focus on minimum viable insights for decisions

### Pitfall: Knowledge Isolation
**Problem**: Research findings not effectively captured or shared for team benefit
**Solution**: Use structured knowledge capture and sharing systems; create searchable research repositories

## Related Prompts
- **[Architecture Design](architecture-design.prompts.md)**: Apply research insights to technical architecture decisions and system design
- **[Feature Development](feature-development.prompts.md)**: Use research findings to inform feature requirements and implementation strategies
- **[AI Accuracy Verification](ai-accuracy-verification.prompts.md)**: Apply verification methods to ensure research accuracy and reliability
- **[Best Practices](best-practices.prompts.md)**: Use research best practices for effective AI collaboration and information validation

## Best Practices

### Do's
- Define clear research objectives and success criteria before beginning investigation
- Use systematic source evaluation and multi-source validation for critical findings
- Apply appropriate research methodology based on project volatility and timeline constraints
- Document research methodology and findings for reproducibility and team knowledge sharing
- Create actionable insights that directly support project decision-making requirements

### Don'ts
- Don't continue research indefinitely without clear decision deadlines and scope boundaries
- Avoid relying on single sources for critical information without cross-validation
- Don't ignore source credibility and currency evaluation in pursuit of quick answers
- Avoid research isolation by failing to capture and share findings with relevant team members
- Don't let research become an end in itself rather than supporting practical project needs

## Verification Checklist

- [ ] Research objectives clearly defined with measurable success criteria
- [ ] Appropriate research methodology selected based on project requirements and constraints
- [ ] Source evaluation criteria established and systematically applied
- [ ] Multi-source validation implemented for all critical research findings
- [ ] Analysis framework structured to support actionable insight generation
- [ ] Knowledge capture and sharing systems implemented for team benefit
- [ ] Research timeline and scope boundaries defined to prevent scope creep
- [ ] Verification and validation methods integrated throughout research process
