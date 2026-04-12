"use client";

import { Certification } from "@/types/projects";
import { CardTitle, Body } from "@/components/ui/Typography";
import Link from "next/link";
interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard = ({ certification }: CertificationCardProps) => {
  return (
    <div
      className="
        bg-artifact
        border-2
        border-[#E5E5E5]
        rounded-2xl
        p-[clamp(1.5rem,3vw,2rem)]
        transition-all
        duration-300
        ease-out
        hover:border-black
        hover:translate-y-[-2px]
        relative
        z-[2]
      "
    >
      <CardTitle>{certification.name}</CardTitle>

      {certification.details && <Body>{certification.details}</Body>}

      <Body className="mb-4">Year: {certification.year}</Body>
      {certification.badge && (
        <Link
          href={certification.badge}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent"
        >
          View Badge →
        </Link>
      )}
    </div>
  );
};

export default CertificationCard;
