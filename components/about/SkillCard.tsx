'use client'

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
      <h3
        className="
          font-sans
          text-[clamp(1.125rem,2vw,1.375rem)]
          font-semibold
          mb-4
          text-black
          leading-[1.3]
        "
      >
        {title}
      </h3>
      
      <ul
        className="
          list-none
          p-0
          space-y-2
        "
      >
        {skills.map((skill, index) => (
          <li
            key={index}
            className="
              font-sans
              text-[clamp(0.875rem,1.5vw,1rem)]
              text-[#333333]
              leading-[1.6]
              pl-5
              relative
              before:content-['•']
              before:absolute
              before:left-0
              before:text-black
              before:font-semibold
            "
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCard;

