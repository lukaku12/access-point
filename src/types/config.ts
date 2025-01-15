export type DoorLockVariant = 'SOLENOID' | 'MAGNETIC';

// Base configuration interface
interface BaseConfig {
    door_lock_variant: DoorLockVariant;
    door_lock_duration: number;
    run_program_without_time: boolean;
    active: boolean;
}

// Response configuration
export interface Config extends BaseConfig {
    auth_key: string;
}

// Payload for updating configuration
export interface ConfigPayload extends BaseConfig {
    current_auth_key: string;
    auth_key: string;
}

export interface ConfigUpdatePayload {
    config: ConfigPayload;
}
