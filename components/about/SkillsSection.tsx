"use client";
import SkillCard from './SkillCard';
import { skillsData } from '@/data/about/skills';
import { H3 } from '@/components/ui/Typography';
import{motion, AnimatePresence, usePresenceData, wrap} from 'framer-motion';
import { useState } from 'react';
import CarouselButton from '@/components/CarouselButton';
import AnimatedSkillCard from './AnimatedSkillCard';
const SkillsSection = () => {
  const skillIndex = Array.from({length: skillsData.length}, (_, i) => i+1);
  const [selectedSkill, setSelectedSkill] = useState(skillIndex[0]);
  const [direction, setDirection] = useState <1 | -1> (1);

  function setSkill (newDirection: 1 | -1) {
    const nextSkill = wrap(1, skillsData.length+1, selectedSkill + newDirection);
    setSelectedSkill(nextSkill);
    setDirection(newDirection);
  }
  return (
    <div className="flex flex-col gap-12">
        <H3>Skills & Expertise</H3>
        
        <div
          className="
            hidden
            md:grid
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
        <div className = "md:hidden flex items-center justify-center gap-10 ">
          <CarouselButton direction="left" onClick={() => setSkill(-1)} />
          <div className = "w-[300px] h-[300px]">
            
          <AnimatePresence
              custom={direction}
              mode="wait"
              initial={false}
          >
            <AnimatedSkillCard key={selectedSkill} title={skillsData[selectedSkill-1].title} skills={skillsData[selectedSkill-1].skills} /> 
          </AnimatePresence>
          </div>
          <CarouselButton direction="right" onClick={() => setSkill(1)} />

        </div>
      </div>

  );
};

export default SkillsSection;

