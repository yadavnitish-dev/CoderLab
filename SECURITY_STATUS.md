# Security Status

**Last Updated:** July 14, 2026  
**Status:** Known vulnerabilities accepted for current deployment  
**Owner:** Development Team  
**Review Date:** TBD (scheduled for next security sprint)

---

## Known High-Severity Vulnerabilities (Accepted)

### 1. **axios** (1.9.0 - 1.15.2)
**Count:** 10 advisories | **Severity:** HIGH

- Invisible JSON Response Tampering via Prototype Pollution in `parseReviver`
- Prototype pollution read-side gadgets allowing credential injection and request hijacking
- Regular Expression Denial of Service (ReDoS) via Cookie Name Injection
- Allocation of Resources Without Limits or Throttling
- Proxy-Authorization Credential Leak on HTTP-to-HTTPS Redirects (x2)
- Credential Theft and Response Hijacking via Config Merge
- Full Man-in-the-Middle via Prototype Pollution in `config.proxy`
- DoS & Header Injection via Merge Functions
- IPv4-mapped IPv6 address bypass in `shouldBypassProxy`

**Risk Assessment:** Medium → Low (used internally in backend, not exposed to untrusted network input at scale)  
**Mitigation:** API endpoints are behind authentication middleware  
**Fix Available:** Yes (upgrade to ^1.18.0)

---

### 2. **nodemailer** (≤9.0.0)
**Count:** 4 advisories | **Severity:** HIGH

- CRLF injection in List-* header comments allowing arbitrary message header injection
- jsonTransport bypasses disableFileAccess/disableUrlAccess during normalization
- Improper TLS Certificate Validation in OAuth2 Token Fetch (enables credential interception)
- Message-level raw option bypasses disableFileAccess/disableUrlAccess (arbitrary file read + SSRF)

**Risk Assessment:** Medium (email module only active when RESEND_API_KEY is configured)  
**Mitigation:** Email sending is behind environment variable gating  
**Fix Available:** Yes (upgrade to ^9.0.3)

---

### 3. **form-data** (4.0.0 - 4.0.5)
**Count:** 1 advisory | **Severity:** HIGH

- CRLF injection in form-data via unescaped multipart field names and filenames

**Risk Assessment:** Low → Medium (only used internally for multipart requests)  
**Fix Available:** Yes (upgrade to 4.0.6)

---

### 4. **vite** (8.0.0 - 8.0.15)
**Count:** 2 advisories | **Severity:** HIGH

- launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows
- `server.fs.deny` bypass on Windows alternate paths

**Risk Assessment:** Low (development dependency only, not in production bundle)  
**Fix Available:** Yes (upgrade to ^8.1.4+)

---

## Known Moderate-Severity Vulnerabilities (Accepted)

### 5. **brace-expansion** (5.0.2 - 5.0.5)
**Severity:** MODERATE | **Advisory:** Large numeric range defeats documented `max` DoS protection  
**Fix Available:** Yes (upgrade to ^5.0.7)

### 6. **ip-address** (≤10.1.0)
**Severity:** MODERATE | **Advisory:** XSS in Address6 HTML-emitting methods  
**Depends on:** express-rate-limit (8.0.1 - 8.5.0)  
**Fix Available:** Yes (upgrade to ^10.2.0)

### 7. **qs** (6.11.1 - 6.15.1)
**Severity:** MODERATE | **Advisory:** qs.stringify crashes with TypeError on null/undefined entries  
**Fix Available:** Yes (upgrade to ^6.15.3+)

---

## Deployment Decision

**Decision:** Deploy existing code as-is without applying npm audit fixes.

**Justification:**
- Code is currently functional and tested
- No known active exploitation detected
- Vulnerabilities are mostly in transitive dependencies or internal APIs
- Backend runs in controlled environment with authentication middleware
- Email functionality is behind environment variable gating

**Risk Acceptance:** Development Team accepts these vulnerabilities for this deployment cycle.

---

## Planned Remediation

**Timeline:** Next security sprint (scheduled for 2 weeks)  
**Scope:**
1. Update axios to ^1.18.0 (10 fixes)
2. Update nodemailer to ^9.0.3 (4 fixes)
3. Update form-data to ^4.0.6 (1 fix)
4. Update vite to ^8.1.4+ (2 fixes)
5. Run `npm audit fix` for transitive dependency updates
6. Run full test suite + build verification
7. Deploy patched version

**Owner:** [Assign to team lead]

---

## Monitoring & Escalation

- **Weekly audit scans:** CI/CD will flag new vulnerabilities
- **Critical/Active exploits:** Escalate immediately for emergency patching
- **Exploit reports:** If any of these vulnerabilities are exploited, rotate secrets and patch within 24 hours

---

## References

- [npm Audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- Advisory links included in vulnerability descriptions above
