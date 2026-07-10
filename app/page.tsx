import { Hero } from "@/components/Hero";
import { Envelope } from "@/components/Envelope";
import { Invitation } from "@/components/Invitation";
import { Countdown } from "@/components/Countdown";
import { Venue } from "@/components/Venue";
import { FinalScene } from "@/components/FinalScene";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Envelope />
      <Invitation />
      <Countdown />
      <Venue />
      <FinalScene />
    </main>
  );
}
