export abstract class ILogger {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   abstract error(message: string, ...meta: any[]): void;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   abstract log(message: string, ...meta: any[]): void;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   abstract warn(message: string, ...meta: any[]): void;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   abstract debug(message: string, ...meta: any[]): void;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   abstract setContext(context: string): void;
}
