import { motion } from "framer-motion";

interface CarouselButtonProps {
    direction: "left" | "right";
    onClick: () => void;
    disabled?: boolean;
}

const CarouselButton = ({
    direction,
    onClick,
    disabled = false,
}: CarouselButtonProps) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className="
            w-11 h-11
            rounded-full
            bg-white
            border-2 border-black
            flex items-center justify-center
            cursor-pointer
            disabled:opacity-30
            disabled:cursor-not-allowed
            "
            whileHover={{scale: 1.1,backgroundColor: "#000000"}}
            whileTap={{scale: 0.95}}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            aria-label = {direction === "left" ? "Previous" : "Next"}
        >
        <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5 stroke-black stroke-2"
        initial={{stroke: "#000000"}}
        whileHover={{stroke: "#ffffff"}}
      >
        {direction === "left" ? (
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </motion.svg>
        </motion.button>
    )
}   

export default CarouselButton;