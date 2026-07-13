import { Hero } from "@/components/Hero";
import { Invitation } from "@/components/Invitation";
import { Countdown } from "@/components/Countdown";
import { Venue } from "@/components/Venue";
import { FinalScene } from "@/components/FinalScene";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Invitation />
      <Countdown />
      <Venue />
      <FinalScene />
    </main>
  );
}
