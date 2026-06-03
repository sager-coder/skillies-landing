/** Shared error type for the ticketing AI features. `status` maps to the
 *  HTTP status the route returns. */
export class TicketAiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "TicketAiError";
  }
}
