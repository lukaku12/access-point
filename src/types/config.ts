export type DoorLockVariant = 'SOLENOID' | 'MAGNETIC';

export interface Config {
  auth_key: string;
  door_lock_variant: DoorLockVariant;
  door_lock_duration: number;
  run_program_without_time: boolean;
  active: boolean;
}

export interface ConfigUpdatePayload {
  auth_key: string;
  config: Config;
}
