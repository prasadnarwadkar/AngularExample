export const config: AppConfig = window['config' as keyof Window]

export interface AppConfig {
    apiBaseUrl: string;
    apiBaseUrl2: string;
}