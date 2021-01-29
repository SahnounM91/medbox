import { Role } from './role';

export class Account {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    specialty: string;
    region: string;
    role: Role;
    jwtToken?: string;
}
