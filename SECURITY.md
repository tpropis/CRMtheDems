# Privilege Vault AI — Security Architecture

## Overview

Privilege Vault AI is designed with privilege protection and zero data exposure as first-class architectural requirements. Every component is built under the assumption that the data being handled is subject to attorney-client privilege or work product protection.

## Threat Model

### Assets Protected
- Client communications and legal advice (attorney-client privileged)
- Litigation strategy documents (work product)
- Matter files, discovery productions, and witness materials
- Client financial data and billing information
- AI query history and research threads

### Trust Boundaries
1. **Firm Perimeter**: PostgreSQL, file storage, AI inference — all within firm control
2. **User Sessions**: JWT-based, server-validated, 8-hour maximum lifetime
3. **Matter Scope**: Every data access enforces matter-level permissions server-side
4. **AI Inference**: Default provider (Ollama) runs locally — no external API calls

### Threat Actors
- External attackers targeting firm infrastructure
- Unauthorized insider access
- Privilege waiver through inadvertent disclosure to third-party AI services
- Session hijacking and credential attacks

## Architecture Controls

### Authentication
- Credentials hashed with bcrypt (cost factor 12)
- JWT sessions with 8-hour expiration
- Failed login events logged to immutable audit trail
- MFA scaffold included (Authenticator app support)
- Session tied to IP/UA for anomaly detection (roadmap)

### Authorization (RBAC)
- 10 role levels from Firm Owner to Read-Only Auditor
- Server-side enforcement — client cannot bypass permissions
- Matter-level access scoped per user
- Document-level privilege groups
- All role checks happen in API routes and server components

### Data Isolation
- Every query scoped to `firmId` — multi-tenant isolation enforced at ORM layer
- No cross-firm data leakage by architecture
- Matter access list checked on every request (roadmap: row-level security at PostgreSQL)

### AI Privacy Architecture
```
Request → Firm Network → Local Ollama/vLLM
                              ↓
                    Inference on firm hardware
                              ↓  
                    Response → App → User

No data path to external AI APIs unless explicitly configured.
AI_PROVIDER=openai requires deliberate opt-in + user warning.
```

### Audit Trail
- Immutable `AuditEvent` table — no UPDATE or DELETE permitted
- All sensitive actions recorded: login, file access, AI queries, exports, deletes
- Includes: userId, matterId, IP address, user agent, timestamp, action, description
- Admin-accessible, exportable for compliance review
- Legal hold support prevents deletion of held matter records

### Encryption
- TLS 1.3 required for all connections in production
- Database: encrypted at rest via OS/disk-level encryption (deployment responsibility)
- File storage: AES-256 via S3-compatible bucket encryption
- Secrets: environment variables, never committed to source

### Input Validation
- Zod schema validation on all API inputs
- Parameterized queries via Prisma (no raw SQL injection risk)
- File upload type validation and size limits
- Content Security Policy headers (SECURITY.md roadmap)

### Rate Limiting
- Scaffold in place for rate limiting middleware
- Production deployment: configure at nginx/load balancer layer
- Recommended: 100 requests/minute per user for API routes

## Deployment Security Recommendations

### On-Premises
1. Run on dedicated VLAN, isolated from general firm network
2. Firewall: only expose port 443 externally
3. Database: localhost only, no external connectivity
4. Storage: encrypted NAS or local SSD
5. AI inference: dedicated GPU server on internal network
6. Regular backup with off-site encrypted copy

### Private Cloud (AWS/Azure)
1. Deploy in private VPC with no public subnet exposure
2. Use VPN or AWS Private Link for access
3. RDS PostgreSQL with encryption at rest
4. S3 with server-side encryption and bucket policies
5. Azure OpenAI: use private endpoints only
6. CloudTrail/Azure Monitor for infrastructure audit

### Access
- Require MFA for all users (configure via app admin)
- Use SSO via SAML/OIDC if firm has identity provider (roadmap)
- Regular access reviews quarterly

## Privilege Protection Guardrails

The platform implements specific guardrails to prevent inadvertent privilege waiver:

1. **AI Output Labeling**: All AI-generated content is labeled "[DRAFT — ATTORNEY REVIEW REQUIRED]"
2. **Source Traceability**: AI research responses always show source documents used
3. **No External Transmission**: Default configuration never sends matter content to third-party APIs
4. **Privilege Tagging**: Discovery documents automatically flagged for attorney review
5. **Export Controls**: Document exports logged to audit trail
6. **Retention Policies**: Documents on legal hold cannot be deleted

## Incident Response

In case of suspected breach:
1. Immediately notify IT Admin and Managing Partner
2. Preserve audit logs (do not modify or delete)
3. Isolate affected systems
4. Identify scope via audit log review
5. Notify affected clients per applicable bar rules and breach notification laws
6. Document response actions

## Compliance Notes

This platform is designed to support but does not guarantee compliance with:
- ABA Model Rules (Rule 1.1, 1.6)
- State bar ethics rules on data security
- HIPAA (if health-related matters)
- SOC 2 Type II principles
- GDPR Article 32 (if EU client data)

Attorney firms retain responsibility for ensuring their specific obligations are met. This software provides architectural controls to support compliance programs.

---

*For security vulnerability disclosure, contact your firm's IT administrator or platform vendor.*
