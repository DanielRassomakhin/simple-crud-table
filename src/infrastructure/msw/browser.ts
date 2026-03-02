import { setupWorker } from "msw/browser";
import { applicantsHandlers } from "./handlers/applicantsHandlers";

export const worker = setupWorker(...applicantsHandlers);
