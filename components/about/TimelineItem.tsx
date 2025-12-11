import { TimelineItem as TimelineItemType } from '@/types/about';

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
          <h3
            className="
              text-[clamp(1.125rem,2vw,1.375rem)]
              font-semibold
              leading-[1.3]
              text-black
            "
          >
            {item.title}
          </h3>
          
          <p
            className="
              text-[clamp(1rem,1.5vw,1.125rem)]
              text-[#666666]
              mb-3
            "
          >
            {item.organization}
          </p>
          
          <ul
            className="
              space-y-2
              text-[clamp(0.9375rem,1.5vw,1.0625rem)]
              text-[#555555]
              leading-[1.7]
              ml-5
            "
          >
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
                {highlight}
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
        
        <h3
          className="
            text-[clamp(1.125rem,3.5vw,1.25rem)]
            font-semibold
            leading-[1.3]
            text-black
            mb-1
          "
        >
          {item.title}
        </h3>
        
        <p
          className="
            text-[clamp(0.9375rem,2.5vw,1rem)]
            text-[#666666]
            mb-3
          "
        >
          {item.organization}
        </p>
        
        <ul
          className="
            space-y-2
            text-[clamp(0.9375rem,2.5vw,1rem)]
            text-[#555555]
            leading-[1.7]
            ml-5
          "
        >
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
              {highlight}
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

