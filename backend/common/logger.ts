export const Logger = {
  info: (message: string) => {
    console.log(message);
  },
  error: (message: string | Error, error: Error | undefined | unknown = undefined) => {
    console.error(message, error);
  },
};
