export const DEFAULT_TEMPLATES = [
  {
    name: 'Client Engagement Letter',
    category: 'CORRESPONDENCE',
    practiceArea: null,
    content: `{{today}}

{{client.name}}
{{client.address}}

Re: Engagement of {{firm.name}} — {{matter.type}} Matter

Dear {{client.name}}:

We are pleased to confirm our agreement to represent you in connection with {{matter.description}}. This letter sets forth the terms of our engagement.

SCOPE OF REPRESENTATION

{{firm.name}} will represent you in connection with {{matter.name}}. Our representation is limited to the matter described above unless otherwise agreed in writing.

FEES AND BILLING

Our fees for this matter will be billed at {{attorney.rate}} per hour for attorney time. We will bill monthly and payment is due within 30 days of invoice date. We require a retainer of {{retainer.amount}}, which will be held in our client trust account and applied against fees as earned.

COMMUNICATION

We will keep you informed of significant developments in your matter. Please feel free to contact {{attorney.name}} at any time with questions.

Please sign and return one copy of this letter to indicate your acceptance of these terms.

Very truly yours,

{{attorney.name}}
{{attorney.title}}
{{firm.name}}
{{attorney.barNumber}}

AGREED AND ACCEPTED:

_______________________________
{{client.name}}
Date: ___________________________`,
  },
  {
    name: 'Demand Letter',
    category: 'CORRESPONDENCE',
    practiceArea: null,
    content: `{{today}}

VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED

{{opposing.counsel}}
{{opposing.address}}

Re: {{client.name}} v. {{opposing.party}} — Demand for {{demand.relief}}

Dear {{opposing.counsel}}:

This firm represents {{client.name}} in connection with the above-referenced matter. We write to demand {{demand.relief}} arising from {{demand.facts}}.

BACKGROUND

{{demand.background}}

LEGAL BASIS

{{demand.legal_basis}}

DEMAND

On behalf of our client, we hereby demand {{demand.amount}} within {{demand.deadline}} days of the date of this letter. If we do not receive a satisfactory response by {{demand.response_date}}, we will have no alternative but to pursue all available legal remedies, including but not limited to filing suit in {{matter.court}}.

We trust that you will give this matter your immediate attention.

Very truly yours,

{{attorney.name}}
{{attorney.title}}
{{firm.name}}`,
  },
  {
    name: 'Legal Memorandum',
    category: 'INTERNAL',
    practiceArea: null,
    content: `PRIVILEGED AND CONFIDENTIAL
ATTORNEY-CLIENT COMMUNICATION — ATTORNEY WORK PRODUCT

MEMORANDUM

TO:      {{memo.to}}
FROM:    {{attorney.name}}
DATE:    {{today}}
RE:      {{memo.subject}} — {{matter.name}} ({{matter.number}})

I. ISSUE PRESENTED

{{memo.issue}}

II. BRIEF ANSWER

{{memo.brief_answer}}

III. FACTS

{{memo.facts}}

IV. ANALYSIS

{{memo.analysis}}

V. CONCLUSION

{{memo.conclusion}}

VI. RECOMMENDATIONS

{{memo.recommendations}}`,
  },
  {
    name: 'Deposition Notice',
    category: 'LITIGATION',
    practiceArea: 'LITIGATION',
    content: `IN THE {{matter.court}}
{{matter.jurisdiction}}

{{client.name}},
    Plaintiff,

v.                                          Case No. {{matter.caseNumber}}

{{opposing.party}},
    Defendant.

NOTICE OF DEPOSITION OF {{deponent.name}}

TO: {{opposing.counsel}}, Counsel for Defendant

PLEASE TAKE NOTICE that, pursuant to Rule 30 of the Federal Rules of Civil Procedure, Plaintiff {{client.name}} will take the deposition upon oral examination of {{deponent.name}} on {{deposition.date}} at {{deposition.time}}, at {{deposition.location}}.

The deposition will continue from day to day until completed. You are invited to attend and cross-examine.

Dated: {{today}}

Respectfully submitted,

{{attorney.name}}
{{attorney.title}}
{{firm.name}}
{{attorney.barNumber}}
{{firm.phone}}`,
  },
  {
    name: 'Retainer Agreement',
    category: 'ADMINISTRATIVE',
    practiceArea: null,
    content: `ATTORNEY-CLIENT RETAINER AGREEMENT

This Retainer Agreement ("Agreement") is entered into as of {{today}} between {{firm.name}} ("Firm") and {{client.name}} ("Client").

1. ENGAGEMENT. Client hereby retains Firm to represent Client in connection with {{matter.description}}.

2. FEES. Client agrees to pay Firm's fees at the following rates:
   - Partners: \${{rate.partner}} per hour
   - Associates: \${{rate.associate}} per hour
   - Paralegals: \${{rate.paralegal}} per hour

3. RETAINER. Client shall pay an initial retainer of \${{retainer.amount}} upon execution of this Agreement. The retainer will be deposited in Firm's client trust account and applied against fees as earned.

4. BILLING. Firm will invoice Client monthly. Invoices are due within 30 days.

5. CONFIDENTIALITY. All communications between Client and Firm are protected by the attorney-client privilege.

6. TERMINATION. Either party may terminate this Agreement upon written notice. Client remains responsible for fees incurred through termination.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{{firm.name}}

By: ___________________________
{{attorney.name}}, {{attorney.title}}

CLIENT

By: ___________________________
{{client.name}}
Date: {{today}}`,
  },
  {
    name: 'Motion — General',
    category: 'LITIGATION',
    practiceArea: 'LITIGATION',
    content: `IN THE {{matter.court}}
{{matter.jurisdiction}}

{{client.name}},
    Plaintiff,

v.                                          Case No. {{matter.caseNumber}}
                                            Judge {{matter.judge}}

{{opposing.party}},
    Defendant.

{{motion.title}}

{{client.name}}, by and through undersigned counsel, respectfully moves this Court for {{motion.relief}}, and in support thereof states as follows:

INTRODUCTION

{{motion.introduction}}

FACTUAL BACKGROUND

{{motion.facts}}

LEGAL STANDARD

{{motion.legal_standard}}

ARGUMENT

I. {{motion.argument_heading_1}}

{{motion.argument_body_1}}

CONCLUSION

For the foregoing reasons, {{client.name}} respectfully requests that this Court {{motion.requested_relief}}.

Respectfully submitted,

Dated: {{today}}

{{attorney.name}}
{{attorney.title}}
{{firm.name}}
{{attorney.barNumber}}
{{firm.address}}, {{firm.city}}, {{firm.state}} {{firm.zipCode}}
{{firm.phone}}

CERTIFICATE OF SERVICE

I hereby certify that on {{today}}, a true and correct copy of the foregoing was served upon counsel of record via the Court's ECF system.

{{attorney.name}}`,
  },
  {
    name: 'Non-Disclosure Agreement',
    category: 'TRANSACTIONAL',
    practiceArea: 'CORPORATE',
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of {{today}} between {{client.name}} ("Disclosing Party") and {{nda.receiving_party}} ("Receiving Party").

1. CONFIDENTIAL INFORMATION. "Confidential Information" means any information disclosed by Disclosing Party to Receiving Party, directly or indirectly, in writing, orally or by inspection of tangible objects, including without limitation {{nda.scope}}.

2. NON-USE AND NON-DISCLOSURE. Receiving Party agrees not to use any Confidential Information for any purpose except {{nda.permitted_purpose}}. Receiving Party agrees not to disclose Confidential Information to third parties without prior written consent of Disclosing Party.

3. TERM. The obligations of this Agreement shall survive for a period of {{nda.term}} years from the date of disclosure.

4. RETURN OF MATERIALS. Upon request, Receiving Party shall promptly return or destroy all Confidential Information.

5. GOVERNING LAW. This Agreement shall be governed by the laws of {{nda.governing_law}}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{{client.name}}

By: ___________________________
Name:
Title:
Date: {{today}}

{{nda.receiving_party}}

By: ___________________________
Name:
Title:
Date: {{today}}`,
  },
  {
    name: 'Client Status Report',
    category: 'CORRESPONDENCE',
    practiceArea: null,
    content: `{{today}}

PRIVILEGED AND CONFIDENTIAL

{{client.name}}
{{client.address}}

Re: Status Report — {{matter.name}} ({{matter.number}})

Dear {{client.name}}:

We write to provide you with an update on the status of your matter as of {{today}}.

CURRENT STATUS

{{status.summary}}

RECENT ACTIVITY

{{status.recent_activity}}

UPCOMING DEADLINES AND EVENTS

{{status.upcoming}}

OUTSTANDING ITEMS — ACTION REQUIRED FROM CLIENT

{{status.client_action}}

BUDGET UPDATE

Fees incurred to date: \${{status.fees_to_date}}
Estimated fees remaining: \${{status.fees_remaining}}

Please do not hesitate to contact us with any questions.

Very truly yours,

{{attorney.name}}
{{attorney.title}}
{{firm.name}}
{{firm.phone}}`,
  },
  {
    name: 'Settlement Agreement',
    category: 'LITIGATION',
    practiceArea: 'LITIGATION',
    content: `SETTLEMENT AGREEMENT AND RELEASE

This Settlement Agreement and Release ("Agreement") is entered into as of {{today}} by and between {{client.name}} ("Plaintiff") and {{opposing.party}} ("Defendant").

RECITALS

A. Plaintiff filed a lawsuit against Defendant in {{matter.court}}, Case No. {{matter.caseNumber}} (the "Lawsuit").

B. The parties desire to resolve all claims without further litigation.

AGREEMENT

1. SETTLEMENT PAYMENT. In full and final settlement of all claims, Defendant shall pay to Plaintiff the sum of \${{settlement.amount}} within {{settlement.payment_days}} days of execution of this Agreement.

2. RELEASE. In consideration of the settlement payment, Plaintiff hereby releases and forever discharges Defendant from any and all claims arising out of or related to {{settlement.claims_released}}.

3. DISMISSAL. Upon receipt of the settlement payment, Plaintiff shall file a dismissal with prejudice of the Lawsuit.

4. NO ADMISSION. This Agreement does not constitute an admission of liability by any party.

5. CONFIDENTIALITY. The parties agree to keep the terms of this Agreement confidential.

6. GOVERNING LAW. This Agreement shall be governed by the laws of {{matter.jurisdiction}}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

PLAINTIFF:

___________________________
{{client.name}}
Date: {{today}}

DEFENDANT:

___________________________
{{opposing.party}}
Date: {{today}}

APPROVED AS TO FORM:

___________________________
{{attorney.name}}, Counsel for Plaintiff`,
  },
  {
    name: 'Privilege Log',
    category: 'LITIGATION',
    practiceArea: 'LITIGATION',
    content: `PRIVILEGE LOG

Matter: {{matter.name}}
Matter No.: {{matter.number}}
Court: {{matter.court}}
Case No.: {{matter.caseNumber}}
Prepared by: {{attorney.name}}, {{firm.name}}
Date: {{today}}

The following documents are withheld from production on the grounds of attorney-client privilege, work product doctrine, or other applicable privilege. Documents are identified by Bates number where assigned.

{{privilege_log.entries}}

CERTIFICATION

I, {{attorney.name}}, hereby certify that the foregoing privilege log is accurate and complete to the best of my knowledge and belief, and that each document listed has been reviewed and determined to be privileged.

___________________________
{{attorney.name}}
{{attorney.barNumber}}
{{firm.name}}
{{today}}`,
  },
]
