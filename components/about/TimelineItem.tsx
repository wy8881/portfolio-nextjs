import { TimelineItem as TimelineItemType } from '@/types/about';
import { CardTitle, Body } from '@/components/ui/Typography';

interface TimelineItemProps {
  item: TimelineItemType;
  isLast: boolean;
}

const TimelineItem = ({ item, isLast }: TimelineItemProps) => {
  return (
    <>
      <div
        className="
          hidden
          md:grid
          md:grid-cols-[120px_1fr]
          md:gap-8
          md:items-start
        "
      >
        <div
          className="
            text-[clamp(1.125rem,1.5vw,1.25rem)]
            font-bold
            leading-[1.3]
            text-black
            text-left
          "
        >
          {item.period}
        </div>
        
        <div className="space-y-3">
          <CardTitle>{item.title}</CardTitle>
          
          <Body>{item.organization}</Body>
          
          <ul className="space-y-2 ml-5">
            {item.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className="
                  relative
                  pl-5
                  before:content-['•']
                  before:absolute
                  before:left-0
                  before:text-black
                  before:font-semibold
                "
              >
                <Body>{highlight}</Body>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="md:hidden mb-8">
        <div
          className="
            text-[clamp(1rem,3vw,1.125rem)]
            font-bold
            text-black
            mb-2
          "
        >
          {item.period}
        </div>
        
        <CardTitle>{item.title}</CardTitle>
        
        <Body>{item.organization}</Body>
        
        <ul className="space-y-2 ml-5">
          {item.highlights.map((highlight, idx) => (
            <li
              key={idx}
              className="
                relative
                pl-5
                before:content-['•']
                before:absolute
                before:left-0
                before:text-black
                before:font-semibold
              "
            >
              <Body>{highlight}</Body>
            </li>
          ))}
        </ul>
      </div>
      
      {!isLast && (
        <hr
          className="
            border-t
            border-[#e5e5e5]
            my-8
            md:my-10
          "
        />
      )}
    </>
  );
};

export default TimelineItem;

