import SkillCard from './SkillCard';
import { skillsData } from '@/data/about/skills';
import { H3 } from '@/components/ui/Typography';

const SkillsSection = () => {
  return (
    <div>
        <H3>Skills & Expertise</H3>
        
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            md:gap-6
            lg:gap-8
          "
        >
          {skillsData.map((skill) => (
            <SkillCard
              key={skill.id}
              title={skill.title}
              skills={skill.skills}
            />
          ))}
        </div>
      </div>
  );
};

export default SkillsSection;

