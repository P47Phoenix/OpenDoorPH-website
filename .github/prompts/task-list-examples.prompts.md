# MCP Task List Examples and Templates

## Purpose

This prompt provides comprehensive MCP task list examples and templates for common development workflows, project scenarios, and collaboration patterns. Demonstrates effective task organization, dependency management, and integration with other MCP tools to optimize project workflow efficiency and team coordination.

Focus areas include software development workflows, project management patterns, research coordination, game development tasks, and advanced task management techniques for complex multi-phase projects.

## Core Principles

### 1. Task Granularity Optimization
- Break complex work into manageable 1-4 hour tasks for better tracking and completion
- Use descriptive titles that clearly communicate action, target, and context
- Provide complete context and acceptance criteria within task descriptions
- Estimate realistically based on similar past tasks and developer experience

### 2. Workflow Organization Excellence
- Organize tasks into logical lists that reflect project structure and team responsibilities
- Plan task dependencies and prerequisites to enable efficient parallel work streams
- Use priority levels to reflect business value and urgency considerations
- Implement consistent naming conventions and status tracking across all projects

### 3. Integration Pattern Consistency
- Link tasks with memory tools for knowledge persistence and decision tracking
- Connect task workflows with sequential thinking for complex problem decomposition
- Use task status and progress to inform broader project coordination and reporting
- Integrate task management with external tools and team communication patterns

### 4. Continuous Improvement Focus
- Track task completion metrics to improve estimation accuracy and workflow efficiency
- Use retrospective analysis to refine task breakdown and organization patterns
- Document successful workflows as reusable templates for future projects
- Adapt task management patterns based on team feedback and project outcomes

## Implementation Guidelines

### For Feature Development
- Start with requirements and design tasks before implementation work
- Separate backend, frontend, and integration tasks for parallel development
- Include comprehensive testing and documentation tasks in all workflows
- Plan deployment and monitoring tasks as integral parts of feature completion

### For Project Management
- Create project initialization workflows that establish foundation for all subsequent work
- Use milestone-based task organization for large projects with multiple phases
- Implement release planning workflows that coordinate feature delivery and deployment
- Plan post-release monitoring and support tasks as part of delivery workflow

### For Research and Analysis
- Structure investigation tasks with clear research questions and validation criteria
- Include proof-of-concept development tasks to validate research findings
- Plan recommendation and documentation tasks to capture research outcomes
- Link research tasks to subsequent implementation or decision-making activities

## MCP Tool Integration

### Essential Task Management Patterns

```bash
# Feature development workflow
mcp_tasklist_create_list --name "User Profile Feature" --description "Complete profile functionality"

# Task creation with full context
mcp_tasklist_create_task --title "Implement Profile API Endpoints" --description "Create REST endpoints: GET/PUT /api/profile with validation" --listId 1 --priority 4 --estimatedHours 5

# Task progress tracking
mcp_tasklist_update_task --id 1 --status "InProgress" --description "Updated with API validation requirements"

# Task completion and metrics
mcp_tasklist_update_task --id 1 --status "Completed"
```

### Integration with Other MCP Tools

**Knowledge Capture Integration**:
```bash
# Link tasks to research findings
mcp_memory_create_entities --entities '[{"name": "FeatureRequirements", "entityType": "ProjectKnowledge"}]'
mcp_tasklist_create_task --title "Document Architecture Decision" --description "Based on research findings in memory entity FeatureRequirements"
```

**Complex Problem Decomposition**:
```bash
# Use sequential thinking for task planning
mcp_sequentialthi_sequentialthinking --thought "Breaking down authentication feature into manageable development tasks"
# Then create tasks based on analysis results
```

## Examples

### Example 1: Feature Development Workflow
```bash
# Complete user authentication feature workflow
mcp_tasklist_create_list --name "Authentication Feature" --description "Secure user login/logout with JWT"

# Planning tasks
mcp_tasklist_create_task --title "Design Authentication Requirements" --description "Define security requirements, user flows, and acceptance criteria" --priority 5 --estimatedHours 3

# Implementation tasks  
mcp_tasklist_create_task --title "Implement JWT Authentication API" --description "Create login/logout endpoints with secure token generation" --priority 4 --estimatedHours 6

# Testing and deployment
mcp_tasklist_create_task --title "Create Authentication Tests" --description "Unit and integration tests for security validation" --priority 3 --estimatedHours 4
```

### Example 2: Bug Resolution Workflow
```bash
# Systematic bug investigation and resolution
mcp_tasklist_create_list --name "Memory Leak Bug Fix" --description "Resolve authentication memory leak issue"

# Investigation phase
mcp_tasklist_create_task --title "Reproduce Memory Leak" --description "Set up test environment and consistently reproduce the issue" --priority 5 --estimatedHours 2

# Resolution phase
mcp_tasklist_create_task --title "Implement Memory Leak Fix" --description "Apply fix based on profiling analysis findings" --priority 4 --estimatedHours 2
```

