"use client";
import SkillCard from './SkillCard';
import { skillsData } from '@/data/about/skills';
import { H3 } from '@/components/ui/Typography';
import{motion, AnimatePresence, usePresenceData, wrap} from 'framer-motion';
import { useState } from 'react';
import CarouselButton from '@/components/CarouselButton';
import AnimatedSkillCard from './AnimatedSkillCard';
const SkillsSection = () => {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [direction, setDirection] = useState <1 | -1> (1);

  function setSkill (newDirection: 1 | -1) {
    if (skillsData.length === 0) return
    const nextIndex = wrap(0, skillsData.length, selectedSkillIndex + newDirection);
    setSelectedSkillIndex(nextIndex);
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
        <div className = "hidden sm:flex md:hidden items-center justify-center gap-10 ">
          <CarouselButton direction="left" onClick={() => setSkill(-1)} />
          <div className = "w-[300px] h-[300px]">
            
          <AnimatePresence
              custom={direction}
              mode="wait"
              initial={false}
          >
            {skillsData.length > 0 && (
              <AnimatedSkillCard key={skillsData[selectedSkillIndex].id} title={skillsData[selectedSkillIndex].title} skills={skillsData[selectedSkillIndex].skills} /> 
            )}
          </AnimatePresence>
          </div>
          <CarouselButton direction="right" onClick={() => setSkill(1)} />
        </div>
        <div className="sm:hidden flex flex-col items-center justify-center gap-4">
          <div className="h-[300px] w-[300px] self-center">
          <AnimatePresence 
            custom={direction}
            mode="wait" 
            initial={false}>
            {skillsData.length > 0 && (
              <AnimatedSkillCard 
                key={skillsData[selectedSkillIndex].id} 
                title={skillsData[selectedSkillIndex].title} 
                skills={skillsData[selectedSkillIndex].skills} 
                onSwipe={setSkill}
              />
            )}
          </AnimatePresence>
          </div>
          <div className="flex gap-4">
          {skillsData.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > selectedSkillIndex ? 1 : -1)
                setSelectedSkillIndex(i)
              }}
              className = {`h-2 rounded-full transition-all ${
            i === selectedSkillIndex ? 'w-3 bg-black' : 'w-2 bg-gray-300'
          }`}
          />
          ))}
        </div>
      </div>

  </div>
  );
};

export default SkillsSection;

