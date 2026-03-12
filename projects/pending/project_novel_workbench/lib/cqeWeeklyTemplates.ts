export type SummaryField = {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
};

export type SummaryTemplate = {
  id: string;
  category: string;
  type: string;
  label: string;
  description: string;
  sourceTemplate: string;
  fields: SummaryField[];
  buildZh: (values: Record<string, string>) => string;
  buildEn: (values: Record<string, string>) => string;
};

function value(values: Record<string, string>, key: string) {
  return (values[key] ?? "").trim();
}

function sitePrefix(values: Record<string, string>) {
  return `[${value(values, "site")}]`;
}

function optional(values: Record<string, string>, key: string, prefix: string) {
  const current = value(values, key);
  return current ? `${prefix}${current}` : "";
}

export const summaryRules = [
  "Complaint quantity format must be '*<Qty> pcs'.",
  "Project name is the Chinese location in parentheses when the template requires project context.",
  "Avoid using 'keep tracking'; use a clear action or status statement.",
  "When key information is missing, mark the field as '⚠ Missing'.",
  "When both location and date exist, location should appear before date."
] as const;

export const cqeWeeklyTemplates: SummaryTemplate[] = [
  {
    id: "audit-plan",
    category: "Audit/Certification",
    type: "Plan",
    label: "Audit / Certification Plan",
    description: "Use for planned audits or certifications.",
    sourceTemplate: "[Site]: will conduct <Audit> on <Date>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "audit", label: "Audit", placeholder: "VDA 6.3 audit", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：預計於 ${value(values, "date")} 進行 ${value(values, "audit")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: will conduct ${value(values, "audit")} on ${value(values, "date")}.`
  },
  {
    id: "audit-result",
    category: "Audit/Certification",
    type: "Result",
    label: "Audit / Certification Result",
    description: "Use for completed audits and outcomes.",
    sourceTemplate: "[Site]: <Audit> was conducted on <Date>, <Result>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "audit", label: "Audit", placeholder: "VDA 6.3 audit", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "result", label: "Result", placeholder: "no major findings", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：已於 ${value(values, "date")} 完成 ${value(values, "audit")}，${value(values, "result")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "audit")} was conducted on ${value(values, "date")}, ${value(values, "result")}.`
  },
  {
    id: "customer-visit-plan",
    category: "Customer Visit/VOC",
    type: "Plan",
    label: "Customer Visit / VOC Plan",
    description: "Use for planned customer or OEM visits.",
    sourceTemplate: "[Site]: <Customer[/OEM]> plans to visit <Site> on <Date> for <Purpose>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "customer", label: "Customer / OEM", placeholder: "Kostal", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "purpose", label: "Purpose", placeholder: "QBR review", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "customer")} 預計於 ${value(values, "date")} 拜訪 ${value(values, "site")}，目的為 ${value(values, "purpose")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "customer")} plans to visit ${value(values, "site")} on ${value(values, "date")} for ${value(values, "purpose")}.`
  },
  {
    id: "customer-visit-result",
    category: "Customer Visit/VOC",
    type: "Result",
    label: "Customer Visit / VOC Result",
    description: "Use for completed visits and VOC summaries.",
    sourceTemplate: "[Site]: <Customer[/OEM]> visited <Site> on <DateRange> for <Purpose>, <Outcome>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "customer", label: "Customer / OEM", placeholder: "Kostal", required: true },
      { key: "dateRange", label: "Date Range", placeholder: "2026/03/20-2026/03/21", required: true },
      { key: "purpose", label: "Purpose", placeholder: "QBR review", required: true },
      { key: "outcome", label: "Outcome", placeholder: "alignment reached on 8D timing", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "customer")} 於 ${value(values, "dateRange")} 拜訪 ${value(values, "site")}，目的為 ${value(values, "purpose")}；結果：${value(values, "outcome")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "customer")} visited ${value(values, "site")} on ${value(values, "dateRange")} for ${value(values, "purpose")}, ${value(values, "outcome")}.`
  },
  {
    id: "customer-request-plan",
    category: "Customer Request",
    type: "Plan",
    label: "Customer Request Plan",
    description: "Use for incoming customer requests with next action planning.",
    sourceTemplate:
      "[Site]: <Customer> <UrgentVerb> <Site> to <Action> <Tier1/OEM> <Product> <Task> on <Date>; CQE <Role>, plan to <NextStep> on <NextDate>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "customer", label: "Customer", placeholder: "Kostal", required: true },
      { key: "urgentVerb", label: "Urgent Verb", placeholder: "requested urgently", required: true },
      { key: "action", label: "Action", placeholder: "support", required: true },
      { key: "tier", label: "Tier1 / OEM", placeholder: "Volvo", required: true },
      { key: "product", label: "Product", placeholder: "window switch", required: true },
      { key: "task", label: "Task", placeholder: "onsite sorting", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "role", label: "CQE Role", placeholder: "coordinated factory response", required: true },
      { key: "nextStep", label: "Next Step", placeholder: "send 8D plan", required: true },
      { key: "nextDate", label: "Next Date", placeholder: "2026/03/21", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "customer")} 已${value(values, "urgentVerb")}${value(values, "site")}，要求${value(values, "action")}${value(values, "tier")} ${value(values, "product")} 之 ${value(values, "task")}，時間為 ${value(values, "date")}；CQE ${value(values, "role")}，下一步預計於 ${value(values, "nextDate")} ${value(values, "nextStep")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "customer")} ${value(values, "urgentVerb")} ${value(values, "site")} to ${value(values, "action")} ${value(values, "tier")} ${value(values, "product")} ${value(values, "task")} on ${value(values, "date")}; CQE ${value(values, "role")}, plan to ${value(values, "nextStep")} on ${value(values, "nextDate")}.`
  },
  {
    id: "customer-request-result",
    category: "Customer Request",
    type: "Result",
    label: "Customer Request Result",
    description: "Use for completed actions after customer requests.",
    sourceTemplate:
      "[Site]: <Customer> <UrgentVerb(past)> <Site> to <Action> <Tier1/OEM> <Product> <Task> on <Date>; CQE <Action>, <CompletionStatus>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "customer", label: "Customer", placeholder: "Kostal", required: true },
      { key: "urgentVerbPast", label: "Urgent Verb (Past)", placeholder: "urgently requested", required: true },
      { key: "action", label: "Action", placeholder: "support", required: true },
      { key: "tier", label: "Tier1 / OEM", placeholder: "Volvo", required: true },
      { key: "product", label: "Product", placeholder: "window switch", required: true },
      { key: "task", label: "Task", placeholder: "onsite sorting", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "cqeAction", label: "CQE Action", placeholder: "deployed sorting support", required: true },
      { key: "completionStatus", label: "Completion Status", placeholder: "sorting completed and feedback sent", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "customer")} 已於 ${value(values, "date")}${value(values, "urgentVerbPast")}${value(values, "site")}，要求${value(values, "action")}${value(values, "tier")} ${value(values, "product")} 之 ${value(values, "task")}；CQE 已${value(values, "cqeAction")}，${value(values, "completionStatus")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "customer")} ${value(values, "urgentVerbPast")} ${value(values, "site")} to ${value(values, "action")} ${value(values, "tier")} ${value(values, "product")} ${value(values, "task")} on ${value(values, "date")}; CQE ${value(values, "cqeAction")}, ${value(values, "completionStatus")}.`
  },
  {
    id: "complaints",
    category: "Complaints",
    type: "IQC/VLRR/0KM/FR",
    label: "Complaints",
    description: "Use for customer complaints and defect summaries.",
    sourceTemplate:
      "[Site] [Category]: <Customer> reported (<Project>) <Product> <Defect> *<Qty> pcs in <Location> on <Date>; <Follow-up actions>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "complaintCategory", label: "Category", placeholder: "VLRR", required: true },
      { key: "customer", label: "Customer", placeholder: "Kostal", required: true },
      { key: "project", label: "Project", placeholder: "Jiading", required: true },
      { key: "product", label: "Product", placeholder: "window switch", required: true },
      { key: "defect", label: "Defect", placeholder: "scratch on housing", required: true },
      { key: "qty", label: "Qty", placeholder: "12", required: true },
      { key: "location", label: "Location", placeholder: "customer line", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "followUp", label: "Follow-up Actions", placeholder: "sorting arranged and FA ongoing", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)} [${value(values, "complaintCategory")}]：${value(values, "customer")} 反映 (${value(values, "project")}) ${value(values, "product")} 於 ${value(values, "location")} 在 ${value(values, "date")} 發生 ${value(values, "defect")}，數量 *${value(values, "qty")} pcs；${value(values, "followUp")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)} [${value(values, "complaintCategory")}]: ${value(values, "customer")} reported (${value(values, "project")}) ${value(values, "product")} ${value(values, "defect")} *${value(values, "qty")} pcs in ${value(values, "location")} on ${value(values, "date")}; ${value(values, "followUp")}.`
  },
  {
    id: "improvement-closure",
    category: "Improvement/Closure",
    type: "NA",
    label: "Improvement / Closure",
    description: "Use for major improvement milestones or closure notes.",
    sourceTemplate: "[Site]: <Task> -- <Date> <Status>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "task", label: "Task", placeholder: "line audit finding closure", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "status", label: "Status", placeholder: "completed", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "task")}，於 ${value(values, "date")} ${value(values, "status")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "task")} -- ${value(values, "date")} ${value(values, "status")}.`
  },
  {
    id: "ongoing-activity",
    category: "Ongoing Activity",
    type: "NA",
    label: "Ongoing Activity",
    description: "Use for ongoing project or improvement activities.",
    sourceTemplate: "[Site]: <Project>: <Action> from <StartDate> – <Status>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "project", label: "Project", placeholder: "Customer VOC reduction", required: true },
      { key: "action", label: "Action", placeholder: "weekly defect review launched", required: true },
      { key: "startDate", label: "Start Date", placeholder: "2026/03/01", required: true },
      { key: "status", label: "Status", placeholder: "in progress", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "project")}：自 ${value(values, "startDate")} 起執行 ${value(values, "action")}，目前 ${value(values, "status")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "project")}: ${value(values, "action")} from ${value(values, "startDate")} - ${value(values, "status")}.`
  },
  {
    id: "new-project-kickoff",
    category: "New Project Kick-off",
    type: "NA",
    label: "New Project Kick-off",
    description: "Use for new project start records.",
    sourceTemplate: "[Site]: <Customer>/<Product> (<ProjectName>) kicked off on <Date>; <Status>.",
    fields: [
      { key: "site", label: "Site", placeholder: "IPT", required: true },
      { key: "customer", label: "Customer", placeholder: "Kostal", required: true },
      { key: "product", label: "Product", placeholder: "window switch", required: true },
      { key: "projectName", label: "Project Name", placeholder: "Jiading", required: true },
      { key: "date", label: "Date", placeholder: "2026/03/20", required: true },
      { key: "status", label: "Status", placeholder: "customer requirement review completed", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "customer")} / ${value(values, "product")} (${value(values, "projectName")}) 已於 ${value(values, "date")} 啟動；${value(values, "status")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "customer")}/${value(values, "product")} (${value(values, "projectName")}) kicked off on ${value(values, "date")}; ${value(values, "status")}.`
  },
  {
    id: "people-development",
    category: "People Development",
    type: "NA",
    label: "People Development",
    description: "Use for training and people development records.",
    sourceTemplate: "[Dept]: <Training> from <DateRange>; <Person> <Result>.",
    fields: [
      { key: "site", label: "Dept / Site", placeholder: "CQE", required: true },
      { key: "training", label: "Training", placeholder: "IPC-610 refresh training", required: true },
      { key: "dateRange", label: "Date Range", placeholder: "2026/03/20-2026/03/21", required: true },
      { key: "person", label: "Person", placeholder: "3 engineers", required: true },
      { key: "result", label: "Result", placeholder: "completed certification", required: true }
    ],
    buildZh: (values) =>
      `${sitePrefix(values)}：${value(values, "training")} 於 ${value(values, "dateRange")} 進行；${value(values, "person")}${value(values, "result")}。`,
    buildEn: (values) =>
      `${sitePrefix(values)}: ${value(values, "training")} from ${value(values, "dateRange")}; ${value(values, "person")} ${value(values, "result")}.`
  }
];

export function getTemplateById(id: string) {
  return cqeWeeklyTemplates.find((template) => template.id === id) ?? cqeWeeklyTemplates[0];
}

export function generateSummary(templateId: string, rawValues: Record<string, string>) {
  const template = getTemplateById(templateId);
  const missing = template.fields
    .filter((field) => field.required && !value(rawValues, field.key))
    .map((field) => field.label);

  const values = Object.fromEntries(
    template.fields.map((field) => [
      field.key,
      value(rawValues, field.key) || (field.required ? "⚠ Missing" : "")
    ])
  );

  return {
    template,
    missing,
    zh: template.buildZh(values),
    en: template.buildEn(values)
  };
}

export function buildTemplateCatalogText() {
  return cqeWeeklyTemplates
    .map((template) => {
      const fields = template.fields
        .map((field) => `${field.key}${field.required ? " (required)" : ""}`)
        .join(", ");

      return [
        `templateId: ${template.id}`,
        `category: ${template.category}`,
        `type: ${template.type}`,
        `description: ${template.description}`,
        `sourceTemplate: ${template.sourceTemplate}`,
        `fields: ${fields}`
      ].join("\n");
    })
    .join("\n\n");
}
