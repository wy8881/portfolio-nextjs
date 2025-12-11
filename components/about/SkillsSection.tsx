import SkillCard from './SkillCard';
import { skillsData } from '@/data/about/skills';

const SkillsSection = () => {
  return (
    <section
      className="w-full"
      aria-label="Skills and expertise section"
    >
      <div
        className="
          py-[clamp(4rem,8vh,6rem)]
        "
      >
        <h2
          className="
            font-sans
            text-[clamp(2rem,4vw+0.5rem,3rem)]
            font-bold
            leading-[1.2]
            text-black
            mb-[clamp(2rem,4vw,3rem)]
          "
        >
          Skills & Expertise
        </h2>
        
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
    </section>
  );
};

export default SkillsSection;

