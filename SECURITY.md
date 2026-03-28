# Security Policy

## Guidelines

- **No credentials in code or repos.** Use env vars or secrets managers; never commit API keys, tokens, or passwords.
- **Disable test mode in production.** `NEXT_PUBLIC_TEST_MODE` and `ALLOW_TEST_MODE` must be `false` in prod.
- **Least privilege.** Scope AWS IAM permissions and Cognito access to the minimum required.

## Reporting a Vulnerability

1. **Preferred:** Use GitHub **Security Advisories** (Security tab -> "Report a vulnerability").
2. **If advisories are unavailable:** Open a GitHub issue titled **"Security: request private channel"** and include only high-level details. A maintainer will respond with a private contact method.

Please include:
- A clear description of the issue and impact
- Steps to reproduce (or a minimal proof of concept)
- Affected components and versions
- Any suggested remediation

We aim to acknowledge reports within **72 hours** and provide a remediation plan as soon as possible.
