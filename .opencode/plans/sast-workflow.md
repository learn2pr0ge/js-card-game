# SAST Security Analysis Workflow Plan

## Overview
Create a GitHub Actions workflow file `.github/workflows/sast.yml` that performs Static Application Security Testing (SAST) on the JavaScript card game codebase.

## File to Create
`.github/workflows/sast.yml`

## Workflow Features

### Trigger
- Manual trigger via `workflow_dispatch`
- Optional input parameter for severity threshold (low, moderate, high, critical)

### Jobs

#### 1. Security Vulnerability Analysis
- **Setup**: Checkout code, setup Node.js 22.x, install dependencies
- **npm audit**: Scan dependencies for known vulnerabilities
- **ESLint security check**: Run security-focused ESLint rules
  - detect-eval-with-expression
  - detect-non-literal-fs-filename
  - detect-non-literal-regexp
  - detect-non-literal-require
  - detect-object-injection
  - detect-possible-timing-attacks
  - detect-pseudoRandomBytes
  - detect-unsafe-regex
- **Semgrep SAST scan**: Industry-standard static analysis for JavaScript
- **Process results**: Count vulnerabilities by severity
- **Create GitHub Issue**: Generate structured report with findings

### Output
- GitHub Step Summary with all scan results
- GitHub Issue with:
  - Summary table of vulnerabilities by severity
  - Detailed scan results
  - Prioritized recommendations
  - Labels: security, sast, vulnerability

## Implementation Steps
1. Create `.github/workflows/sast.yml` file
2. Add workflow with manual trigger
3. Configure security scanning tools
4. Add issue creation with structured report
5. Test workflow manually via GitHub Actions UI

## Tradeoffs
- **npm audit**: Fast, built-in, but only checks dependencies
- **ESlint security**: Catches code patterns, but limited rule set
- **Semgrep**: Comprehensive SAST, but requires Python installation
- **Combined approach**: Best coverage with minimal overhead
