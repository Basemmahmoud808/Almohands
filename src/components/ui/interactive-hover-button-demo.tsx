import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function InteractiveHoverButtonDemo() {
  return (
    <div className="relative flex justify-center p-4">
      <InteractiveHoverButton text="تصفّح الكورسات" className="w-40 text-xs font-black bg-[#235d3a] hover:bg-[#1b4a2e] text-white border border-[#73c088]/40 shadow-lg" />
    </div>
  );
}

export { InteractiveHoverButtonDemo };
