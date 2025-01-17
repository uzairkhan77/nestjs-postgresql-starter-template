import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { AbstractEntity } from './base.entity'
// import { Otp } from './otp.entity';
// import { OrganizationRole } from './organization-role.entity';
import { ProfileStatus, UserRoles } from 'src/types/enums/user.enum'
import { OrganizationRole } from './organization-role.entity'
import { Otp } from './otp.entity'
import { Exclude } from 'class-transformer'

@Entity('user')
export class User extends AbstractEntity {
    @Column({ name: 'first_name' })
    firstName: string

    @Column({ name: 'last_name' })
    lastName: string

    @Column({ name: 'email', unique: true })
    email: string

    @Column({ name: 'password' })
    @Exclude()
    password: string

    @Column({ name: 'organization_name', nullable: true })
    organizationName: string

    @Column({ name: 'total_storage', default: 0 })
    totalStorage: number

    @Column({ name: 'is_onboarded', default: false, nullable: true })
    isOnboarded: boolean

    @Column({ name: 'used_storage', default: 0 })
    usedStorage: number

    @Column({
        name: 'profile_status',
        default: ProfileStatus.UNVERIFIED,
        type: 'enum',
        enum: ProfileStatus,
    })
    profileStatus: ProfileStatus

    @Column({ name: 'role', type: 'enum', enum: UserRoles })
    role: UserRoles

    @Column({ name: 'last_login_at', nullable: true, type: 'timestamptz' })
    lastLoginAt: Date

    @Column({ name: 'deactivated_at', nullable: true, type: 'timestamptz' })
    deactivatedAt: Date

    /**
     * Relations
     */
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'deactivated_by_user_id' })
    deactivatedBy: User | null

    @OneToMany(() => Otp, otp => otp.user)
    otps: Otp[]

    @ManyToOne(() => OrganizationRole, organizationRole => organizationRole.user, { nullable: true })
    @JoinColumn({ name: 'organization_role_id' })
    organizationRole: OrganizationRole | null
}
