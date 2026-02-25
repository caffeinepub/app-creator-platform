import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FileData {
    content: string;
    filename: string;
}
export interface Message {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface SessionView {
    id: string;
    files: Array<FileData>;
    projectType: string;
    messages: Array<Message>;
    owner: Principal;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(sessionId: string, role: string, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSession(name: string, projectType: string): Promise<SessionView | null>;
    deleteSession(sessionId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getReadyStatus(): Promise<boolean>;
    getSession(sessionId: string): Promise<SessionView>;
    getSessions(): Promise<Array<SessionView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFiles(sessionId: string, filename: string, content: string): Promise<void>;
}
