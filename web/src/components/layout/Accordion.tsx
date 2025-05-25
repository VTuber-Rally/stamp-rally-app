import {
  AccordionContent,
  AccordionHeader,
  AccordionItem as AccordionItemPrimitive,
  Accordion as AccordionRoot,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { SquareChevronRight } from "lucide-react";
import { FC, ReactNode, forwardRef } from "react";

interface AccordionProps {
  children?: ReactNode;
}

export const Accordion: FC<AccordionProps> = ({ children }) => {
  return (
    <AccordionRoot
      type="single"
      collapsible
      className="bg-mauve6 divide-y-1 divide-gray-200 rounded-md border border-gray-200 shadow-[0_2px_10px] shadow-black/5"
    >
      {children}
    </AccordionRoot>
  );
};

interface AccordionItemProps {
  children?: ReactNode;
  title: string;
  value: string;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, title, value }, ref) => (
    <AccordionItemPrimitive
      value={value}
      className="mt-px overflow-hidden p-2 first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-tertiary"
      ref={ref}
    >
      <AccordionHeader>
        <AccordionTrigger className="group flex w-full cursor-pointer gap-1">
          <SquareChevronRight className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-90" />
          {title}
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className="overflow-hidden data-[state=closed]:animate-accordion-slide-up data-[state=open]:animate-accordion-slide-down">
        {children}
      </AccordionContent>
    </AccordionItemPrimitive>
  ),
);
AccordionItem.displayName = "AccordionItem";
