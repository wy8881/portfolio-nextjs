'use client'

import { CardTitle, Body } from '@/components/ui/Typography'

interface SkillCardProps {
  title: string;
  skills: string[];
}

const SkillCard = ({ title, skills }: SkillCardProps) => {
  return (
    <div
      className="
        bg-white
        border-2
        border-black
        rounded-2xl
        p-[clamp(1.5rem,3vw,2rem)]
        transition-all
        duration-300
        ease-out
        hover:translate-y-[-4px]
        hover:shadow-[8px_8px_0px_0px_#000000]
      "
    >
      <CardTitle>{title}</CardTitle>
      
      <ul className="list-none p-0 space-y-2">
        {skills.map((skill, index) => (
          <li
            key={index}
            className="
              pl-5
              relative
              before:content-['•']
              before:absolute
              before:left-0
              before:text-black
              before:font-semibold
            "
          >
            <Body as="span">{skill}</Body>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCard;

