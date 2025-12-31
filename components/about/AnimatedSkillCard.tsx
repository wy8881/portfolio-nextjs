import { motion } from "framer-motion";
import {CardTitle, Body} from "@/components/ui/Typography";
import { usePresenceData } from "framer-motion";
import { forwardRef } from "react";

interface AnimatedSkillCardProps {
    title: string;
    skills: string[];
}

const AnimatedSkillCard = ({title, skills}: AnimatedSkillCardProps) => {
    const direction = usePresenceData();

    return (
        <motion.div
            initial={{opacity:0, x: direction * 50}}
            animate={{
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    delay:0.2,
                    duration: 0.2,
                    ease: "easeOut",
                }
            }}
            exit={{opacity:0, x: direction * 50}}
            className="
                w-full
                h-full
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
        </motion.div>
    )
};

export default AnimatedSkillCard;