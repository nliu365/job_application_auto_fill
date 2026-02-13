import { useState, useRef } from "react";

const INITIAL_PROFILE = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", state: "", zip: "", country: "",
  linkedin: "", github: "", website: "", portfolio: "",
  summary: "",
};

const EMPTY_JOB = { company: "", title: "", location: "", startDate: "", endDate: "", current: false, description: "" };
const EMPTY_EDU = { school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", notes: "" };
const EMPTY_QA = { question: "", answer: "" };

const SUGGESTED_QUESTIONS = [
  "Why do you want to work here?",
  "What is your greatest strength?",
  "What is your greatest weakness?",
  "Tell me about yourself.",
  "Where do you see yourself in 5 years?",
  "Why are you leaving your current role?",
  "What salary range are you looking for?",
  "Are you authorized to work in this country?",
  "What is your availability / earliest start date?",
  "Do you require visa sponsorship?",
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy} className="shrink-0" style={{
      padding: "4px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12,
      background: copied ? "#dcfce7" : "#f9fafb", color: copied ? "#16a34a" : "#6b7280",
      cursor: text ? "pointer" : "not-allowed", transition: "all 0.2s", fontWeight: 500,
      opacity: text ? 1 : 0.4,
    }}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CopyAllButton({ getData, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = getData();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy} style={{
      padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 13,
      background: copied ? "#dcfce7" : "#2563eb", color: copied ? "#16a34a" : "#fff",
      cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
    }}>
      {copied ? "Copied!" : label || "Copy All"}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, multiline, style }) {
  const props = {
    value, onChange: e => onChange(e.target.value), placeholder,
    style: {
      width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
      fontSize: 14, fontFamily: "inherit", background: "#fff", resize: multiline ? "vertical" : undefined,
      minHeight: multiline ? 80 : undefined, ...style,
    },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>
        <CopyButton text={value} />
      </div>
      {multiline ? <textarea {...props} rows={3} /> : <input type={type} {...props} />}
    </div>
  );
}

function SectionCard({ title, icon, children, actions, collapsible, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
    }}>
      <div onClick={collapsible ? () => setOpen(!open) : undefined} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: open ? "1px solid #f3f4f6" : "none",
        cursor: collapsible ? "pointer" : "default", userSelect: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{title}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {actions}
          {collapsible && <span style={{ fontSize: 18, color: "#9ca3af", transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }}>▼</span>}
        </div>
      </div>
      {open && <div style={{ padding: "16px 20px" }}>{children}</div>}
    </div>
  );
}

