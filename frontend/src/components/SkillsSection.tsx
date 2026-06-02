import { skillsInfo } from "../content/docs";
import "./DocSections.css";

export function SkillsSection() {
  return (
    <section id="skills" className="doc-section doc-section--parchment">
      <div className="container">
        <h2 className="doc-section__title">Cursor Skills</h2>
        <p className="doc-section__lead">
          Two project skills standardize kickoff prompts and the full
          implementation checklist. Implementation follows the assignment skill
          after skills are written.
        </p>

        <div className="skills-grid">
          {skillsInfo.map((skill) => (
            <article key={skill.name} className="card skill-card">
              <h3>{skill.name}</h3>
              <code className="skill-path">{skill.path}</code>
              <p>{skill.purpose}</p>
              {"prompts" in skill ? (
                <ul>
                  {skill.prompts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : (
                <ul>
                  {skill.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
