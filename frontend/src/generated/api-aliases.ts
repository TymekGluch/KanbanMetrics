import type { components, paths } from "./api-types";

export type ApiPaths = paths;
export type ApiSchemas = components["schemas"];
export type ApiPathKey = keyof ApiPaths;
export type ApiMethod<P extends ApiPathKey> = Exclude<keyof ApiPaths[P], "parameters">;
export type ApiOperation<P extends ApiPathKey, M extends ApiMethod<P>> = NonNullable<ApiPaths[P][M]>;

export type AuthLoginUserInput = ApiSchemas["auth.LoginUserInput"];
export type AuthRegisterUserInput = ApiSchemas["auth.RegisterUserInput"];
export type UsersUpdateUserHandlerInput = ApiSchemas["users.UpdateUserHandlerInput"];
export type UsersUser = ApiSchemas["users.User"];

export type PostAuthLoginRequestBody = ApiPaths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];
export type PostAuthLoginResponse200 = ApiPaths["/auth/login"]["post"]["responses"][200]["content"]["text/plain"];
export type PostAuthLoginSuccessResponse = PostAuthLoginResponse200;
export type PostAuthLoginResponse400 = ApiPaths["/auth/login"]["post"]["responses"][400]["content"]["text/plain"];
export type PostAuthLoginResponse401 = ApiPaths["/auth/login"]["post"]["responses"][401]["content"]["text/plain"];

export type PostAuthLogoutResponse200 = ApiPaths["/auth/logout"]["post"]["responses"][200]["content"]["text/plain"];
export type PostAuthLogoutSuccessResponse = PostAuthLogoutResponse200;

export type PostAuthRegisterRequestBody = ApiPaths["/auth/register"]["post"]["requestBody"]["content"]["application/json"];
export type PostAuthRegisterResponse201 = ApiPaths["/auth/register"]["post"]["responses"][201]["content"]["text/plain"];
export type PostAuthRegisterSuccessResponse = PostAuthRegisterResponse201;
export type PostAuthRegisterResponse400 = ApiPaths["/auth/register"]["post"]["responses"][400]["content"]["text/plain"];
export type PostAuthRegisterResponse500 = ApiPaths["/auth/register"]["post"]["responses"][500]["content"]["text/plain"];

export type DeleteUsersDeleteResponse200 = ApiPaths["/users/delete"]["delete"]["responses"][200]["content"]["text/plain"];
export type DeleteUsersDeleteSuccessResponse = DeleteUsersDeleteResponse200;
export type DeleteUsersDeleteResponse401 = ApiPaths["/users/delete"]["delete"]["responses"][401]["content"]["text/plain"];
export type DeleteUsersDeleteResponse500 = ApiPaths["/users/delete"]["delete"]["responses"][500]["content"]["text/plain"];

export type GetUsersMeResponse200 = ApiPaths["/users/me"]["get"]["responses"][200]["content"]["application/json"];
export type GetUsersMeSuccessResponse = GetUsersMeResponse200;
export type GetUsersMeResponse401 = ApiPaths["/users/me"]["get"]["responses"][401]["content"]["application/json"];
export type GetUsersMeResponse500 = ApiPaths["/users/me"]["get"]["responses"][500]["content"]["application/json"];

export type PutUsersUpdateRequestBody = ApiPaths["/users/update"]["put"]["requestBody"]["content"]["application/json"];
export type PutUsersUpdateResponse200 = ApiPaths["/users/update"]["put"]["responses"][200]["content"]["text/plain"];
export type PutUsersUpdateSuccessResponse = PutUsersUpdateResponse200;
export type PutUsersUpdateResponse400 = ApiPaths["/users/update"]["put"]["responses"][400]["content"]["text/plain"];
export type PutUsersUpdateResponse401 = ApiPaths["/users/update"]["put"]["responses"][401]["content"]["text/plain"];
export type PutUsersUpdateResponse500 = ApiPaths["/users/update"]["put"]["responses"][500]["content"]["text/plain"];
