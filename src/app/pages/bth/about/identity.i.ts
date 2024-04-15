/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-interface */

export interface ArchiveRes {
    statusCode: number;
    pid: string;
}

export interface UserIdentity {
    email: Email | null;
    given_name: string | null;
    phone_number: PhoneNumber;
    created_at: DateTime | null;
    updated_at: DateTime | null;
    email_verified: boolean | null;
    phone_verified: boolean;
    identities: Identity[];
    app_metadata: AppMetadata;
    user_metadata: UserMetadata;
    blocked: boolean;
    family_name: string | null;
}

interface Identity {
    connection: string;
    user_id: string;
    provider: string;
    isSocial: boolean;
}

interface AppMetadata {
    comments: boolean;
    follows: boolean;
    broadcast: boolean;

    push_notification: 'everything' | 'SAE' | 'nopushnotify';
}

interface UserMetadata {
    profile_info: string;
    secondary_email: string | null;
    about: string;
}

export interface BaseIdentity {
    user_id: UUID;
    username: string;
    name: string | null;

    picture?: string;
    user_metadata: UserMetadata;
}

export interface BaseIdentityFormData {
    username: string;
    name: string | null;
    picture: string | null;
    profile: string;
    email: string | null;
    about: string;
}

type UUID = string;
type Email = string;
type PhoneNumber = string;
type DateTime = string;
