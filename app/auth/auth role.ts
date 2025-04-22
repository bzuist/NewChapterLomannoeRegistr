
export enum ROLE {
  SUPER_USER = 'SUPER_USER',
  AUTHOR = 'AUTHOR',
}
export const ROLE_MAPPER: { [key: string]: string } = {
  [ROLE.SUPER_USER]: 'SUPER_USER',
  [ROLE.AUTHOR]: 'AUTHOR',
};
