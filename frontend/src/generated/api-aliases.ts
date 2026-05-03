import type { components, paths } from "./api-types";

export type ApiPaths = paths;
export type ApiSchemas = components["schemas"];
export type ApiPathKey = keyof ApiPaths;
export type ApiMethod<P extends ApiPathKey> = Exclude<keyof ApiPaths[P], "parameters">;
export type ApiOperation<P extends ApiPathKey, M extends ApiMethod<P>> = NonNullable<ApiPaths[P][M]>;

export type AppErrorsAppError = ApiSchemas["appErrors.AppError"];
export type AppErrorsFieldError = ApiSchemas["appErrors.FieldError"];
export type AppErrorsValidationErrorResponse = ApiSchemas["appErrors.ValidationErrorResponse"];
export type AuthLoginUserInput = ApiSchemas["auth.LoginUserInput"];
export type AuthRegisterUserInput = ApiSchemas["auth.RegisterUserInput"];
export type UsersUpdateUserHandlerInput = ApiSchemas["users.UpdateUserHandlerInput"];
export type UsersUser = ApiSchemas["users.User"];
export type WorkspaceListWorkspacesResult = ApiSchemas["workspace.ListWorkspacesResult"];
export type WorkspaceWorkspace = ApiSchemas["workspace.Workspace"];
export type WorkspaceRouterCreateWorkspaceRequest = ApiSchemas["workspaceRouter.createWorkspaceRequest"];
export type WorkspaceRouterListWorkspacesRequest = ApiSchemas["workspaceRouter.listWorkspacesRequest"];

export type PostApiAuthLoginRequestBody = ApiPaths["/api/auth/login"]["post"]["requestBody"]["content"]["application/json"];
export type PostApiAuthLoginResponse200 = ApiPaths["/api/auth/login"]["post"]["responses"][200]["content"]["text/plain"];
export type PostApiAuthLoginSuccessResponse = PostApiAuthLoginResponse200;
export type PostApiAuthLoginResponse400 = ApiPaths["/api/auth/login"]["post"]["responses"][400]["content"]["text/plain"];
export type PostApiAuthLoginResponse401 = ApiPaths["/api/auth/login"]["post"]["responses"][401]["content"]["text/plain"];

export type PostApiAuthLogoutResponse200 = ApiPaths["/api/auth/logout"]["post"]["responses"][200]["content"]["text/plain"];
export type PostApiAuthLogoutSuccessResponse = PostApiAuthLogoutResponse200;

export type PostApiAuthRegisterRequestBody = ApiPaths["/api/auth/register"]["post"]["requestBody"]["content"]["application/json"];
export type PostApiAuthRegisterResponse201 = ApiPaths["/api/auth/register"]["post"]["responses"][201]["content"]["text/plain"];
export type PostApiAuthRegisterSuccessResponse = PostApiAuthRegisterResponse201;
export type PostApiAuthRegisterResponse400 = ApiPaths["/api/auth/register"]["post"]["responses"][400]["content"]["text/plain"];
export type PostApiAuthRegisterResponse409 = ApiPaths["/api/auth/register"]["post"]["responses"][409]["content"]["text/plain"];
export type PostApiAuthRegisterResponse500 = ApiPaths["/api/auth/register"]["post"]["responses"][500]["content"]["text/plain"];

export type DeleteApiUserDeleteResponse200 = ApiPaths["/api/user/delete"]["delete"]["responses"][200]["content"]["text/plain"];
export type DeleteApiUserDeleteSuccessResponse = DeleteApiUserDeleteResponse200;
export type DeleteApiUserDeleteResponse401 = ApiPaths["/api/user/delete"]["delete"]["responses"][401]["content"]["text/plain"];
export type DeleteApiUserDeleteResponse500 = ApiPaths["/api/user/delete"]["delete"]["responses"][500]["content"]["text/plain"];

export type GetApiUserMeResponse200 = ApiPaths["/api/user/me"]["get"]["responses"][200]["content"]["application/json"];
export type GetApiUserMeSuccessResponse = GetApiUserMeResponse200;
export type GetApiUserMeResponse401 = ApiPaths["/api/user/me"]["get"]["responses"][401]["content"]["application/json"];
export type GetApiUserMeResponse500 = ApiPaths["/api/user/me"]["get"]["responses"][500]["content"]["application/json"];

export type PutApiUserUpdateRequestBody = ApiPaths["/api/user/update"]["put"]["requestBody"]["content"]["application/json"];
export type PutApiUserUpdateResponse200 = ApiPaths["/api/user/update"]["put"]["responses"][200]["content"]["text/plain"];
export type PutApiUserUpdateSuccessResponse = PutApiUserUpdateResponse200;
export type PutApiUserUpdateResponse400 = ApiPaths["/api/user/update"]["put"]["responses"][400]["content"]["text/plain"];
export type PutApiUserUpdateResponse401 = ApiPaths["/api/user/update"]["put"]["responses"][401]["content"]["text/plain"];
export type PutApiUserUpdateResponse500 = ApiPaths["/api/user/update"]["put"]["responses"][500]["content"]["text/plain"];

export type GetApiWorkspacesRequestBody = ApiPaths["/api/workspaces"]["get"]["requestBody"]["content"]["application/json"];
export type GetApiWorkspacesResponse200 = ApiPaths["/api/workspaces"]["get"]["responses"][200]["content"]["application/json"];
export type GetApiWorkspacesSuccessResponse = GetApiWorkspacesResponse200;
export type GetApiWorkspacesResponse400 = ApiPaths["/api/workspaces"]["get"]["responses"][400]["content"]["application/json"];
export type GetApiWorkspacesResponse401 = ApiPaths["/api/workspaces"]["get"]["responses"][401]["content"]["application/json"];
export type GetApiWorkspacesResponse403 = ApiPaths["/api/workspaces"]["get"]["responses"][403]["content"]["application/json"];
export type GetApiWorkspacesResponse500 = ApiPaths["/api/workspaces"]["get"]["responses"][500]["content"]["application/json"];

export type GetApiWorkspacesIdResponse200 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][200]["content"]["application/json"];
export type GetApiWorkspacesIdSuccessResponse = GetApiWorkspacesIdResponse200;
export type GetApiWorkspacesIdResponse400 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][400]["content"]["application/json"];
export type GetApiWorkspacesIdResponse401 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][401]["content"]["application/json"];
export type GetApiWorkspacesIdResponse403 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][403]["content"]["application/json"];
export type GetApiWorkspacesIdResponse404 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][404]["content"]["application/json"];
export type GetApiWorkspacesIdResponse408 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][408]["content"]["application/json"];
export type GetApiWorkspacesIdResponse500 = ApiPaths["/api/workspaces/{id}"]["get"]["responses"][500]["content"]["application/json"];

export type PostApiWorkspacesCreateRequestBody = ApiPaths["/api/workspaces/create"]["post"]["requestBody"]["content"]["application/json"];
export type PostApiWorkspacesCreateResponse201 = ApiPaths["/api/workspaces/create"]["post"]["responses"][201]["content"]["application/json"];
export type PostApiWorkspacesCreateSuccessResponse = PostApiWorkspacesCreateResponse201;
export type PostApiWorkspacesCreateResponse400 = ApiPaths["/api/workspaces/create"]["post"]["responses"][400]["content"]["application/json"];
export type PostApiWorkspacesCreateResponse401 = ApiPaths["/api/workspaces/create"]["post"]["responses"][401]["content"]["application/json"];
export type PostApiWorkspacesCreateResponse500 = ApiPaths["/api/workspaces/create"]["post"]["responses"][500]["content"]["application/json"];
