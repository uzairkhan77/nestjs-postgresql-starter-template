// NestJS
import { Injectable } from '@nestjs/common'

// Entities
import { User } from '../auth/entity/user.entity'

// TypeORM
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

// DTOs
import { ICreateUserDTO } from 'src/types/types'

// Types and Enums
import { UserRoles } from 'src/types/enums/user.enum'
import { dashboardUsersCounts } from 'src/types/types/interface/response.interface'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
    /**
     * @description Find user by email
     * @param email string
     * @returns user
     * */
    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email })
    }

    /**
     * @description Find user by id
     * @param id string
     * @returns user
     * */
    findById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id })
    }

    /**
     * @description Create a new user
     * @param user object
     * @returns updated user
     */
    createUser(user: ICreateUserDTO): Promise<User> {
        return this.usersRepository.save({ ...user })
    }

    /**
     * @description Update user
     * @param user object
     * @returns updated user
     */
    save(user: User): Promise<User> {
        return this.usersRepository.save(user)
    }

    /**
     * @description Get all users
     * @returns users
     * */
    async getUsersCounts(): Promise<dashboardUsersCounts> {
        const counts = await this.usersRepository.count({
            where: {
                role: UserRoles.USER,
            },
        })
        return { totalUsers: counts, completedOrders: 0, onGoingOrders: 0 }
    }

    /**
     * @description Get active users stats in a calendar year
     * @param year string
     * @returns users
     * Active Users:
     * - More users are logging in or using the platform.
     * - Orders are being placed and chat is taking place bw user and admin
     * - More new subscriptions taking place
     */
    async getActiveUsersStatsInYear(year: string): Promise<{ [key: string]: number }> {
        try {
            // Create a new date range for the given year
            const startDate = new Date(`${year}-01-01T00:00:00.000Z`)
            const endDate = new Date(`${year}-12-31T23:59:59.999Z`)

            // Use the query builder to fetch the active users count by month
            const result = await this.usersRepository
                .createQueryBuilder('user')
                .select('EXTRACT(MONTH FROM user.lastLoginAt)', 'month') // Extract month from lastLoginAt
                .addSelect('COUNT(user.id)', 'count') // Count number of users for each month
                .where('user.lastLoginAt BETWEEN :startDate AND :endDate', { startDate, endDate })
                .groupBy('EXTRACT(MONTH FROM user.lastLoginAt)') // Group by month
                .orderBy('month', 'ASC') // Sort by month
                .getRawMany()

            // Login to be implemented in the future
            // 1. Orders are being placed and chat is taking place bw user and admin
            // 2. More new subscriptions taking place

            return result as unknown as { [key: string]: number }
        } catch (error) {
            throw error
        }
    }
}
