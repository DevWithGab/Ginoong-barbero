import { WhyChooseUsDesktop } from './WhyChooseUsDesktop';
import { WhyChooseUsMobile } from './WhyChooseUsMobile';

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-vintage-tan/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-vintage-tan/5 blur-[150px] rounded-full pointer-events-none" />
      <WhyChooseUsDesktop />
      <WhyChooseUsMobile />
    </section>
  );
}
