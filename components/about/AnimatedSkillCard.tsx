import { motion } from "framer-motion";
import { usePresenceData, PanInfo } from "framer-motion";
import SkillCard from "./SkillCard";

interface AnimatedSkillCardProps {
    title: string;
    skills: string[];
    onSwipe?: (direction: 1 | -1) => void;
}

const swipeThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
}

const AnimatedSkillCard = ({title, skills, onSwipe}: AnimatedSkillCardProps) => {
    const direction = usePresenceData();
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, {offset, velocity}: PanInfo) => {
      const swipe = swipePower(offset.x, velocity.x);
      if (swipe > swipeThreshold) {
        onSwipe?.(-1);
      }else if (swipe < -swipeThreshold) {
        onSwipe?.(1);
      }
    }

    return (
        <motion.div
          drag="x"
          dragConstraints={{left: 0, right: 0}}
          onDragEnd={handleDragEnd}
          dragElastic={0.5}
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
          className="w-full h-full select-none touch-action-pan-y"
        >
          <SkillCard title={title} skills={skills} />
        </motion.div>
    )
};

export default AnimatedSkillCard;