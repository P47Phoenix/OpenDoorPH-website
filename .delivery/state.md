pipeline_id: run-2026-04-10-bf7w
status: completed
current_stage: 7
stages_completed: [idea, plan, development, uat]
stages_skipped: [refine, design, architect]
last_updated: 2026-04-10
config_snapshot: |
  project_type: BUG_FIX
  tech_stack:
    languages: [TypeScript, JavaScript]
    frameworks: [React, React Router, Tailwind CSS]
    ci_cd: github-actions
  pipeline:
    checkpoints: [refine, uat]
    max_self_correction: 3
    max_dod_rounds: 3
    parallel_validators: true
  aliases:
    theme: bible
artifacts:
  idea: .delivery/artifacts/01-idea/po/idea-brief.md
  plan-stories: .delivery/artifacts/05-plan/po/stories.md
  plan-sprint: .delivery/artifacts/05-plan/sm/sprint-plan.md
  dev: .delivery/artifacts/06-dev/developer/BF-001.md
  uat-test-plan: .delivery/artifacts/07-uat/qa/test-plan.md
  uat-release-plan: .delivery/artifacts/07-uat/devops/release-plan.md
  uat-release-notes: .delivery/artifacts/07-uat/tech-writer/release-notes.md
human_checkpoints_passed: [uat]
commit: e1ddd62