### Example 3: Research Project Workflow
```bash
# Technology evaluation and recommendation
mcp_tasklist_create_list --name "GraphQL Evaluation" --description "Assess GraphQL adoption for API modernization"

# Research tasks
mcp_tasklist_create_task --title "Research GraphQL Benefits" --description "Compare GraphQL vs REST for our use cases" --priority 4 --estimatedHours 4

# Validation tasks
mcp_tasklist_create_task --title "Build GraphQL Prototype" --description "Create proof-of-concept with core user schema" --priority 3 --estimatedHours 8
```

## Quality Standards

### Task Definition Quality
- **Clarity**: Task titles and descriptions provide unambiguous direction for execution
- **Completeness**: All necessary context and acceptance criteria included in task definition
- **Actionability**: Tasks specify concrete deliverables and clear completion criteria
- **Realistic Scope**: Task estimates align with typical developer productivity and complexity

### Workflow Organization Quality
- **Logical Structure**: Task lists and dependencies reflect optimal work sequence and team coordination
- **Parallel Optimization**: Independent tasks identified for concurrent development when beneficial
- **Milestone Alignment**: Task organization supports clear project milestones and delivery targets
- **Team Coordination**: Task assignment and dependencies facilitate effective team collaboration

## Common Patterns

### Effective Task Breakdown Strategies
- **Sequential Dependencies**: Plan prerequisite relationships that enable optimal work flow
- **Parallel Development Tracks**: Organize independent work streams for frontend, backend, and DevOps
- **Iterative Development Cycles**: Structure tasks in time-boxed sprints with clear deliverables
- **Cross-Functional Integration**: Plan integration tasks that bring together different development streams

### Advanced Organization Techniques
- **Priority Matrix Application**: Use business value and urgency to guide task prioritization decisions
- **Estimation Improvement**: Track actual vs estimated hours to refine future task planning accuracy
- **Template Reuse**: Develop standardized task templates for recurring project patterns
- **Metrics Integration**: Use task completion data to improve team productivity and workflow optimization

## Common Pitfalls and Solutions

### Pitfall: Over-Granular Task Breakdown
**Problem**: Creating tasks so small they create management overhead without adding value
**Solution**: Target 1-4 hour tasks; combine very small related activities into single actionable tasks

### Pitfall: Insufficient Task Context
**Problem**: Task descriptions lack necessary information for effective execution
**Solution**: Include acceptance criteria, technical constraints, and dependencies in all task descriptions

### Pitfall: Unrealistic Time Estimation
**Problem**: Consistently under or over-estimating task complexity and duration
**Solution**: Track actual vs estimated time; use historical data to improve estimation accuracy

### Pitfall: Dependency Management Neglect
**Problem**: Not identifying or planning for task dependencies leading to workflow bottlenecks
**Solution**: Explicitly map task dependencies; plan work sequences that minimize blocking relationships

## Related Prompts
- **[Task List Integration](task-list-integration.prompts.md)**: Advanced integration patterns for MCP task management with project workflows
- **[Best Practices](best-practices.prompts.md)**: General AI collaboration principles that enhance task management effectiveness
- **[Lean AI Collaboration](lean-ai-collaboration.prompts.md)**: Apply lean principles to optimize task workflow efficiency
- **[Feature Development](feature-development.prompts.md)**: Apply task management patterns to systematic feature development workflows

## Best Practices

### Do's
- Create tasks with clear, actionable titles that specify what will be accomplished
- Include comprehensive context and acceptance criteria in all task descriptions
- Plan task dependencies and sequences to enable efficient parallel development
- Use consistent priority levels and estimation approaches across all projects
- Track task completion metrics to continuously improve workflow efficiency

### Don'ts
- Don't create tasks without clear completion criteria and acceptance definitions
- Avoid overly complex task hierarchies that create management overhead
- Don't ignore task dependencies when planning work sequences and team coordination
- Avoid unrealistic time estimates that undermine project planning and team coordination
- Don't neglect to update task status and progress for effective team communication

## Verification Checklist

- [ ] Task definitions include clear titles, complete context, and acceptance criteria
- [ ] Task estimates are realistic and based on historical data or similar work complexity
- [ ] Task dependencies identified and planned to enable efficient work flow
- [ ] Task organization supports project milestones and team coordination requirements
- [ ] Integration with other MCP tools planned for knowledge capture and analysis
- [ ] Task templates documented for reuse across similar project workflows
- [ ] Quality standards established for task definition and workflow organization
- [ ] Metrics tracking implemented for continuous workflow improvement and optimization
