/**
 * Abinaya N - Portfolio Data & Bio Information
 * Source: Abinaya_N.docx (GRC Analyst, Security Compliance, Risk & Controls)
 */

export const ABINAYA_RESUME_MD = `# ABINAYA N
### GRC ANALYST | SECURITY COMPLIANCE | RISK & CONTROLS

**Location:** Chennai, Tamil Nadu, India  
**Phone:** [+91 9842468450](tel:+919842468450) | **Email:** [abinayacyber604@gmail.com](mailto:abinayacyber604@gmail.com)  
**LinkedIn:** [linkedin.com/in/abinaya](https://www.linkedin.com/in/abinaya) | **GitHub:** [github.com/Abinayanatrajan](https://github.com/Abinayanatrajan)

---

## 🛡️ Professional Profile
GRC Analyst who turns **ISO/IEC 27001**, **PCI-DSS**, and **NIST** requirements into audit-ready, automated compliance workflows. Built and shipped AI-assisted validation tooling now used for live ITSAR assessments — cutting manual review effort while holding evidence quality steady. Comfortable across the full loop: control mapping, security testing, SIEM monitoring, and threat intelligence.

---

## ⚡ Core Competencies

* **GRC & Compliance:** ISO/IEC 27001 · PCI-DSS v4.0 · NIST SP 800-53 / CSF · ITSAR · ISO 9001 · Control Assessment · Risk & Compliance Mapping
* **Compliance Automation:** AI-Assisted Validation · Control Mapping Engines · Automated Evidence Checking · Rule Engines
* **Threat Intelligence & Operations:** OpenCTI · External Threat Feeds · Maritime CTI · Wazuh SIEM · Splunk · Wireshark
* **Security Testing & Vulnerability Mgmt:** RBAC / Permission Testing · OpenVAS · Nessus · Burp Suite · Nmap
* **Technical Stack:** Python · REST APIs · JSON · Docker · Git · AI/LLM-Assisted Development

---

## 💼 Professional Experience

### **Cyber Security Engineer** | Pitowings Pvt. Ltd.
*Present · Chennai, India*
* **ISO/IEC 27001 Compliance:** Validated organizational assets and technical security controls against ISO/IEC 27001 requirements, closing evidence gaps ahead of external certification audits.
* **PCI-DSS & NIST Testing:** Ran PCI-DSS and NIST-based security testing across the application portfolio, surfacing vulnerabilities and routing them into remediation tracking before release.
* **Mobile & App Penetration Testing:** Led penetration and functional testing on mobile applications, flagging high/critical vulnerabilities and verifying fixes with developers.
* **AI-Assisted ITSAR Tooling:** Built the AI-assisted ITSAR validation logic (requirements, test objectives, preconditions, and outputs), replacing manual line-by-line review with automated checks.
* **Production Validation Platform:** Shipped the frontend for the ITSAR AI validation platform, now the team's day-to-day tool for running live compliance assessments.
* **SIEM Operations:** Owned Wazuh monitoring across the security stack, catching event-collection and pipeline failures before reaching reporting.
* **Threat Intelligence Pipeline:** Vetted external CTI and RSS feeds ahead of OpenCTI ingestion, filtering out unreliable sources to maintain threat intelligence pipeline integrity.

### **Cyber Security Intern** | CyberTech Ninja Pvt. Ltd.
*Jun 2024 – Jul 2024 · Chennai, India*
* **SIEM Alert Triage:** Triaged security alerts and logs using SIEM workflows, supporting detection and incident-response investigations.
* **Runbook & Response Documentation:** Authored security documentation and response-template updates that became part of the team's standard operating procedures.

---

## 🚀 Selected Projects

* **ISO/IEC 27001 Compliance Automation Platform**  
  *Stack: Python, REST APIs, JSON, Docker, Rule Engine*  
  Built pipeline stages for asset assessment and rule-based compliance scoring, replacing manual assessment steps with automated checks.

* **AI-Based Document & Compliance Validation (ITSAR)**  
  *Stack: Python, OpenAI/LLM Prompt Engineering, JSON Schema, React*  
  Designed prompt-based validation rules that made compliance-document review outputs consistent, verifiable, and audit-ready.

* **Cyber Threat Intelligence & OpenCTI Integration**  
  *Stack: OpenCTI, Docker, Python, STIX/TAXII, RSS Feeds*  
  Integrated external and maritime CTI sources into OpenCTI for centralized collection, IOC tracking, and multi-tenant threat analysis.

* **AI-Enhanced Vulnerability Scanner**  
  *Stack: Python, OpenVAS, AI/ML Risk Scoring*  
  Paired AI analysis with OpenVAS scan output to auto-prioritize findings by risk score, exploitability, and attack vectors.

* **ISO/IEC 27001 & ISO 9001 Compliance Implementation**  
  Supported compliance implementation by reviewing requirements, collecting evidence, preparing documentation, identifying gaps, and tracking activities for audit readiness.

---

## 🎓 Education
* **Bachelor of Engineering (B.E.) — Computer Science and Engineering (Cyber Security)**  
  *Dr. Mahalingam College of Engineering and Technology* | **CGPA: 8.5 / 10.0**

---

## 📜 Certifications
* **Certified in Cybersecurity (CC)** — ISC2
* **Network Defense** — Cisco Networking Academy
* **Networking Security** — Blue Team Security
* **Pre Security Learning Path** — TryHackMe
`;

