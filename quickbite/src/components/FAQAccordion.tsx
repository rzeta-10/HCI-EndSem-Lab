import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = active === index;
        return (
          <article key={item.question} className="doodle-line-item overflow-hidden">
            <button
              type="button"
              className="faq-toggle w-full text-left"
              onClick={() => setActive(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <span>{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? <p className="faq-content">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