function PersonalInfoSection({ profile, setProfile }) {
  const set = (key) => (val) => setProfile(p => ({ ...p, [key]: val }));
  const getAllText = () => {
    const p = profile;
    return [
      `${p.firstName} ${p.lastName}`.trim(),
      p.email, p.phone,
      [p.address, p.city, p.state, p.zip, p.country].filter(Boolean).join(", "),
      p.linkedin && `LinkedIn: ${p.linkedin}`,
      p.github && `GitHub: ${p.github}`,
      p.website && `Website: ${p.website}`,
      p.portfolio && `Portfolio: ${p.portfolio}`,
    ].filter(Boolean).join("\n");
  };
  return (
    <SectionCard title="Personal Information" icon="👤" collapsible actions={<CopyAllButton getData={getAllText} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Field label="First Name" value={profile.firstName} onChange={set("firstName")} placeholder="Jane" />
          <Field label="Last Name" value={profile.lastName} onChange={set("lastName")} placeholder="Doe" />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Field label="Email" value={profile.email} onChange={set("email")} type="email" placeholder="jane@example.com" />
          <Field label="Phone" value={profile.phone} onChange={set("phone")} type="tel" placeholder="+1 (555) 123-4567" />
        </div>
        <Field label="Street Address" value={profile.address} onChange={set("address")} placeholder="123 Main St, Apt 4B" />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Field label="City" value={profile.city} onChange={set("city")} placeholder="San Francisco" />
          <Field label="State" value={profile.state} onChange={set("state")} placeholder="CA" />
          <Field label="ZIP Code" value={profile.zip} onChange={set("zip")} placeholder="94102" />
          <Field label="Country" value={profile.country} onChange={set("country")} placeholder="United States" />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Field label="LinkedIn" value={profile.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/janedoe" />
          <Field label="GitHub" value={profile.github} onChange={set("github")} placeholder="github.com/janedoe" />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Field label="Website" value={profile.website} onChange={set("website")} placeholder="janedoe.dev" />
          <Field label="Portfolio" value={profile.portfolio} onChange={set("portfolio")} placeholder="dribbble.com/janedoe" />
        </div>
        <Field label="Professional Summary" value={profile.summary} onChange={set("summary")} multiline placeholder="Brief professional summary or bio..." />
      </div>
    </SectionCard>
  );
}

function WorkHistorySection({ jobs, setJobs }) {
  const add = () => setJobs(j => [...j, { ...EMPTY_JOB, id: Date.now() }]);
  const remove = (id) => setJobs(j => j.filter(x => x.id !== id));
  const update = (id, key, val) => setJobs(j => j.map(x => x.id === id ? { ...x, [key]: val } : x));
  const getJobText = (j) => [
    `${j.title}${j.company ? ` at ${j.company}` : ""}`,
    j.location,
    `${j.startDate || ""}${j.startDate || j.endDate ? " – " : ""}${j.current ? "Present" : j.endDate || ""}`,
    j.description,
  ].filter(Boolean).join("\n");
  const getAllText = () => jobs.map(getJobText).join("\n\n");

  return (
    <SectionCard title="Work Experience" icon="💼" collapsible actions={
      <div style={{ display: "flex", gap: 8 }}>
        <CopyAllButton getData={getAllText} />
        <button onClick={add} style={{
          padding: "6px 14px", borderRadius: 8, border: "1px solid #2563eb", fontSize: 13,
          background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 600,
        }}>+ Add</button>
      </div>
    }>
      {jobs.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20, margin: 0 }}>No work experience added yet. Click "+ Add" to get started.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {jobs.map((job, i) => (
          <div key={job.id} style={{ padding: 16, background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Position {i + 1}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <CopyAllButton getData={() => getJobText(job)} label="Copy Entry" />
                <button onClick={() => remove(job.id)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid #fca5a5", fontSize: 12,
                  background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500,
                }}>Remove</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Field label="Job Title" value={job.title} onChange={v => update(job.id, "title", v)} placeholder="Software Engineer" />
                <Field label="Company" value={job.company} onChange={v => update(job.id, "company", v)} placeholder="Acme Corp" />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Field label="Location" value={job.location} onChange={v => update(job.id, "location", v)} placeholder="San Francisco, CA" />
                <Field label="Start Date" value={job.startDate} onChange={v => update(job.id, "startDate", v)} placeholder="Jan 2023" />
                <Field label="End Date" value={job.endDate} onChange={v => update(job.id, "endDate", v)} placeholder="Dec 2024" style={{ opacity: job.current ? 0.4 : 1 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 4 }}>
                  <input type="checkbox" checked={job.current} onChange={e => update(job.id, "current", e.target.checked)} id={`cur-${job.id}`} />
                  <label htmlFor={`cur-${job.id}`} style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>Current</label>
                </div>
              </div>
              <Field label="Description / Responsibilities" value={job.description} onChange={v => update(job.id, "description", v)} multiline placeholder="• Led a team of 5 engineers...&#10;• Increased revenue by 20%..." />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function EducationSection({ education, setEducation }) {
  const add = () => setEducation(e => [...e, { ...EMPTY_EDU, id: Date.now() }]);
  const remove = (id) => setEducation(e => e.filter(x => x.id !== id));
  const update = (id, key, val) => setEducation(e => e.map(x => x.id === id ? { ...x, [key]: val } : x));
  const getEduText = (e) => [
    `${e.degree}${e.field ? ` in ${e.field}` : ""}`,
    e.school,
    `${e.startDate || ""}${e.startDate || e.endDate ? " – " : ""}${e.endDate || ""}`,
    e.gpa && `GPA: ${e.gpa}`,
    e.notes,
  ].filter(Boolean).join("\n");
  const getAllText = () => education.map(getEduText).join("\n\n");

  return (
    <SectionCard title="Education" icon="🎓" collapsible actions={
      <div style={{ display: "flex", gap: 8 }}>
        <CopyAllButton getData={getAllText} />
        <button onClick={add} style={{
          padding: "6px 14px", borderRadius: 8, border: "1px solid #2563eb", fontSize: 13,
          background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 600,
        }}>+ Add</button>
      </div>
    }>
      {education.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20, margin: 0 }}>No education added yet. Click "+ Add" to get started.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {education.map((edu, i) => (
          <div key={edu.id} style={{ padding: 16, background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Education {i + 1}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <CopyAllButton getData={() => getEduText(edu)} label="Copy Entry" />
                <button onClick={() => remove(edu.id)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid #fca5a5", fontSize: 12,
                  background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500,
                }}>Remove</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Field label="School / University" value={edu.school} onChange={v => update(edu.id, "school", v)} placeholder="Stanford University" />
                <Field label="Degree" value={edu.degree} onChange={v => update(edu.id, "degree", v)} placeholder="B.S." />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Field label="Field of Study" value={edu.field} onChange={v => update(edu.id, "field", v)} placeholder="Computer Science" />
                <Field label="GPA" value={edu.gpa} onChange={v => update(edu.id, "gpa", v)} placeholder="3.8 / 4.0" />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Field label="Start Date" value={edu.startDate} onChange={v => update(edu.id, "startDate", v)} placeholder="Sep 2019" />
                <Field label="End Date" value={edu.endDate} onChange={v => update(edu.id, "endDate", v)} placeholder="Jun 2023" />
              </div>
              <Field label="Notes / Honors" value={edu.notes} onChange={v => update(edu.id, "notes", v)} multiline placeholder="Dean's List, Relevant coursework..." />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SkillsSection({ skills, setSkills }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(s => [...s, trimmed]);
      setInput("");
    }
  };
  const remove = (skill) => setSkills(s => s.filter(x => x !== skill));
  const getAllText = () => skills.join(", ");

  return (
    <SectionCard title="Skills" icon="⚡" collapsible actions={<CopyAllButton getData={getAllText} />}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Type a skill and press Enter..."
          style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}
        />
        <button onClick={add} style={{
          padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13,
          background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 600,
        }}>Add</button>
      </div>
      {skills.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: 10, margin: 0 }}>No skills added yet.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {skills.map(skill => (
          <span key={skill} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 20, background: "#eff6ff",
            border: "1px solid #bfdbfe", fontSize: 13, color: "#1d4ed8", fontWeight: 500,
          }}>
            {skill}
            <CopyButton text={skill} />
            <button onClick={() => remove(skill)} style={{
              background: "none", border: "none", color: "#93c5fd", cursor: "pointer",
              fontSize: 16, lineHeight: 1, padding: 0, fontWeight: 700,
            }}>×</button>
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

function QASection({ qas, setQAs }) {
  const add = (question = "") => setQAs(q => [...q, { ...EMPTY_QA, question, id: Date.now() }]);
  const remove = (id) => setQAs(q => q.filter(x => x.id !== id));
  const update = (id, key, val) => setQAs(q => q.map(x => x.id === id ? { ...x, [key]: val } : x));
  const getAllText = () => qas.map(q => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");
  const existingQs = qas.map(q => q.question);
  const suggestions = SUGGESTED_QUESTIONS.filter(q => !existingQs.includes(q));

  return (
    <SectionCard title="Custom Q&A" icon="💬" collapsible defaultOpen={true} actions={
      <div style={{ display: "flex", gap: 8 }}>
        <CopyAllButton getData={getAllText} />
        <button onClick={() => add()} style={{
          padding: "6px 14px", borderRadius: 8, border: "1px solid #2563eb", fontSize: 13,
          background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 600,
        }}>+ Add</button>
      </div>
    }>
      {suggestions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 8px" }}>Quick add common questions:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {suggestions.map(q => (
              <button key={q} onClick={() => add(q)} style={{
                padding: "4px 10px", borderRadius: 16, border: "1px solid #e5e7eb",
                background: "#f9fafb", fontSize: 12, color: "#4b5563", cursor: "pointer",
              }}>{q}</button>
            ))}
          </div>
        </div>
      )}
      {qas.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20, margin: 0 }}>No Q&A pairs added yet. Click a suggestion above or "+ Add" to get started.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {qas.map((qa, i) => (
          <div key={qa.id} style={{ padding: 16, background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Q&A {i + 1}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <CopyAllButton getData={() => qa.answer} label="Copy Answer" />
                <button onClick={() => remove(qa.id)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid #fca5a5", fontSize: 12,
                  background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500,
                }}>Remove</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Question" value={qa.question} onChange={v => update(qa.id, "question", v)} placeholder="Why do you want to work here?" />
              <Field label="Your Answer" value={qa.answer} onChange={v => update(qa.id, "answer", v)} multiline placeholder="Write your prepared answer..." />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ExportImport({ profile, jobs, education, skills, qas, onImport }) {
  const fileRef = useRef(null);

  const handleExport = () => {
    const data = JSON.stringify({ profile, jobs, education, skills, qas, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "job-profile.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        onImport(data);
      } catch { alert("Invalid file format."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      <button onClick={handleExport} style={{
        padding: "10px 20px", borderRadius: 10, border: "none", fontSize: 14,
        background: "#059669", color: "#fff", cursor: "pointer", fontWeight: 600,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        ⬇ Export Profile (JSON)
      </button>
      <button onClick={() => fileRef.current?.click()} style={{
        padding: "10px 20px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14,
        background: "#fff", color: "#374151", cursor: "pointer", fontWeight: 600,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        ⬆ Import Profile
      </button>
      <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
    </div>
  );
}

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  return (
    <div style={{ position: "relative", maxWidth: 400, margin: "0 auto" }}>
      <input value={query} onChange={e => { setQuery(e.target.value); onSearch(e.target.value); }}
        placeholder="Search your profile..."
        style={{
          width: "100%", padding: "10px 16px 10px 38px", borderRadius: 10,
          border: "1px solid #d1d5db", fontSize: 14, background: "#fff",
        }}
      />
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 }}>🔍</span>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [jobs, setJobs] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [qas, setQAs] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleImport = (data) => {
    if (data.profile) setProfile(data.profile);
    if (data.jobs) setJobs(data.jobs);
    if (data.education) setEducation(data.education);
    if (data.skills) setSkills(data.skills);
    if (data.qas) setQAs(data.qas);
  };

  const tabs = [
    { id: "all", label: "All Sections" },
    { id: "personal", label: "Personal" },
    { id: "work", label: "Work" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "qa", label: "Q&A" },
  ];

  const show = (section) => activeTab === "all" || activeTab === section;

  const completionCount = [
    profile.firstName || profile.lastName ? 1 : 0,
    jobs.length > 0 ? 1 : 0,
    education.length > 0 ? 1 : 0,
    skills.length > 0 ? 1 : 0,
    qas.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 800, color: "#111827" }}>
            Job Application Auto-Fill
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 15 }}>
            Store your info once, copy-paste into any application instantly
          </p>
          {/* Progress */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 200, height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
              <div style={{ width: `${(completionCount / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{completionCount}/5 sections</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <SearchBar onSearch={setSearch} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, overflowX: "auto", padding: "2px 0", justifyContent: "center", flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600,
              background: activeTab === tab.id ? "#2563eb" : "rgba(255,255,255,0.7)",
              color: activeTab === tab.id ? "#fff" : "#6b7280",
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Export/Import */}
        <div style={{ marginBottom: 20 }}>
          <ExportImport profile={profile} jobs={jobs} education={education} skills={skills} qas={qas} onImport={handleImport} />
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {show("personal") && <PersonalInfoSection profile={profile} setProfile={setProfile} />}
          {show("work") && <WorkHistorySection jobs={jobs} setJobs={setJobs} />}
          {show("education") && <EducationSection education={education} setEducation={setEducation} />}
          {show("skills") && <SkillsSection skills={skills} setSkills={setSkills} />}
          {show("qa") && <QASection qas={qas} setQAs={setQAs} />}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32, color: "#9ca3af", fontSize: 12 }}>
          Tip: Use "Export Profile" to save your data as a JSON file, then "Import Profile" to reload it anytime.
        </div>
      </div>
    </div>
  );
}
