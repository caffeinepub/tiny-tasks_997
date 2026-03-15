import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: bigint;
    title: string;
    completed: boolean;
    dueDate?: Time;
    notes?: string;
    priority: string;
}
export type Time = bigint;
export interface backendInterface {
    createTask(title: string, dueDate: Time | null, priority: string, notes: string | null): Promise<bigint>;
    getDisplayName(): Promise<string | null>;
    getTasks(): Promise<Array<Task>>;
    setDisplayName(displayName: string): Promise<void>;
    updateTask(id: bigint, title: string, dueDate: Time | null, priority: string, notes: string | null, completed: boolean): Promise<boolean>;
}
