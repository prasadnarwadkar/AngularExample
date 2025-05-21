export const config: AppConfig = window['config' as keyof Window]

export interface AppConfig {
    apiBaseUrl: string;
    authApiExternal: string;
}