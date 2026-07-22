# Security Policy

## Supported versions

Security fixes are applied to the latest code on `main`. There are no long-lived
release branches yet.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Report privately by emailing **savonen.emppu@gmail.com**, or use
[GitHub Security Advisories](https://github.com/valtterisa/builddrr-app/security/advisories/new)
if available on the repository.

Include:

- A description of the issue and its impact
- Steps to reproduce or a proof of concept
- Affected versions / commit if known

You should receive an acknowledgment within a few days. We will work with you on
a fix and disclosure timeline. Please give us reasonable time before any public
disclosure.

## Secrets and credentials

Never commit API keys, Convex deploy keys, or `.env.local`. Use `.env.example`
as the template for required variables. If you accidentally commit a secret,
rotate it immediately and notify the maintainers.
