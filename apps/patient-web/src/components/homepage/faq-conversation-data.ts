export interface FaqItemSpec {
  id: string;
  questionId: string;
  answerId: string;
}

export const faqItems: FaqItemSpec[] = Array.from({ length: 12 }, (_, index) => {
  const n = index + 1;
  return {
    id: `q${n}`,
    questionId: `marketing-home.faq-conversation.q${n}.question`,
    answerId: `marketing-home.faq-conversation.q${n}.answer`
  };
});
