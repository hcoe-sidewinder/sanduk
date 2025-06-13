export interface Config {
  http: {
    port: number;
    cors: string;
  };

  db: {
    userName: string;
    password: string;
    url: string;
    name: string;
  };

  password: {
    salt: number;
  };

  jwt: {
    secretKey: string;
    refreshTokenExpiryMinute: number;
    accessTokenExpiryMinute: number;
  };
}
