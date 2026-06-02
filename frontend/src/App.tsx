import { GlobalNav } from "./components/GlobalNav";
import { SubNav } from "./components/SubNav";
import { HeroTile } from "./components/HeroTile";
import { ApiExplorer } from "./components/ApiExplorer";
import { AssignmentSection } from "./components/AssignmentSection";
import { SkillsSection } from "./components/SkillsSection";
import { AiUsageSection } from "./components/AiUsageSection";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="page">
      <GlobalNav />
      <SubNav />
      <HeroTile />
      <ApiExplorer />
      <AssignmentSection />
      <SkillsSection />
      <AiUsageSection />
      <Footer />
    </div>
  );
}

export default App;
