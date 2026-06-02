import { aiUsageSummary } from "../content/docs";
import "./DocSections.css";

export function AiUsageSection() {
  const s = aiUsageSummary;
  return (
    <section id="ai-usage" className="doc-section">
      <div className="container">
        <h2 className="doc-section__title">AI Usage</h2>
        <p className="doc-section__lead">
          Summary aligned with <code>AI_USAGE.md</code> at repository root.
          Full report includes tools, prompts, delegated tasks, and incorrect
          output handling.
        </p>

        <div className="ai-grid">
          <div className="card">
            <h3>Tools</h3>
            <ul>
              {s.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Key prompts</h3>
            <ol>
              {s.keyPrompts.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ol>
          </div>
          <div className="card">
            <h3>Delegated to AI</h3>
            <ul>
              {s.delegated.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Accepted</h3>
            <ul>
              {s.accepted.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Modified by developer</h3>
            <ul>
              {s.modified.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className="card ai-example">
            <h3>Incorrect AI output</h3>
            <p>
              <strong>Wrong:</strong> {s.incorrectAiExample.wrong}
            </p>
            <p>
              <strong>Fix:</strong> {s.incorrectAiExample.fix}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
