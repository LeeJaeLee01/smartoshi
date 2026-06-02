import { getApiBase } from "../api/client";
import "./SubNav.css";

export function SubNav() {
  return (
    <div className="sub-nav">
      <div className="sub-nav__inner container">
        <span className="sub-nav__title">Mini Exchange Portfolio</span>
        <span className="sub-nav__api">
          API: {getApiBase() || "same origin (nginx → backend)"}
        </span>
      </div>
    </div>
  );
}
