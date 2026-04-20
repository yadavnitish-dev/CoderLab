# Security Policy

## 🔒 Security Overview

AlgoPrep implements enterprise-grade security practices to protect user data and prevent common web vulnerabilities.

## 📊 Current Security Status

### Vulnerabilities
- **Backend**: ✅ 0 vulnerabilities (all critical and high severity issues resolved)
- **Frontend**: ⚠️ 2 moderate vulnerabilities (DOMPurify in Monaco editor - dev dependency only)
- **Dependencies**: ✅ Regularly audited via CI/CD pipeline

### Security Features Implemented
- ✅ Security headers (Helmet middleware)
- ✅ Rate limiting (multiple tiers)
- ✅ Input validation (Zod schemas)
- ✅ Secure authentication (JWT + HTTP-only cookies)
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ Payload size limits
- ✅ Logging sanitization

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: [project maintainer email]
3. Include detailed steps to reproduce the vulnerability
4. Allow reasonable time for response before public disclosure

## 🛡️ Security Measures

### Authentication & Authorization
- JWT tokens stored in HTTP-only cookies (prevents XSS theft)
- Passwords hashed with bcrypt (salt rounds: 10+)
- Admin role-based access control
- Session management with secure cookie options

### Input Validation & Sanitization
- All user inputs validated with Zod schemas
- Payload size limits: 1MB general, 200KB code execution
- Source code limited to 100KB
- No dangerous HTML rendering (no innerHTML/dangerouslySetInnerHTML)

### Network Security
- Rate limiting prevents abuse:
  - Auth endpoints: 5 requests/15 minutes
  - General API: 100 requests/15 minutes
  - Code execution: 10 requests/minute
- CORS configured with allowed origins only
- HTTPS enforced in production

### Infrastructure Security
- Docker containerization
- Environment variable configuration
- No secrets in version control
- Automated dependency vulnerability scanning

## 🔧 Security Dependencies

### Backend Security Libraries
```json
{
  "helmet": "^8.0.0",           // Security headers
  "express-rate-limit": "^8.3.2", // Rate limiting
  "bcryptjs": "^3.0.2",         // Password hashing
  "jsonwebtoken": "^9.0.2",     // JWT handling
  "zod": "^4.3.6"               // Input validation
}
```

### Frontend Security Libraries
```json
{
  "zod": "^4.2.1",              // Input validation
  "@monaco-editor/react": "^4.7.0" // Code editor (has DOMPurify vuln)
}
```

## 🚨 Known Limitations

### Acceptable Risks
1. **DOMPurify Vulnerabilities**: 2 moderate severity issues in Monaco editor
   - Impact: Limited to development environment
   - Mitigation: Code editor runs client-side only
   - Status: Monitoring for updates from Monaco team

### Future Security Enhancements
- [ ] Implement comprehensive logging system
- [ ] Add secrets management service (Vault, AWS Secrets Manager)
- [ ] Implement CSRF protection
- [ ] Add security headers testing
- [ ] Implement automated security testing (SAST/DAST)
- [ ] Add rate limit monitoring and alerting

## 📈 Security Monitoring

### CI/CD Security Checks
- Automated `npm audit` on all builds
- Dependency vulnerability scanning
- Build failure on moderate+ severity issues

### Manual Security Reviews
- Code review for security issues
- Dependency updates monitoring
- Security header validation

## 🔄 Security Update Process

1. **Vulnerability Detection**: Automated scanning or manual reports
2. **Assessment**: Evaluate impact and exploitability
3. **Fix Implementation**: Update dependencies or implement mitigations
4. **Testing**: Verify fixes don't break functionality
5. **Deployment**: Roll out security patches
6. **Documentation**: Update security status and practices

## 📞 Contact

For security-related questions or concerns:
- **Security Issues**: [contact method]
- **General Security Questions**: [contact method]

---

*Last Security Review: April 2026*
*Next Scheduled Review: July 2026*</content>
<parameter name="filePath">/Users/nitish/Desktop/projects/algoprep/SECURITY.md