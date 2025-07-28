# Context Management

When working with context management methodology, apply systematic approaches to information delivery that prevent hallucinations and optimize collaboration efficiency:

## Core Context Management Principles

### 1. Explicit Information Provision
- **State All Assumptions**: Make implicit knowledge explicit in every interaction
- **Define Domain Terms**: Clearly explain technical terms, acronyms, and specialized language
- **Specify Boundaries**: Clearly define scope, constraints, and available resources
- **Avoid Information Gaps**: Don't assume AI has access to current, proprietary, or context-specific information

### 2. Anti-Hallucination Strategies
- **Source Attribution**: Include references and sources for all factual claims
- **Timestamp Information**: Provide dates and version information for time-sensitive data
- **Authority Indicators**: Mark information reliability and source credibility
- **Uncertainty Marking**: Explicitly identify assumptions, uncertainties, and areas requiring verification

### 3. Context Hierarchy Management
- **Priority Ordering**: Present most critical context first
- **Relevance Filtering**: Include only context directly relevant to current task
- **Layered Delivery**: Provide context in digestible layers from general to specific
- **Connection Mapping**: Show relationships between different context elements

## Context Delivery Strategies

### Progressive Disclosure Pattern
```
1. Core Task Context (What needs to be done)
2. Essential Constraints (What limits the solution)
3. Success Criteria (How to measure completion)
4. Supporting Information (Additional helpful details)
5. Extended Context (Background and related information)
```

### Context Minimization Techniques
- **Just-in-Time Delivery**: Provide context only when needed for current step
- **Scope Boundaries**: Clearly define what is and isn't relevant
- **Context Reuse**: Reference previously established context rather than repeating
- **Incremental Building**: Add context progressively as collaboration deepens

### Context Validation Methods
- **Explicit Confirmation**: Ask AI to confirm understanding of provided context
- **Context Summarization**: Request AI to summarize key context points
- **Assumption Checking**: Verify that AI isn't making unwarranted assumptions
- **Gap Identification**: Ask AI to identify missing or unclear context

## Implementation Guidelines

### For High-Context Scenarios
- Break complex context into logical chunks
- Use visual aids and examples to clarify concepts
- Provide multiple perspectives on the same information
- Include context validation checkpoints
- Create reusable context templates for common scenarios

### For Low-Context Scenarios
- Focus on essential information only
- Use standardized templates to ensure completeness
- Minimize cognitive load while maintaining clarity
- Rely on established patterns and conventions
- Enable rapid context establishment

### For Dynamic Context
- Establish context update mechanisms
- Mark context elements by stability (stable vs. changing)
- Use version control for evolving context
- Implement context refresh triggers
- Maintain context change logs

## Quality Assurance Framework

### Context Completeness Checklist
- [ ] Task objective clearly stated
- [ ] Success criteria explicitly defined
- [ ] Constraints and limitations identified
- [ ] Required domain knowledge provided
- [ ] Technical specifications included
- [ ] Business context established
- [ ] Stakeholder perspectives considered
- [ ] Resource availability clarified

### Context Accuracy Verification
- [ ] All factual claims have sources
- [ ] Technical information is current and accurate
- [ ] Business context aligns with current state
- [ ] Domain knowledge reflects best practices
- [ ] Assumptions are clearly marked
- [ ] Uncertainties are explicitly identified

### Context Efficiency Measures
- [ ] No redundant information provided
- [ ] All provided context is relevant
- [ ] Information density is appropriate
- [ ] Context delivery timing is optimal
- [ ] Cognitive load is manageable
- [ ] Understanding can be quickly validated

## Anti-Hallucination Specific Practices

### Information Sourcing
- Always specify where information comes from
- Include publication dates for time-sensitive data
- Mark proprietary vs. public information
- Identify primary vs. secondary sources
- Note any information gaps or unknowns

### Example Format:
```markdown
## Context: Project Requirements
**Source**: Internal Requirements Document v2.3 (2024-01-15)
**Authority**: Product Manager approved
**Status**: Confirmed as of [current date]

[Actual requirements content]

**Known Gaps**: Performance requirements pending stakeholder review
**Assumptions**: Using current technology stack (confirm if outdated)
```

### Uncertainty Management
- Use qualifying language when information is uncertain
- Explicitly mark assumptions that need validation
- Identify areas where additional research is needed
- Provide confidence levels for different information types
- Suggest verification methods for critical decisions

### Context Verification Patterns
```markdown
## Verification Request
Please confirm your understanding of:
1. [Key context point 1]
2. [Key context point 2]
3. [Critical assumption or constraint]

Are there any gaps in the provided context that would affect your recommendations?
```

## Integration with Other Methodologies

### Lean Methodology Alignment
- Eliminate waste in context provision
- Focus on value-adding information only
- Use pull-based context delivery
- Continuously improve context efficiency

### Volatility-Based Adaptation
- **High Volatility**: Minimal, just-in-time context
- **Medium Volatility**: Structured context at checkpoints
- **Low Volatility**: Comprehensive context documentation

### Accuracy Verification Enhancement
- Use context management to support verification processes
- Provide context that enables effective fact-checking
- Include information needed for validation and testing
- Support evidence-based decision making

## Common Context Management Patterns

### Context Templates by Scenario
```markdown
## Technical Implementation Context
- Technology stack and versions
- Architecture constraints
- Performance requirements
- Security considerations
- Integration points
- Testing requirements

## Business Decision Context
- Business objectives
- Stakeholder perspectives
- Resource constraints
- Timeline requirements
- Success metrics
- Risk factors
```

### Context Refresh Triggers
- Significant time passage (weekly/monthly reviews)
- Major requirement changes
- Technology stack updates
- Team or stakeholder changes
- External environment shifts
- Performance metric changes

## Measurement and Optimization

### Context Effectiveness Metrics
- **Understanding Accuracy**: How well AI comprehends provided context
- **Information Efficiency**: Ratio of relevant to total context provided
- **Hallucination Prevention**: Frequency of AI making unwarranted assumptions
- **Task Success Rate**: Correlation between context quality and outcome success

### Context Quality Indicators
- **Completeness**: All necessary information provided
- **Accuracy**: Information is correct and current
- **Relevance**: Information directly supports task completion
- **Clarity**: Information is easily understood and actionable

### Continuous Improvement Process
1. **Monitor**: Track context-related issues and successes
2. **Analyze**: Identify patterns in context effectiveness
3. **Optimize**: Refine context delivery methods
4. **Validate**: Test improvements with real scenarios
5. **Standardize**: Document and share effective patterns

## Troubleshooting Common Issues

### Over-Contextualization
- **Problem**: Providing too much irrelevant information
- **Solution**: Use relevance filtering and progressive disclosure

### Under-Contextualization
- **Problem**: Missing critical information leading to poor outcomes
- **Solution**: Use comprehensive checklists and validation steps

### Context Staleness
- **Problem**: Outdated information affecting decisions
- **Solution**: Implement refresh triggers and version control

### Context Fragmentation
- **Problem**: Important context scattered across multiple interactions
- **Solution**: Use context consolidation and reference patterns

## Verification Checklist

- [ ] Context delivery method appropriate for volatility level
- [ ] Anti-hallucination strategies implemented
- [ ] Information sources clearly attributed
- [ ] Assumptions and uncertainties marked
- [ ] Context completeness verified
- [ ] Understanding validation included
- [ ] Integration with other methodologies considered
- [ ] Measurement and optimization approach defined
