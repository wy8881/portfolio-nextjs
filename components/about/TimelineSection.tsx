import TimelineItem from './TimelineItem';
import { timelineData } from '@/data/about/timeline';

const TimelineSection = () => {
  return (
    <section
      className="w-full"
      aria-label="Experience timeline"
    >
      <div
        className="
          py-[clamp(3rem,6vh,4rem)]
          md:py-[clamp(4rem,8vh,6rem)]
        "
      >
        <h2
          className="
            font-sans
            text-[clamp(1.75rem,5vw,2.5rem)]
            md:text-[clamp(2rem,4vw+0.5rem,3rem)]
            font-bold
            tracking-[0.02em]
            text-black
            mb-[clamp(2rem,4vw,3rem)]
            md:mb-[clamp(3rem,5vw,4rem)]
          "
        >
          EXPERIENCE
        </h2>
        
        <div className="space-y-0">
          {[...timelineData].reverse().map((item, index, array) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={index === array.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;

