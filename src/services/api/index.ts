export const AUTH_API = {
    SIGNUP: 'auth/v1/signup',
    LOIGN: 'auth/v1/token?grant_type=password',
    REFRESH_TOKEN: 'auth/v1/token?grant_type=refresh_token',
    
}

export const PROFILES_API = {
    PROFILE: 'rest/v1/profiles',
    AVATAR: 'storage/v1/object/avatars'
}

export const TASKS_API = {
    TASKS: 'rest/v1/tasks',
    TASK_GROUP: 'rest/v1/task_groups'
}