export const ABINAYA_BIO_TEXT = ABINAYA_RESUME_MD;

export const initialAbinayaFiles = [
  {
    id: "abinaya_intro",
    name: "About_Abinaya_N.md",
    type: "markdown",
    size: 3200,
    date: "2026-06-15T10:00:00Z",
    content: ABINAYA_RESUME_MD,
    readOnly: true
  },
  {
    id: "abinaya_experience",
    name: "Experience_&_Work.md",
    type: "markdown",
    size: 1980,
    date: "2026-06-15T11:00:00Z",
    content: `## Professional Experience & Technical Highlights — Abinaya N

### 1. Cyber Security Engineer | Pitowings Pvt. Ltd.
* **ISO/IEC 27001 Control Auditing:** Mapped technical and administrative controls across multi-cloud and on-premise infrastructure to ISO/IEC 27001 Annex A controls.
* **AI-Assisted ITSAR Validation:** Coded the validation rules, preconditions, test objectives, and prompt logic for Indian Telecom Security Assurance Requirements.
* **Penetration Testing:** Executed authenticated and unauthenticated penetration tests across web and mobile endpoints under PCI-DSS v4.0 and NIST guidelines.
* **Wazuh SIEM Operations:** Deployed agents, customized rule files, and correlated logs to alert on anomalous authentication and privilege escalation.
* **OpenCTI Ingestion:** Built ingestion workers to normalize threat data from commercial and maritime threat feeds into STIX 2.1 format.

### 2. Cyber Security Intern | CyberTech Ninja Pvt. Ltd.
* **SOC Tier 1 Monitoring:** Monitored alert queues in SIEM tools, performed initial triage, and escalated confirmed incidents.
* **Playbook Engineering:** Documented and updated incident response workflows for malware containment and credential theft.`
  },
  {
    id: "abinaya_projects",
    name: "Projects_Portfolio.md",
    type: "markdown",
    size: 1750,
    date: "2026-06-15T12:00:00Z",
    content: `## Selected Security & Compliance Projects — Abinaya N

### 1. ISO/IEC 27001 Compliance Automation Platform
* **Stack:** Python, REST APIs, JSON, Docker, Rule Engine
* **Overview:** Automated asset discovery and compliance scoring engine that evaluates security controls against ISO 27001 requirements.

### 2. AI-Based Document & Compliance Validation (ITSAR)
* **Stack:** Python, OpenAI/LLM Prompt Engineering, JSON Schema, React
* **Overview:** AI-assisted validation platform used for live ITSAR compliance assessments, streamlining document reviews.

### 3. Cyber Threat Intelligence & OpenCTI Pipeline
* **Stack:** OpenCTI, Docker, Python, STIX/TAXII, RSS Feed Parser
* **Overview:** Centralized threat intelligence collection system aggregating feeds from maritime and global OSINT sources.

### 4. AI-Enhanced Vulnerability Prioritizer
* **Stack:** Python, OpenVAS, Machine Learning Risk Heuristics
* **Overview:** Risk-scoring algorithm pairing OpenVAS vulnerability reports with real-time exploitability data.`
  },
  {
    id: "abinaya_certifications",
    name: "Certifications_&_Skills.md",
    type: "markdown",
    size: 1200,
    date: "2026-06-15T13:00:00Z",
    content: `## Certifications & Technical Skills — Abinaya N

### Industry Certifications
* **Certified in Cybersecurity (CC)** — ISC2
* **Network Defense** — Cisco Networking Academy
* **Networking Security** — Blue Team Security
* **Pre Security Learning Path** — TryHackMe

### Frameworks & Governance
* ISO/IEC 27001 · ISO 9001 · PCI-DSS v4.0 · NIST SP 800-53 · NIST CSF · ITSAR

### Security Tools
* Wazuh SIEM · Splunk · OpenCTI · Burp Suite · OpenVAS · Nessus · Wireshark · Nmap

### Programming & DevOps
* Python · REST APIs · JSON · Docker · Git · AI/LLM-Assisted Development`
  },
  {
    id: "abinaya_contact",
    name: "Contact_&_Socials.md",
    type: "markdown",
    size: 850,
    date: "2026-06-15T14:00:00Z",
    content: `## Contact & Professional Links — Abinaya N

* **Full Name:** Abinaya N
* **Role:** GRC Analyst | Security Compliance | Risk & Controls
* **Phone:** [+91 9842468450](tel:+919842468450)
* **Email:** [abinayacyber604@gmail.com](mailto:abinayacyber604@gmail.com)
* **LinkedIn:** [https://www.linkedin.com/in/abinaya](https://www.linkedin.com/in/abinaya)
* **GitHub:** [https://github.com/Abinayanatrajan](https://github.com/Abinayanatrajan)
* **Location:** Chennai, Tamil Nadu, India`
  }
];
