import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUserPromptDescription(user: User): string {
  let description = '';
  if (user?.first_name) {
    description += `You're assistant to ${user.first_name} ${user?.last_name} who is a ${user.job_title}.`;
  }
  if (user?.organization_name) {
    description += `Their organization is: ${user.organization_name}.`;
  }
  return description;
}

export function getReplyLengthInstructions(length: string, customSentences: string): string {
  if (customSentences) {
    return `STRICT RULE: Each variation must be exactly ${customSentences} ${customSentences.length > 1 ? "sentences" : "sentence"} long.`;
  }
  switch (length) {
    case "short":
      return "1-2 sentences: concise and focused.";
    case "medium":
      return "3-5 sentences: balanced and comprehensive.";
    case "long":
      return "5-10 sentences: detailed and thorough.";
    default:
      return "Default reply length.";
  }
}

export function getDocLengthInstructions(length: string, customParagraphs: string): string {
  if (customParagraphs) {
    return `STRICT RULE: The document must be exactly ${customParagraphs} ${customParagraphs.length > 1 ? "paragraphs" : "paragraph"} long.`;
  }
  switch (length) {
    case "short":
      return "1-4 paragraphs: concise and focused.";
    case "medium":
      return "5-9 paragraphs: balanced and comprehensive.";
    case "long":
      return "10-15 paragraphs: detailed and thorough.";
    default:
      return "Default document length.";
  }
}