import TimelineItem from './TimelineItem';
import { timelineData } from '@/data/about/timeline';
import { H3 } from '@/components/ui/Typography';

const TimelineSection = () => {
  return (
    <div>
        <H3>EXPERIENCE</H3>
        
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
  );
};

export default TimelineSection;

