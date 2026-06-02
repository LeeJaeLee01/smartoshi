import { assignmentWorkflow, orderLogic } from "../content/docs";
import "./DocSections.css";

export function AssignmentSection() {
  return (
    <section id="assignment" className="doc-section doc-section--dark">
      <div className="container">
        <h2 className="doc-section__title doc-section__title--light">
          Assignment Approach
        </h2>
        <p className="doc-section__lead doc-section__lead--light">
          How this backend test was handled: spec-first, skills-driven workflow,
          test-first implementation, and minimal scope aligned with{" "}
          <code>smartoshi.spec.md</code>.
        </p>

        <ol className="workflow-list">
          {assignmentWorkflow.map((item) => (
            <li key={item.step} className={item.done ? "done" : ""}>
              <span className="workflow-step">{item.step}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="order-logic card order-logic--on-dark">
          <h3>Market order logic</h3>
          <div className="order-logic__cols">
            <div>
              <h4>BUY</h4>
              <ol>
                {orderLogic.buy.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div>
              <h4>SELL</h4>
              <ol>
                {orderLogic.sell.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
          <p className="order-logic__note">{orderLogic.note}</p>
        </div>
      </div>
    </section>
  );
}
