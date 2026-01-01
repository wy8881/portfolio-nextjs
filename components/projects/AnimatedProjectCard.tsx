import { motion, usePresenceData, PanInfo } from "framer-motion";
import { Project } from '@/types/projects';
import ProjectCard from './ProjectCard';

interface AnimatedProjectCardProps {
    project: Project;
    isSmallScreen?: boolean;
    onSwipe?: (direction: 1 | -1) => void;
}

const swipeThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
}

const AnimatedProjectCard = ({project, isSmallScreen=false, onSwipe}: AnimatedProjectCardProps) => {
    const direction = usePresenceData();
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, {offset, velocity}: PanInfo) => {
        event.preventDefault();
        event.stopPropagation();
      const swipe = swipePower(offset.x, velocity.x);
      if (swipe > swipeThreshold) {
        onSwipe?.(-1);
      }else if (swipe < -swipeThreshold) {
        onSwipe?.(1);
      }
    }

    return (
        <motion.div
        //   drag="x"
        //   onDragEnd={handleDragEnd}
        //   dragConstraints={{left: 0, right: 0}}
        //   dragMomentum={false}
        //   dragElastic={0.5}
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
            exit={{opacity:0, x: direction * -50}}
            className="
                w-full
                h-full
                select-none
                touch-action-pan-y
                "
            >
            <ProjectCard project={project} isSmallScreen={isSmallScreen} />
        </motion.div>
    )
};

export default AnimatedProjectCard;

