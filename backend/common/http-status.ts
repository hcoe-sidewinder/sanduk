export enum HTTPStatus {
  /* Successful */
  SUCCESS = 200,
  CREATED = 201,

  /* Client Error */
  BAD_REQUEST = 400,
  NOT_AUTHORIZED = 401,
  PERMISSION_DENIED = 403,
  NOT_FOUND = 404,

  /* Server Error */
  INTERNAL_SERVER_ERROR = 500,
}
